import Link from "next/link";
import { and, count, desc, eq, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { orders, users, type OrderStatus } from "@/db/schema";
import { Badge, PageHeader, Panel, Pager } from "@/components/admin/ui";
import { formatDate, formatPrice } from "@/lib/format";
import { STATUS_LABEL } from "@/lib/orders";

export const metadata = { title: "Orders" };
const PAGE_SIZE = 25;

export default async function AdminOrders({ searchParams }: { searchParams: Promise<{ status?: string; page?: string }> }) {
  const { status = "", page: p = "1" } = await searchParams;
  const page = Math.max(1, Number(p) || 1);
  const where: SQL[] = [];
  if (status in STATUS_LABEL) where.push(eq(orders.status, status as OrderStatus));

  const [rows, [{ n }]] = await Promise.all([
    db
      .select({ o: orders, customer: users.name, email: users.email })
      .from(orders)
      .innerJoin(users, eq(orders.userId, users.id))
      .where(and(...where))
      .orderBy(desc(orders.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ n: count() }).from(orders).where(and(...where)),
  ]);

  return (
    <>
      <PageHeader title={`Orders (${n})`} />
      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        {["", ...Object.keys(STATUS_LABEL)].map((s) => (
          <Link key={s} href={`/admin/orders${s ? `?status=${s}` : ""}`} className={`rounded-full border px-3 py-1 ${status === s ? "border-brand bg-brand text-white" : "bg-white"}`}>
            {s ? STATUS_LABEL[s as OrderStatus] : "All"}
          </Link>
        ))}
      </div>
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Total</th></tr>
            </thead>
            <tbody>
              {rows.map(({ o, customer, email }) => (
                <tr key={o.id} className="border-t">
                  <td className="px-4 py-2"><Link href={`/admin/orders/${o.id}`} className="font-medium text-brand">#{o.id}</Link></td>
                  <td className="px-4 py-2">{customer}<div className="text-xs text-slate-500">{email}</div></td>
                  <td className="px-4 py-2">{formatDate(o.createdAt)}</td>
                  <td className="px-4 py-2 uppercase">{o.paymentMethod} <Badge tone={o.paymentStatus === "paid" ? "green" : "gray"}>{o.paymentStatus}</Badge></td>
                  <td className="px-4 py-2"><Badge tone={o.status === "cancelled" ? "red" : o.status === "delivered" ? "green" : "blue"}>{STATUS_LABEL[o.status]}</Badge></td>
                  <td className="px-4 py-2 text-right font-medium">{formatPrice(o.total)}</td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">No orders</td></tr>}
            </tbody>
          </table>
        </div>
        <Pager page={page} totalPages={Math.ceil(n / PAGE_SIZE)} href={(pg) => `/admin/orders?${new URLSearchParams({ status, page: String(pg) })}`} />
      </Panel>
    </>
  );
}
