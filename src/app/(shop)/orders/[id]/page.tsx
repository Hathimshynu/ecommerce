import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { cancelOrderAction } from "@/app/actions/shop";
import { ClearCart } from "@/components/shop/clear-cart";
import { RetryPaymentButton } from "@/components/shop/pay-button";
import { razorpayConfig } from "@/lib/payments";
import { formatDate, formatPrice } from "@/lib/format";
import { ORDER_STEPS, STATUS_LABEL } from "@/lib/orders";

export const metadata: Metadata = { title: "Order Details", robots: { index: false } };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ placed?: string; payment?: string }> };

export default async function OrderPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { placed, payment } = await searchParams;
  const user = await requireUser(`/orders/${id}`);
  const orderId = Number(id);
  if (!Number.isInteger(orderId)) notFound();
  const [order] = await db.select().from(orders).where(and(eq(orders.id, orderId), eq(orders.userId, user.id)));
  if (!order) notFound();
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  const stepIndex = ORDER_STEPS.indexOf(order.status);
  const a = order.shippingAddress;
  const awaitingPayment = order.status === "pending" && order.paymentMethod !== "cod";

  return (
    <div className="mx-auto max-w-5xl space-y-3 p-2 sm:p-3">
      {(placed || payment) && <ClearCart />}
      {awaitingPayment && (
        <div className="card flex flex-wrap items-center justify-between gap-4 border-l-4 border-amber-500 p-5">
          <div>
            <p className="text-lg font-semibold">
              {order.paymentStatus === "failed" ? "Payment failed" : "Payment pending"} for order #{order.id}
            </p>
            <p className="text-sm text-gray-600">
              Items are reserved for 30 minutes. Complete the payment to confirm your order, or cancel it below.
            </p>
          </div>
          {razorpayConfig() && <RetryPaymentButton orderId={order.id} />}
        </div>
      )}
      {placed && !awaitingPayment && (
        <>
          <div className="card flex items-center gap-4 border-l-4 border-success p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-success text-xl text-white">✓</span>
            <div>
              <p className="text-lg font-semibold">Order placed successfully!</p>
              <p className="text-sm text-gray-600">Order #{order.id} · We&apos;ll send you updates as it ships.</p>
            </div>
          </div>
        </>
      )}

      <div className="card grid gap-6 p-5 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <h2 className="mb-2 font-semibold">Delivery Address</h2>
          <p className="text-sm font-medium">{a.fullName}</p>
          <p className="text-sm text-gray-700">{a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} - {a.pincode}</p>
          <p className="mt-1 text-sm"><b>Phone</b> {a.phone}</p>
        </div>
        <div className="text-sm">
          <h2 className="mb-2 font-semibold">Order #{order.id}</h2>
          <p>Placed on {formatDate(order.createdAt)}</p>
          <p className="capitalize">Payment: {order.paymentMethod.toUpperCase()} · {order.paymentStatus}</p>
        </div>
      </div>

      <div className="card p-5">
        {order.status === "cancelled" ? (
          <p className="font-semibold text-red-600">This order was cancelled.</p>
        ) : (
          <ol className="flex items-start">
            {ORDER_STEPS.map((s, i) => (
              <li key={s} className="flex flex-1 flex-col items-center text-center text-xs">
                <div className="flex w-full items-center">
                  <span className={`h-0.5 flex-1 ${i === 0 ? "opacity-0" : i <= stepIndex ? "bg-success" : "bg-gray-200"}`} />
                  <span className={`h-4 w-4 rounded-full ${i <= stepIndex ? "bg-success" : "bg-gray-300"}`} />
                  <span className={`h-0.5 flex-1 ${i === ORDER_STEPS.length - 1 ? "opacity-0" : i < stepIndex ? "bg-success" : "bg-gray-200"}`} />
                </div>
                <span className={`mt-2 ${i <= stepIndex ? "font-semibold" : "text-gray-500"}`}>{STATUS_LABEL[s]}</span>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="card">
        <ul className="divide-y">
          {items.map((i) => (
            <li key={i.id} className="flex items-center gap-4 p-4">
              <div className="relative h-20 w-20 shrink-0">
                {i.image && <Image src={i.image} alt="" fill sizes="80px" className="object-contain" />}
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/p/${i.slug}`} className="line-clamp-2 text-sm hover:text-brand">{i.name}</Link>
                <p className="text-xs text-gray-500">Qty: {i.quantity}</p>
              </div>
              <p className="font-semibold">{formatPrice(i.price * i.quantity)}</p>
            </li>
          ))}
        </ul>
        <dl className="space-y-1 border-t p-4 text-sm">
          <div className="flex justify-between"><dt>Price</dt><dd>{formatPrice(order.subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Discount</dt><dd className="text-success">− {formatPrice(order.discount)}</dd></div>
          <div className="flex justify-between"><dt>Delivery</dt><dd>{order.shippingFee ? formatPrice(order.shippingFee) : "FREE"}</dd></div>
          <div className="flex justify-between pt-2 text-base font-semibold"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
        </dl>
        {["pending", "confirmed"].includes(order.status) && (
          <form action={cancelOrderAction.bind(null, order.id)} className="border-t p-4 text-right">
            <button className="btn-outline">Cancel order</button>
          </form>
        )}
      </div>
    </div>
  );
}
