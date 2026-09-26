"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { saveProductAction, type AdminState } from "@/app/admin/actions";
import type { Category, Product } from "@/db/schema";
import { discountPercent, slugify } from "@/lib/format";
import { UploadButton } from "./image-upload";

export function ProductForm({ product, categories }: { product?: Product; categories: Category[] }) {
  const [state, action, pending] = useActionState<AdminState, FormData>(
    saveProductAction.bind(null, product?.id ?? null),
    undefined,
  );
  const [name, setName] = useState(product?.name ?? "");
  const [slugTouched, setSlugTouched] = useState(!!product);
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [price, setPrice] = useState(product?.price ?? 0);
  const [mrp, setMrp] = useState(product?.mrp ?? 0);
  const [images, setImages] = useState(product?.images.join("\n") ?? "");
  const previews = useMemo(() => images.split("\n").map((s) => s.trim()).filter((s) => /^(https?:\/\/|\/uploads\/)/.test(s)).slice(0, 6), [images]);

  return (
    <form action={action} className="grid gap-4 lg:grid-cols-3">
      <div className="space-y-4 rounded-lg border bg-white p-5 lg:col-span-2">
        <div>
          <label className="label" htmlFor="name">Product name *</label>
          <input
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="slug">URL slug (SEO)</label>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-slate-400">/p/</span>
            <input id="slug" name="slug" value={slug} onChange={(e) => { setSlugTouched(true); setSlug(e.target.value); }} className="input" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="brand">Brand *</label>
            <input id="brand" name="brand" required defaultValue={product?.brand} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="categoryId">Category *</label>
            <select id="categoryId" name="categoryId" required defaultValue={product?.categoryId ?? ""} className="input">
              <option value="" disabled>Select…</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="label" htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={5} defaultValue={product?.description} className="input" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="highlights">Highlights (one per line)</label>
            <textarea id="highlights" name="highlights" rows={5} defaultValue={product?.highlights.join("\n")} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="specs">Specifications (Key: Value per line)</label>
            <textarea
              id="specs"
              name="specs"
              rows={5}
              defaultValue={product ? Object.entries(product.specs).map(([k, v]) => `${k}: ${v}`).join("\n") : ""}
              placeholder={"RAM: 8 GB\nStorage: 128 GB"}
              className="input font-mono text-xs"
            />
          </div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="label mb-0" htmlFor="images">Images (one URL per line, first is the main image)</label>
            <UploadButton onUploaded={(urls) => setImages((cur) => [cur.trim(), ...urls].filter(Boolean).join("\n"))} />
          </div>
          <textarea id="images" name="images" rows={4} value={images} onChange={(e) => setImages(e.target.value)} className="input font-mono text-xs" placeholder="https://images.unsplash.com/..." />
          {previews.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {previews.map((src) => (
                <div key={src} className="relative h-20 w-20 overflow-hidden rounded border bg-slate-50">
                  <Image src={src} alt="" fill sizes="80px" className="object-cover" unoptimized />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-4 rounded-lg border bg-white p-5">
          <h2 className="font-semibold">Pricing & inventory</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="price">Selling price (₹) *</label>
              <input id="price" name="price" type="number" min={1} required value={price || ""} onChange={(e) => setPrice(Number(e.target.value))} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="mrp">MRP (₹) *</label>
              <input id="mrp" name="mrp" type="number" min={1} required value={mrp || ""} onChange={(e) => setMrp(Number(e.target.value))} className="input" />
            </div>
          </div>
          {price > 0 && mrp > 0 && (
            <p className={`text-sm ${price > mrp ? "text-red-600" : "text-success"}`}>
              {price > mrp ? "Price is higher than MRP" : `${discountPercent(price, mrp)}% discount`}
            </p>
          )}
          <div>
            <label className="label" htmlFor="stock">Stock quantity *</label>
            <input id="stock" name="stock" type="number" min={0} required defaultValue={product?.stock ?? 0} className="input" />
          </div>
        </div>
        <div className="space-y-3 rounded-lg border bg-white p-5">
          <h2 className="font-semibold">Visibility</h2>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" defaultChecked={product?.isActive ?? true} className="accent-brand" /> Active (visible in store)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured ?? false} className="accent-brand" /> Featured on homepage
          </label>
        </div>
        {state?.error && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
        <div className="flex gap-2">
          <button disabled={pending} className="btn-primary flex-1">{pending ? "Saving…" : product ? "Save changes" : "Create product"}</button>
          <Link href="/admin/products" className="btn-outline">Cancel</Link>
        </div>
      </div>
    </form>
  );
}
