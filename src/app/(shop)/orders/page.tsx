import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { formatDate, formatPrice } from "@/lib/format";
import { STATUS_COLOR, STATUS_LABEL } from "@/lib/orders";

export const metadata: Metadata = { title: "My Orders", robots: { index: false } };

export default async function OrdersPage() {
  const user = await requireUser("/orders");
  const list = await db.select().from(orders).where(eq(orders.userId, user.id)).orderBy(desc(orders.createdAt)).limit(50);
  const items = list.length
    ? await db.select().from(orderItems).where(inArray(orderItems.orderId, list.map((o) => o.id)))
    : [];

  return (
    <div className="mx-auto max-w-5xl space-y-3 p-2 sm:p-3">
      <h1 className="text-xl font-semibold">My Orders</h1>
      {!list.length && (
        <div className="card p-12 text-center">
          <p className="mb-4">You haven&apos;t placed any orders yet.</p>
          <Link href="/" className="btn-primary">Start shopping</Link>
        </div>
      )}
      {list.map((o) => {
        const its = items.filter((i) => i.orderId === o.id);
        return (
          <Link key={o.id} href={`/orders/${o.id}`} className="card block p-4 hover:shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2 text-sm">
              <span className="font-semibold">Order #{o.id}</span>
              <span className="text-gray-500">{formatDate(o.createdAt)}</span>
            </div>
            <ul className="divide-y">
              {its.map((i) => (
                <li key={i.id} className="flex items-center gap-4 py-3">
                  <div className="relative h-16 w-16 shrink-0">
                    {i.image && <Image src={i.image} alt="" fill sizes="64px" className="object-contain" />}
                  </div>
                  <p className="line-clamp-2 flex-1 text-sm">{i.name} <span className="text-gray-500">× {i.quantity}</span></p>
                  <p className="w-24 text-right text-sm font-medium">{formatPrice(i.price * i.quantity)}</p>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t pt-2 text-sm">
              <span className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${STATUS_COLOR[o.status]}`} />
                {STATUS_LABEL[o.status]}
              </span>
              <span className="font-semibold">Total {formatPrice(o.total)}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
