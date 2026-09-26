import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, users } from "@/db/schema";
import { Badge, PageHeader, Panel } from "@/components/admin/ui";
import { updateOrderStatusAction } from "@/app/admin/actions";
import { formatDate, formatPrice } from "@/lib/format";
import { STATUS_LABEL } from "@/lib/orders";

export const metadata = { title: "Order details" };

export default async function AdminOrder({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [row] = await db
    .select({ o: orders, customer: users.name, email: users.email })
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id))
    .where(eq(orders.id, id));
  if (!row) notFound();
  const { o } = row;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
  const a = o.shippingAddress;

  return (
    <>
      <PageHeader title={`Order #${o.id}`} action={<Link href="/admin/orders" className="btn-outline">← All orders</Link>} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr><th className="px-4 py-3">Item</th><th className="px-4 py-3 text-right">Price</th><th className="px-4 py-3 text-right">Qty</th><th className="px-4 py-3 text-right">Total</th></tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id} className="border-t">
                  <td className="px-4 py-2">{i.productId ? <Link href={`/admin/products/${i.productId}`} className="hover:text-brand">{i.name}</Link> : i.name}</td>
                  <td className="px-4 py-2 text-right">{formatPrice(i.price)}</td>
                  <td className="px-4 py-2 text-right">{i.quantity}</td>
                  <td className="px-4 py-2 text-right">{formatPrice(i.price * i.quantity)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="text-sm">
              <tr className="border-t"><td colSpan={3} className="px-4 py-1 text-right text-slate-500">MRP total</td><td className="px-4 py-1 text-right">{formatPrice(o.subtotal)}</td></tr>
              <tr><td colSpan={3} className="px-4 py-1 text-right text-slate-500">Discount</td><td className="px-4 py-1 text-right">− {formatPrice(o.discount)}</td></tr>
              <tr><td colSpan={3} className="px-4 py-1 text-right text-slate-500">Shipping</td><td className="px-4 py-1 text-right">{formatPrice(o.shippingFee)}</td></tr>
              <tr className="font-semibold"><td colSpan={3} className="px-4 py-2 text-right">Total</td><td className="px-4 py-2 text-right">{formatPrice(o.total)}</td></tr>
            </tfoot>
          </table>
        </Panel>
        <div className="space-y-4">
          <Panel className="p-5 text-sm">
            <h2 className="mb-2 font-semibold">Status</h2>
            <p className="mb-3"><Badge tone={o.status === "cancelled" ? "red" : "blue"}>{STATUS_LABEL[o.status]}</Badge> · placed {formatDate(o.createdAt)}</p>
            {o.status !== "cancelled" && (
              <form action={updateOrderStatusAction.bind(null, o.id)} className="flex gap-2">
                <select name="status" defaultValue={o.status} className="input">
                  {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <button className="btn-primary">Update</button>
              </form>
            )}
            <p className="mt-3 uppercase">Payment: {o.paymentMethod} · <Badge tone={o.paymentStatus === "paid" ? "green" : o.paymentStatus === "failed" ? "red" : "gray"}>{o.paymentStatus}</Badge></p>
            {o.gatewayOrderId && <p className="mt-2 break-all text-xs text-slate-500">Razorpay order: {o.gatewayOrderId}</p>}
            {o.gatewayPaymentId && <p className="break-all text-xs text-slate-500">Payment ID: {o.gatewayPaymentId}</p>}
          </Panel>
          <Panel className="p-5 text-sm">
            <h2 className="mb-2 font-semibold">Customer</h2>
            <p>{row.customer}</p>
            <p className="text-slate-500">{row.email}</p>
            <h2 className="mb-2 mt-4 font-semibold">Ship to</h2>
            <p>{a.fullName} · {a.phone}</p>
            <p className="text-slate-600">{a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} – {a.pincode}</p>
          </Panel>
        </div>
      </div>
    </>
  );
}
