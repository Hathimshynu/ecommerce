"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { retryPaymentAction, verifyPaymentAction } from "@/app/actions/shop";
import type { CheckoutPayload } from "@/lib/payments";
import { openRazorpay } from "./razorpay";

/** Runs Razorpay Checkout for a payload, verifies it server-side and navigates to the order. */
export function usePayment() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const pay = async (payload: CheckoutPayload) => {
    setError(null);
    setBusy(true);
    try {
      const response = await openRazorpay(payload);
      const res = await verifyPaymentAction(payload.orderId, response);
      if (res.error) throw new Error(res.error);
      router.push(`/orders/${payload.orderId}?placed=1`);
    } catch (e) {
      setError((e as Error).message);
      router.push(`/orders/${payload.orderId}?payment=pending`);
    } finally {
      setBusy(false);
    }
  };
  return { pay, error, busy };
}

/** Opens Checkout automatically when a payload arrives (used right after placing an order). */
export function AutoPay({ payload }: { payload?: CheckoutPayload }) {
  const { pay } = usePayment();
  const started = useRef<string | null>(null);
  useEffect(() => {
    if (payload && started.current !== payload.gatewayOrderId) {
      started.current = payload.gatewayOrderId;
      void pay(payload);
    }
  }, [payload, pay]);
  return null;
}

export function RetryPaymentButton({ orderId }: { orderId: number }) {
  const { pay, error, busy } = usePayment();
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-end gap-1">
      <button
        disabled={pending || busy}
        onClick={() =>
          start(async () => {
            setErr(null);
            const res = await retryPaymentAction(orderId);
            if (res?.payment) await pay(res.payment);
            else setErr(res?.error ?? "Could not start payment");
          })
        }
        className="btn-buy"
      >
        {pending || busy ? "Opening…" : "Complete payment"}
      </button>
      {(err || error) && <p className="text-sm text-red-600">{err || error}</p>}
    </div>
  );
}
