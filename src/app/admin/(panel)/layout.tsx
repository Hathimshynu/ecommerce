import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { adminLogoutAction } from "@/app/actions/auth";
import { AdminNav } from "@/components/admin/nav";

export const metadata: Metadata = {
  title: { default: "Admin Dashboard", template: "%s | ShopKart Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 md:flex-row">
      <aside className="shrink-0 bg-slate-900 md:sticky md:top-0 md:h-screen md:w-60">
        <Link href="/admin" className="block px-5 py-4 text-lg font-bold italic text-white">
          ShopKart <span className="text-xs not-italic text-accent">Seller Hub</span>
        </Link>
        <AdminNav />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-end gap-4 border-b bg-white px-6 py-3 text-sm">
          <Link href="/" className="text-brand hover:underline" target="_blank">View store ↗</Link>
          <span className="text-slate-600">{admin.name}</span>
          <form action={adminLogoutAction}>
            <button className="rounded border px-3 py-1 hover:bg-slate-50">Logout</button>
          </form>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
