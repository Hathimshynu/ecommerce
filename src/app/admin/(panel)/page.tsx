import Link from "next/link";
import { count, desc, eq, lte, ne, sql, sum } from "drizzle-orm";
import { db } from "@/db";
import { orders, products, users } from "@/db/schema";
import { Badge, PageHeader, Panel } from "@/components/admin/ui";
import { formatDate, formatPrice } from "@/lib/format";
import { STATUS_LABEL } from "@/lib/orders";
import { redisHealth } from "@/lib/redis";
import { esHealth } from "@/lib/elasticsearch";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [[rev], [prodCount], [userCount], lowStock, recent, byStatus, daily, redisUp, esUp] = await Promise.all([
    db.select({ revenue: sum(orders.total).mapWith(Number), n: count() }).from(orders).where(ne(orders.status, "cancelled")),
    db.select({ n: count() }).from(products),
    db.select({ n: count() }).from(users).where(eq(users.role, "customer")),
    db.select({ id: products.id, name: products.name, stock: products.stock }).from(products).where(lte(products.stock, 5)).orderBy(products.stock).limit(8),
    db
      .select({ id: orders.id, total: orders.total, status: orders.status, createdAt: orders.createdAt, customer: users.name })
      .from(orders)
      .innerJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt))
      .limit(8),
    db.select({ status: orders.status, n: count() }).from(orders).groupBy(orders.status),
    db
      .select({
        day: sql<string>`to_char(date_trunc('day', ${orders.createdAt}), 'DD Mon')`,
        total: sql<number>`coalesce(sum(${orders.total}), 0)::int`,
      })
      .from(orders)
      .where(sql`${orders.createdAt} > now() - interval '14 days' and ${orders.status} <> 'cancelled'`)
      .groupBy(sql`date_trunc('day', ${orders.createdAt})`)
      .orderBy(sql`date_trunc('day', ${orders.createdAt})`),
    redisHealth(),
    esHealth(),
  ]);

  const stats = [
    { label: "Revenue", value: formatPrice(rev?.revenue ?? 0) },
    { label: "Orders", value: String(rev?.n ?? 0) },
    { label: "Products", value: String(prodCount.n) },
    { label: "Customers", value: String(userCount.n) },
  ];
  const maxDay = Math.max(1, ...daily.map((d) => d.total));

  return (
    <>
      <PageHeader
        title="Dashboard"
        action={<Link href="/admin/products/new" className="btn-primary">+ Add product</Link>}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Panel key={s.label} className="p-5">
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="mt-1 text-2xl font-semibold">{s.value}</p>
          </Panel>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel className="p-5 xl:col-span-2">
          <h2 className="mb-4 font-semibold">Sales – last 14 days</h2>
          {daily.length ? (
            <div className="flex h-48 items-end gap-2">
              {daily.map((d) => (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-1" title={`${d.day}: ${formatPrice(d.total)}`}>
                  <div className="w-full rounded-t bg-brand" style={{ height: `${(d.total / maxDay) * 100}%`, minHeight: 4 }} />
                  <span className="text-[10px] text-slate-500">{d.day}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No orders yet.</p>
          )}
        </Panel>
        <Panel className="p-5">
          <h2 className="mb-3 font-semibold">Services</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">PostgreSQL <Badge tone="green">online</Badge></li>
            <li className="flex justify-between">Redis cache <Badge tone={redisUp ? "green" : "red"}>{redisUp ? "online" : "offline"}</Badge></li>
            <li className="flex justify-between">Elasticsearch <Badge tone={esUp ? "green" : "amber"}>{esUp ? "online" : "fallback: postgres"}</Badge></li>
          </ul>
          <h2 className="mb-3 mt-6 font-semibold">Orders by status</h2>
          <ul className="space-y-1 text-sm">
            {byStatus.map((s) => (
              <li key={s.status} className="flex justify-between"><span>{STATUS_LABEL[s.status]}</span><b>{s.n}</b></li>
            ))}
            {!byStatus.length && <li className="text-slate-500">No orders yet</li>}
          </ul>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Panel>
          <h2 className="border-b px-5 py-3 font-semibold">Recent orders</h2>
          <table className="w-full text-sm">
            <tbody>
              {recent.map((o) => (
                <tr key={o.id} className="border-b last:border-0">
                  <td className="px-5 py-2"><Link href={`/admin/orders/${o.id}`} className="text-brand">#{o.id}</Link></td>
                  <td className="px-2 py-2">{o.customer}</td>
                  <td className="px-2 py-2 text-slate-500">{formatDate(o.createdAt)}</td>
                  <td className="px-2 py-2"><Badge tone={o.status === "cancelled" ? "red" : o.status === "delivered" ? "green" : "blue"}>{STATUS_LABEL[o.status]}</Badge></td>
                  <td className="px-5 py-2 text-right font-medium">{formatPrice(o.total)}</td>
                </tr>
              ))}
              {!recent.length && <tr><td className="px-5 py-4 text-slate-500">No orders yet</td></tr>}
            </tbody>
          </table>
        </Panel>
        <Panel>
          <h2 className="border-b px-5 py-3 font-semibold">Low stock</h2>
          <ul className="divide-y text-sm">
            {lowStock.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-5 py-2">
                <Link href={`/admin/products/${p.id}`} className="truncate hover:text-brand">{p.name}</Link>
                <Badge tone={p.stock === 0 ? "red" : "amber"}>{p.stock} left</Badge>
              </li>
            ))}
            {!lowStock.length && <li className="px-5 py-4 text-slate-500">All products are well stocked</li>}
          </ul>
        </Panel>
      </div>
    </>
  );
}
