import Image from "next/image";
import Link from "next/link";
import { and, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { Badge, PageHeader, Panel, Pager } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { deleteProductAction, toggleProductActiveAction } from "@/app/admin/actions";
import { formatPrice } from "@/lib/format";

export const metadata = { title: "Products" };
const PAGE_SIZE = 20;

type Props = { searchParams: Promise<{ q?: string; page?: string; category?: string; saved?: string }> };

export default async function AdminProducts({ searchParams }: Props) {
  const { q = "", page: p = "1", category = "", saved } = await searchParams;
  const page = Math.max(1, Number(p) || 1);
  const where: SQL[] = [];
  if (q) where.push(or(ilike(products.name, `%${q}%`), ilike(products.brand, `%${q}%`))!);
  if (category) where.push(eq(categories.slug, category));

  const [rows, [{ n }], cats] = await Promise.all([
    db
      .select({ p: products, category: categories.name })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(and(...where))
      .orderBy(desc(products.updatedAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ n: count() }).from(products).innerJoin(categories, eq(products.categoryId, categories.id)).where(and(...where)),
    db.select().from(categories).orderBy(categories.name),
  ]);
  const totalPages = Math.ceil(n / PAGE_SIZE);
  const qs = (pg: number) => `/admin/products?${new URLSearchParams({ q, category, page: String(pg) })}`;

  return (
    <>
      <PageHeader title={`Products (${n})`} action={<Link href="/admin/products/new" className="btn-primary">+ Add product</Link>} />
      {saved && <p className="mb-4 rounded bg-green-50 p-3 text-sm text-green-800">Product #{saved} saved. Cache invalidated and search index updated.</p>}
      <Panel>
        <form className="flex flex-wrap gap-2 border-b p-4">
          <input name="q" defaultValue={q} placeholder="Search name or brand…" className="input max-w-xs" />
          <select name="category" defaultValue={category} className="input max-w-[200px]">
            <option value="">All categories</option>
            {cats.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
          <button className="btn-outline">Filter</button>
        </form>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ p, category }) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 rounded bg-slate-100">
                        {p.images[0] && <Image src={p.images[0]} alt="" fill sizes="40px" className="rounded object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <Link href={`/admin/products/${p.id}`} className="line-clamp-1 font-medium hover:text-brand">{p.name}</Link>
                        <p className="text-xs text-slate-500">{p.brand} · #{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">{category}</td>
                  <td className="px-4 py-2 text-right">
                    {formatPrice(p.price)}
                    <div className="text-xs text-slate-400 line-through">{formatPrice(p.mrp)}</div>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Badge tone={p.stock === 0 ? "red" : p.stock < 10 ? "amber" : "gray"}>{p.stock}</Badge>
                  </td>
                  <td className="px-4 py-2">
                    <form action={toggleProductActiveAction.bind(null, p.id)}>
                      <button title="Toggle visibility">
                        <Badge tone={p.isActive ? "green" : "gray"}>{p.isActive ? "Active" : "Hidden"}</Badge>
                      </button>
                    </form>
                    {p.isFeatured && <Badge tone="blue">Featured</Badge>}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-end gap-2">
                      <Link href={`/p/${p.slug}`} target="_blank" className="rounded border px-2 py-1 text-xs hover:bg-slate-50">View</Link>
                      <Link href={`/admin/products/${p.id}`} className="rounded border px-2 py-1 text-xs hover:bg-slate-50">Edit</Link>
                      <form action={deleteProductAction.bind(null, p.id)}>
                        <ConfirmButton message={`Delete "${p.name}"?`} className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50">Delete</ConfirmButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">No products found</td></tr>}
            </tbody>
          </table>
        </div>
        <Pager page={page} totalPages={totalPages} href={qs} />
      </Panel>
    </>
  );
}
