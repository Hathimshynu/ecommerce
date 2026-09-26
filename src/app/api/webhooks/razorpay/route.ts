import { NextResponse, type NextRequest } from "next/server";
import { razorpayConfig, verifyWebhookSignature } from "@/lib/payments";
import { markGatewayOrderPaid, markGatewayPaymentFailed } from "@/lib/order-service";

export const dynamic = "force-dynamic";

type RazorpayEvent = {
  event: string;
  payload?: {
    payment?: { entity?: { id?: string; order_id?: string } };
    order?: { entity?: { id?: string } };
  };
};

/**
 * Razorpay webhook (configure events: payment.captured, order.paid, payment.failed).
 * Backs up the client-side verification so orders are confirmed even if the browser closes mid-payment.
 */
export async function POST(req: NextRequest) {
  const cfg = razorpayConfig();
  if (!cfg?.webhookSecret) return NextResponse.json({ error: "webhook not configured" }, { status: 503 });

  const raw = await req.text();
  if (!verifyWebhookSignature(raw, req.headers.get("x-razorpay-signature") ?? "", cfg.webhookSecret)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let evt: RazorpayEvent;
  try {
    evt = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "bad payload" }, { status: 400 });
  }
  const payment = evt.payload?.payment?.entity;
  const gatewayOrderId = payment?.order_id ?? evt.payload?.order?.entity?.id;
  if (!gatewayOrderId) return NextResponse.json({ ok: true, ignored: true });

  if ((evt.event === "payment.captured" || evt.event === "order.paid") && payment?.id) {
    await markGatewayOrderPaid(gatewayOrderId, payment.id);
  } else if (evt.event === "payment.failed") {
    await markGatewayPaymentFailed(gatewayOrderId);
  }
  return NextResponse.json({ ok: true });
}
