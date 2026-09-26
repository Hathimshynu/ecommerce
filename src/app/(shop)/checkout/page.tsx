import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const user = await requireUser("/checkout");
  return <CheckoutForm userName={user.name} email={user.email} />;
}
