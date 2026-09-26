import { and, eq, inArray, lt, sql } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import { invalidate } from "./redis";
import { syncProductToSearch } from "./indexing";

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

/**
 * Cancels an order inside a transaction and returns reserved stock.
 * Only pending/confirmed orders can be cancelled. Returns the affected product ids.
 */
export async function cancelOrderTx(tx: Tx, orderId: number, opts: { userId?: number } = {}) {
  const [order] = await tx
    .select()
    .from(orders)
    .where(opts.userId ? and(eq(orders.id, orderId), eq(orders.userId, opts.userId)) : eq(orders.id, orderId))
    .for("update");
  if (!order || !["pending", "confirmed"].includes(order.status)) return [];
  const items = await tx.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  for (const it of items) {
    if (it.productId)
      await tx.update(products).set({ stock: sql`${products.stock} + ${it.quantity}` }).where(eq(products.id, it.productId));
  }
  await tx
    .update(orders)
    .set({
      status: "cancelled",
      paymentStatus: order.paymentStatus === "paid" ? "refunded" : order.paymentStatus,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId));
  return items.map((i) => i.productId).filter((x): x is number => !!x);
}

/** Drop caches, update search docs and return product slugs so callers can revalidate pages. */
export async function afterStockChange(ids: number[]) {
  if (!ids.length) return [];
  await invalidate("product:", "catalog:", "search:");
  await Promise.all(ids.map((id) => syncProductToSearch(id)));
  return (await db.select({ slug: products.slug }).from(products).where(inArray(products.id, ids))).map((r) => r.slug);
}

/**
 * Marks a gateway order as paid. Idempotent: safe to call from both the checkout callback and the webhook.
 * Returns the local order id, or null if no pending order matches.
 */
export async function markGatewayOrderPaid(gatewayOrderId: string, paymentId: string) {
  const [row] = await db
    .update(orders)
    .set({ status: "confirmed", paymentStatus: "paid", gatewayPaymentId: paymentId, updatedAt: new Date() })
    .where(and(eq(orders.gatewayOrderId, gatewayOrderId), eq(orders.status, "pending")))
    .returning({ id: orders.id });
  if (row) return row.id;
  const [existing] = await db
    .select({ id: orders.id, paymentStatus: orders.paymentStatus })
    .from(orders)
    .where(eq(orders.gatewayOrderId, gatewayOrderId));
  return existing?.paymentStatus === "paid" ? existing.id : null;
}

export async function markGatewayPaymentFailed(gatewayOrderId: string) {
  await db
    .update(orders)
    .set({ paymentStatus: "failed", updatedAt: new Date() })
    .where(and(eq(orders.gatewayOrderId, gatewayOrderId), eq(orders.status, "pending")));
}

/** Cancels online-payment orders that were never paid, releasing their reserved stock. */
export async function expireUnpaidOrders(olderThanMinutes = 30) {
  const stale = await db
    .select({ id: orders.id })
    .from(orders)
    .where(
      and(
        eq(orders.status, "pending"),
        inArray(orders.paymentStatus, ["pending", "failed"]),
        lt(orders.createdAt, sql`now() - make_interval(mins => ${olderThanMinutes})`),
      ),
    );
  const touched = new Set<number>();
  for (const { id } of stale) {
    const ids = await db.transaction((tx) => cancelOrderTx(tx, id));
    ids.forEach((i) => touched.add(i));
  }
  await afterStockChange([...touched]);
  return stale.length;
}
