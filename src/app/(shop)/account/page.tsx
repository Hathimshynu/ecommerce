import type { Metadata } from "next";
import Link from "next/link";
import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { orders, users, wishlist } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "My Account", robots: { index: false } };

export default async function AccountPage() {
  const session = await requireUser("/account");
  const [[user], [{ n: orderCount }], [{ n: wishCount }]] = await Promise.all([
    db.select().from(users).where(eq(users.id, session.id)),
    db.select({ n: count() }).from(orders).where(eq(orders.userId, session.id)),
    db.select({ n: count() }).from(wishlist).where(eq(wishlist.userId, session.id)),
  ]);
  return (
    <div className="mx-auto max-w-4xl space-y-3 p-2 sm:p-3">
      <section className="card flex items-center gap-4 p-5">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-xl font-bold text-white">
          {user.name[0]?.toUpperCase()}
        </span>
        <div>
          <p className="text-xs text-gray-500">Hello,</p>
          <h1 className="text-lg font-semibold">{user.name}</h1>
        </div>
      </section>
      <section className="card grid gap-4 p-5 sm:grid-cols-2">
        <div><p className="label">Email</p><p>{user.email}</p></div>
        <div><p className="label">Mobile</p><p>{user.phone ?? "—"}</p></div>
        <div><p className="label">Member since</p><p>{formatDate(user.createdAt)}</p></div>
      </section>
      <section className="grid gap-3 sm:grid-cols-2">
        <Link href="/orders" className="card p-5 hover:shadow-md"><p className="font-semibold">My Orders</p><p className="text-sm text-gray-500">{orderCount} orders</p></Link>
        <Link href="/wishlist" className="card p-5 hover:shadow-md"><p className="font-semibold">My Wishlist</p><p className="text-sm text-gray-500">{wishCount} items</p></Link>
      </section>
      <form action={logoutAction}><button className="btn-outline">Logout</button></form>
    </div>
  );
}
