import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Razorpay integration (https://razorpay.com/docs/payments/server-integration/nodejs/).
 * When RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set, online payments run in "simulated" mode.
 */
export function razorpayConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return {
    keyId,
    keySecret,
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET ?? "",
    apiBase: (process.env.RAZORPAY_API_BASE ?? "https://api.razorpay.com").replace(/\/$/, ""),
  };
}

export type GatewayOrder = { id: string; amount: number; currency: string; receipt?: string; status: string };

/** Creates a Razorpay order. `amountRupees` is converted to paise. */
export async function createGatewayOrder(amountRupees: number, receipt: string, notes: Record<string, string> = {}) {
  const cfg = razorpayConfig();
  if (!cfg) throw new Error("Razorpay is not configured");
  const res = await fetch(`${cfg.apiBase}/v1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${cfg.keyId}:${cfg.keySecret}`).toString("base64")}`,
    },
    body: JSON.stringify({ amount: Math.round(amountRupees * 100), currency: "INR", receipt, notes }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Payment gateway error (${res.status})`);
  return (await res.json()) as GatewayOrder;
}

function safeEqualHex(a: string, b: string) {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export const hmacSha256 = (data: string, secret: string) => createHmac("sha256", secret).update(data).digest("hex");

/** Verifies the signature Razorpay Checkout returns after a successful payment. */
export function verifyPaymentSignature(gatewayOrderId: string, paymentId: string, signature: string, secret: string) {
  if (!gatewayOrderId || !paymentId || !signature || !secret) return false;
  return safeEqualHex(hmacSha256(`${gatewayOrderId}|${paymentId}`, secret), signature);
}

/** Verifies the X-Razorpay-Signature header of a webhook against the raw request body. */
export function verifyWebhookSignature(rawBody: string, signature: string, secret: string) {
  if (!rawBody || !signature || !secret) return false;
  return safeEqualHex(hmacSha256(rawBody, secret), signature);
}

export type CheckoutPayload = {
  orderId: number;
  keyId: string;
  gatewayOrderId: string;
  amount: number;
  currency: string;
  name: string;
  prefill: { name: string; email: string; contact: string };
};
