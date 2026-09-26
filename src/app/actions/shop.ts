"use server";

import { and, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { orderItems, orders, products, reviews, users, wishlist } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { invalidate } from "@/lib/redis";
import { afterStockChange as syncStock, cancelOrderTx, markGatewayOrderPaid } from "@/lib/order-service";
import { createGatewayOrder, razorpayConfig, verifyPaymentSignature, type CheckoutPayload } from "@/lib/payments";
import { siteName } from "@/lib/format";
import { syncProductToSearch } from "@/lib/indexing";

export async function toggleWishlistAction(productId: number): Promise<{ error?: "auth"; wishlisted?: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { error: "auth" };
  const id = z.number().int().positive().parse(productId);
  const deleted = await db
    .delete(wishlist)
    .where(and(eq(wishlist.userId, user.id), eq(wishlist.productId, id)))
    .returning();
  if (deleted.length) {
    revalidatePath("/wishlist");
    return { wishlisted: false };
  }
  await db.insert(wishlist).values({ userId: user.id, productId: id }).onConflictDoNothing();
  revalidatePath("/wishlist");
  return { wishlisted: true };
}

const reviewSchema = z.object({
  productId: z.coerce.number().int().positive(),
  slug: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().min(2).max(160),
  comment: z.string().trim().min(10, "Review must be at least 10 characters").max(2000),
});

export async function submitReviewAction(
  _: { ok?: boolean; error?: string } | undefined,
  formData: FormData,
): Promise<{ ok?: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { error: "auth" };
  const parsed = reviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { productId, slug, rating, title, comment } = parsed.data;

  await db.transaction(async (tx) => {
    const [existing] = await tx
      .select({ id: reviews.id })
      .from(reviews)
      .where(and(eq(reviews.productId, productId), eq(reviews.userId, user.id)));
    if (existing) {
      await tx.update(reviews).set({ rating, title, comment, createdAt: new Date() }).where(eq(reviews.id, existing.id));
    } else {
      await tx.insert(reviews).values({ productId, userId: user.id, rating, title, comment });
      await tx
        .update(products)
        .set({
          rating: sql`round(((${products.rating} * ${products.ratingCount} + ${rating}) / (${products.ratingCount} + 1))::numeric, 1)`,
          ratingCount: sql`${products.ratingCount} + 1`,
        })
        .where(eq(products.id, productId));
    }
  });

  await invalidate(`product:slug:${slug}`, `product:reviews:${productId}`);
  await syncProductToSearch(productId);
  revalidatePath(`/p/${slug}`);
  return { ok: true };
}

const addressSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(120),
  phone: z.string().trim().regex(/^[0-9+\- ]{10,15}$/, "Enter a valid 10-digit mobile number"),
  line1: z.string().trim().min(5, "Enter your address").max(255),
  line2: z.string().trim().max(255).optional(),
  city: z.string().trim().min(2, "Enter city").max(80),
  state: z.string().trim().min(2, "Enter state").max(80),
  pincode: z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
});

const orderSchema = z.object({
  items: z
    .array(z.object({ id: z.number().int().positive(), qty: z.number().int().min(1).max(10) }))
    .min(1, "Your cart is empty")
    .max(50),
  paymentMethod: z.enum(["cod", "upi", "card"]),
});

export type CheckoutState = { error?: string; payment?: CheckoutPayload } | undefined;

