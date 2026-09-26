"use server";

import { and, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { orderItems, orders, products, reviews, wishlist } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { invalidate } from "@/lib/redis";
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

export type CheckoutState = { error?: string } | undefined;

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

      const [order] = await tx
        .insert(orders)
        .values({
          userId: user.id,
          status: "confirmed",
          paymentMethod: pm,
          // Online payments are simulated as captured; plug a real gateway in here.
          paymentStatus: pm === "cod" ? "pending" : "paid",
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
  redirect(`/orders/${orderId}?placed=1`);
}

export async function cancelOrderAction(orderId: number) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const ids = await db.transaction(async (tx) => {
    const [order] = await tx
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.userId, user.id)))
      .for("update");
    if (!order || !["pending", "confirmed"].includes(order.status)) return [];
    const items = await tx.select().from(orderItems).where(eq(orderItems.orderId, orderId));
    for (const it of items) {
      if (it.productId)
        await tx.update(products).set({ stock: sql`${products.stock} + ${it.quantity}` }).where(eq(products.id, it.productId));
    }
    await tx
      .update(orders)
      .set({ status: "cancelled", paymentStatus: order.paymentStatus === "paid" ? "refunded" : order.paymentStatus, updatedAt: new Date() })
      .where(eq(orders.id, orderId));
    return items.map((i) => i.productId).filter((x): x is number => !!x);
  });
  await afterStockChange(ids);
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/orders");
}

async function afterStockChange(ids: number[]) {
  if (!ids.length) return;
  await invalidate("product:", "catalog:", "search:");
  await Promise.all(ids.map((id) => syncProductToSearch(id)));
  const slugs = await db.select({ slug: products.slug }).from(products).where(inArray(products.id, ids));
  for (const { slug } of slugs) revalidatePath(`/p/${slug}`);
}
