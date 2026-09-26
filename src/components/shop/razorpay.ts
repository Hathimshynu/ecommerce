"use client";

import type { CheckoutPayload } from "@/lib/payments";

type RazorpayResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayInstance = { open: () => void; on: (event: string, cb: (r: { error?: { description?: string } }) => void) => void };
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

const SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

function loadScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Could not load the payment window. Check your connection."));
    document.body.appendChild(s);
  });
}

/** Opens Razorpay Checkout; resolves with the signed response, or rejects when dismissed/failed. */
export async function openRazorpay(p: CheckoutPayload): Promise<RazorpayResponse> {
  await loadScript();
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay!({
      key: p.keyId,
      order_id: p.gatewayOrderId,
      amount: p.amount,
      currency: p.currency,
      name: p.name,
      description: `Order #${p.orderId}`,
      prefill: p.prefill,
      theme: { color: "#2874f0" },
      handler: (r: RazorpayResponse) => resolve(r),
      modal: { ondismiss: () => reject(new Error("Payment cancelled. You can retry from your order page.")) },
    });
    rzp.on("payment.failed", (r) => reject(new Error(r.error?.description ?? "Payment failed")));
    rzp.open();
  });
}
