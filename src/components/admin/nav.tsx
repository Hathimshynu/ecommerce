"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  ["/admin", "Dashboard", "📊"],
  ["/admin/products", "Products", "📦"],
  ["/admin/categories", "Categories", "🗂️"],
  ["/admin/orders", "Orders", "🧾"],
  ["/admin/users", "Customers", "👥"],
  ["/admin/banners", "Banners", "🖼️"],
  ["/admin/system", "Search & Cache", "⚙️"],
] as const;

export function AdminNav() {
  const path = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto p-2 md:flex-col md:overflow-visible">
      {LINKS.map(([href, label, icon]) => {
        const active = href === "/admin" ? path === href : path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm ${active ? "bg-brand text-white" : "text-slate-300 hover:bg-slate-800"}`}
          >
            <span aria-hidden>{icon}</span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