export async function placeOrderAction(_: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/checkout");

  const address = addressSchema.safeParse(Object.fromEntries(formData));
  if (!address.success) return { error: address.error.issues[0].message };
  let cart: unknown;
  try {
    cart = JSON.parse(String(formData.get("cart") ?? "[]"));
  } catch {
    return { error: "Invalid cart" };
  }
  const parsed = orderSchema.safeParse({ items: cart, paymentMethod: formData.get("paymentMethod") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const qtyById = new Map<number, number>();
  for (const i of parsed.data.items) qtyById.set(i.id, (qtyById.get(i.id) ?? 0) + i.qty);
  const ids = [...qtyById.keys()];

  let orderId: number;
  try {
    orderId = await db.transaction(async (tx) => {
      // Lock rows so concurrent checkouts can't oversell.
      const rows = await tx
        .select()
        .from(products)
        .where(and(inArray(products.id, ids), eq(products.isActive, true)))
        .for("update");
      if (rows.length !== ids.length) throw new Error("Some items in your cart are no longer available");

      let subtotal = 0;
      let mrpTotal = 0;
      for (const p of rows) {
        const qty = qtyById.get(p.id)!;
        if (p.stock < qty) throw new Error(`Only ${p.stock} left for "${p.name}"`);
        subtotal += p.price * qty;
        mrpTotal += p.mrp * qty;
      }
      const shippingFee = subtotal >= 500 ? 0 : 40;
      const pm = parsed.data.paymentMethod;
      const viaGateway = pm !== "cod" && !!razorpayConfig();

      const [order] = await tx
        .insert(orders)
        .values({
          userId: user.id,
          // Gateway orders stay "pending" (stock reserved) until the payment is verified.
          status: viaGateway ? "pending" : "confirmed",
          paymentMethod: pm,
          // Without Razorpay keys, online payments are simulated as captured.
          paymentStatus: pm === "cod" || viaGateway ? "pending" : "paid",
          subtotal: mrpTotal,
          discount: mrpTotal - subtotal,
          shippingFee,
          total: subtotal + shippingFee,
          shippingAddress: address.data,
        })
        .returning({ id: orders.id });

      await tx.insert(orderItems).values(
        rows.map((p) => ({
          orderId: order.id,
          productId: p.id,
          name: p.name,
          slug: p.slug,
          image: p.images[0] ?? null,
          price: p.price,
          mrp: p.mrp,
          quantity: qtyById.get(p.id)!,
        })),
      );
      for (const p of rows) {
        await tx
          .update(products)
          .set({ stock: sql`${products.stock} - ${qtyById.get(p.id)!}`, updatedAt: new Date() })
          .where(eq(products.id, p.id));
      }
      return order.id;
    });
  } catch (e) {
    return { error: (e as Error).message || "Could not place order" };
  }

  await afterStockChange(ids);

  if (parsed.data.paymentMethod !== "cod" && razorpayConfig()) {
    try {
      return { payment: await gatewayPayload(orderId, user.id, address.data.phone) };
    } catch (e) {
      // Gateway unreachable: release the reservation so stock isn't stuck.
      await afterStockChange(await db.transaction((tx) => cancelOrderTx(tx, orderId)));
      return { error: (e as Error).message || "Payment gateway unavailable. Please try again or choose Cash on Delivery." };
    }
  }
  redirect(`/orders/${orderId}?placed=1`);
}

/** Creates (or reuses) the Razorpay order for a pending local order and returns what Checkout needs. */
async function gatewayPayload(orderId: number, userId: number, phone?: string): Promise<CheckoutPayload> {
  const cfg = razorpayConfig()!;
  const [row] = await db
    .select({ o: orders, name: users.name, email: users.email })
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id))
    .where(and(eq(orders.id, orderId), eq(orders.userId, userId)));
  if (!row || row.o.status !== "pending") throw new Error("This order is not awaiting payment");
  let gatewayOrderId = row.o.gatewayOrderId;
  if (!gatewayOrderId) {
    const g = await createGatewayOrder(row.o.total, `order_${orderId}`, { orderId: String(orderId) });
    gatewayOrderId = g.id;
    await db.update(orders).set({ gatewayOrderId }).where(eq(orders.id, orderId));
  }
  return {
    orderId,
    keyId: cfg.keyId,
    gatewayOrderId,
    amount: row.o.total * 100,
    currency: "INR",
    name: siteName(),
    prefill: { name: row.name, email: row.email, contact: phone ?? row.o.shippingAddress.phone },
  };
}

export async function retryPaymentAction(orderId: number): Promise<CheckoutState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!razorpayConfig()) return { error: "Online payments are not configured" };
  try {
    return { payment: await gatewayPayload(orderId, user.id) };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

const verifySchema = z.object({
  razorpay_order_id: z.string().min(1).max(64),
  razorpay_payment_id: z.string().min(1).max(64),
  razorpay_signature: z.string().min(1).max(256),
});

/** Called by the client after Razorpay Checkout succeeds; the signature proves the payment is genuine. */
export async function verifyPaymentAction(orderId: number, response: unknown): Promise<{ ok?: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { error: "Please log in again" };
  const cfg = razorpayConfig();
  const parsed = verifySchema.safeParse(response);
  if (!cfg || !parsed.success) return { error: "Invalid payment response" };
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  const [order] = await db
    .select({ gatewayOrderId: orders.gatewayOrderId })
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, user.id)));
  if (!order || order.gatewayOrderId !== razorpay_order_id) return { error: "Order mismatch" };
  if (!verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature, cfg.keySecret)) {
    return { error: "Payment verification failed" };
  }
  const paid = await markGatewayOrderPaid(razorpay_order_id, razorpay_payment_id);
  if (!paid) return { error: "This order has expired. If you were charged, the amount will be refunded." };
  revalidatePath(`/orders/${orderId}`);
  return { ok: true };
}

export async function cancelOrderAction(orderId: number) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const ids = await db.transaction((tx) => cancelOrderTx(tx, orderId, { userId: user.id }));
  await afterStockChange(ids);
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/orders");
}

async function afterStockChange(ids: number[]) {
  for (const slug of await syncStock(ids)) revalidatePath(`/p/${slug}`);
}
