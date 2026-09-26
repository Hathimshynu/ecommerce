import { describe, expect, it } from "vitest";
import { hmacSha256, verifyPaymentSignature, verifyWebhookSignature } from "./payments";

describe("razorpay signatures", () => {
  const secret = "test_secret";
  it("verifies checkout payment signatures", () => {
    const sig = hmacSha256("order_123|pay_456", secret);
    expect(verifyPaymentSignature("order_123", "pay_456", sig, secret)).toBe(true);
    expect(verifyPaymentSignature("order_123", "pay_999", sig, secret)).toBe(false);
    expect(verifyPaymentSignature("order_123", "pay_456", sig, "other")).toBe(false);
    expect(verifyPaymentSignature("order_123", "pay_456", "", secret)).toBe(false);
  });
  it("verifies webhook signatures on the raw body", () => {
    const body = JSON.stringify({ event: "order.paid" });
    expect(verifyWebhookSignature(body, hmacSha256(body, secret), secret)).toBe(true);
    expect(verifyWebhookSignature(body + " ", hmacSha256(body, secret), secret)).toBe(false);
  });
});
