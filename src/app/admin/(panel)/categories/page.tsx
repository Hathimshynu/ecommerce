import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { PageHeader, Panel } from "@/components/admin/ui";
import { ActionForm } from "@/components/admin/action-form";
import { deleteCategoryAction, saveCategoryAction } from "@/app/admin/actions";

export const metadata = { title: "Categories" };

function Fields({ c }: { c?: typeof categories.$inferSelect }) {
  return (
    <div className="mb-3 grid gap-3 sm:grid-cols-2">
      {c && <input type="hidden" name="id" value={c.id} />}
      <div><label className="label">Name *</label><input name="name" required defaultValue={c?.name} className="input" /></div>
      <div><label className="label">Slug</label><input name="slug" defaultValue={c?.slug} placeholder="auto from name" className="input" /></div>
      <div><label className="label">Image URL</label><input name="image" type="url" defaultValue={c?.image ?? ""} className="input" /></div>
      <div><label className="label">Sort order</label><input name="sortOrder" type="number" defaultValue={c?.sortOrder ?? 0} className="input" /></div>
      <div className="sm:col-span-2"><label className="label">Description (used for SEO)</label><input name="description" defaultValue={c?.description ?? ""} className="input" /></div>
    </div>
  );
}

export default async function AdminCategories() {
  const rows = await db
    .select({ c: categories, n: count(products.id) })
    .from(categories)
    .leftJoin(products, eq(products.categoryId, categories.id))
    .groupBy(categories.id)
    .orderBy(categories.sortOrder);

  return (
    <>
      <PageHeader title="Categories" />
      <Panel className="mb-6 p-5">
        <h2 className="mb-3 font-semibold">Add category</h2>
        <ActionForm action={saveCategoryAction} submitLabel="Create category" resetOnSuccess>
          <Fields />
        </ActionForm>
      </Panel>
      <div className="space-y-3">
        {rows.map(({ c, n }) => (
          <Panel key={c.id} className="p-0">
            <details>
              <summary className="flex cursor-pointer items-center justify-between px-5 py-3">
                <span className="font-medium">{c.name} <span className="text-sm text-slate-400">/c/{c.slug}</span></span>
                <span className="text-sm text-slate-500">{n} products</span>
              </summary>
              <div className="border-t p-5">
                <ActionForm action={saveCategoryAction} submitLabel="Save">
                  <Fields c={c} />
                </ActionForm>
                <ActionForm
                  action={deleteCategoryAction.bind(null, c.id)}
                  submitLabel="Delete category"
                  submitClassName="mt-3 rounded border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                />
              </div>
            </details>
          </Panel>
        ))}
      </div>
    </>
  );
}
