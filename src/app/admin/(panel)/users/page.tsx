import { count, desc, eq, sum } from "drizzle-orm";
import { db } from "@/db";
import { orders, users } from "@/db/schema";
import { Badge, PageHeader, Panel } from "@/components/admin/ui";
import { formatDate, formatPrice } from "@/lib/format";

export const metadata = { title: "Customers" };

export default async function AdminUsers() {
  const rows = await db
    .select({ u: users, orders: count(orders.id), spent: sum(orders.total).mapWith(Number) })
    .from(users)
    .leftJoin(orders, eq(orders.userId, users.id))
    .groupBy(users.id)
    .orderBy(desc(users.createdAt))
    .limit(200);
  return (
    <>
      <PageHeader title={`Customers (${rows.length})`} />
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Joined</th><th className="px-4 py-3 text-right">Orders</th><th className="px-4 py-3 text-right">Spent</th></tr>
            </thead>
            <tbody>
              {rows.map(({ u, orders: n, spent }) => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-2 font-medium">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2"><Badge tone={u.role === "admin" ? "blue" : "gray"}>{u.role}</Badge></td>
                  <td className="px-4 py-2">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-2 text-right">{n}</td>
                  <td className="px-4 py-2 text-right">{formatPrice(spent ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
