import Image from "next/image";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { banners } from "@/db/schema";
import { Badge, PageHeader, Panel } from "@/components/admin/ui";
import { ActionForm } from "@/components/admin/action-form";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { deleteBannerAction, saveBannerAction, toggleBannerAction } from "@/app/admin/actions";

export const metadata = { title: "Banners" };

export default async function AdminBanners() {
  const rows = await db.select().from(banners).orderBy(asc(banners.sortOrder));
  return (
    <>
      <PageHeader title="Homepage banners" />
      <Panel className="mb-6 p-5">
        <h2 className="mb-3 font-semibold">Add banner</h2>
        <ActionForm action={saveBannerAction} submitLabel="Add banner" resetOnSuccess>
          <div className="mb-3 grid gap-3 sm:grid-cols-2">
            <div><label className="label">Title *</label><input name="title" required className="input" /></div>
            <div><label className="label">Subtitle</label><input name="subtitle" className="input" /></div>
            <div><label className="label">Image URL * (1600×400 recommended)</label><input name="image" type="url" required className="input" /></div>
            <div><label className="label">Link *</label><input name="link" required defaultValue="/" className="input" /></div>
            <div><label className="label">Sort order</label><input name="sortOrder" type="number" defaultValue={rows.length} className="input" /></div>
          </div>
        </ActionForm>
      </Panel>
      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((b) => (
          <Panel key={b.id} className="overflow-hidden">
            <div className="relative aspect-[4/1] bg-slate-100">
              <Image src={b.image} alt={b.title} fill sizes="600px" className="object-cover" />
            </div>
            <div className="flex items-center justify-between gap-2 p-4 text-sm">
              <div className="min-w-0">
                <p className="font-medium">{b.title} <Badge tone={b.isActive ? "green" : "gray"}>{b.isActive ? "Live" : "Hidden"}</Badge></p>
                <p className="truncate text-slate-500">{b.link}</p>
              </div>
              <div className="flex gap-2">
                <form action={toggleBannerAction.bind(null, b.id)}><button className="rounded border px-2 py-1 text-xs">{b.isActive ? "Hide" : "Show"}</button></form>
                <form action={deleteBannerAction.bind(null, b.id)}>
                  <ConfirmButton message="Delete this banner?" className="rounded border border-red-200 px-2 py-1 text-xs text-red-600">Delete</ConfirmButton>
                </form>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
