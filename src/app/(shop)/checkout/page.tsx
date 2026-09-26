import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { orders, users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const user = await requireUser("/checkout");
  // Prefill with the address used on the customer's most recent order.
  const [[last], [profile]] = await Promise.all([
    db.select({ address: orders.shippingAddress }).from(orders).where(eq(orders.userId, user.id)).orderBy(desc(orders.createdAt)).limit(1),
    db.select({ phone: users.phone }).from(users).where(eq(users.id, user.id)),
  ]);
  const defaults = last?.address ?? (profile?.phone ? { phone: profile.phone } : undefined);
  return <CheckoutForm userName={user.name} email={user.email} defaults={defaults} />;
}
