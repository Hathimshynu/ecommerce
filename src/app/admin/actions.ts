"use server";

import { and, eq, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { banners, categories, orders, products, type OrderStatus } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { invalidateCatalog } from "@/lib/catalog";
import { flushAppCache } from "@/lib/redis";
import { reindexAllProducts, removeProductFromSearch, syncCategoryProducts, syncProductToSearch } from "@/lib/indexing";
import { slugify } from "@/lib/format";

export type AdminState = { error?: string; message?: string } | undefined;

const lines = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

const productSchema = z
  .object({
    name: z.string().trim().min(3, "Name is too short").max(255),
    slug: z.string().trim().max(280).optional(),
    brand: z.string().trim().min(1, "Brand is required").max(120),
    categoryId: z.coerce.number().int().positive("Choose a category"),
    price: z.coerce.number().int("Price must be a whole number").min(1, "Price must be at least ₹1"),
    mrp: z.coerce.number().int().min(1, "MRP must be at least ₹1"),
    stock: z.coerce.number().int().min(0),
    description: z.string().trim().max(10_000).default(""),
    isFeatured: z.boolean(),
    isActive: z.boolean(),
    images: z.array(z.url("Each image must be a valid URL")).max(10),
    highlights: z.array(z.string().max(200)).max(12),
    specs: z.record(z.string(), z.string()),
  })
  .refine((d) => d.price <= d.mrp, { message: "Selling price cannot exceed MRP", path: ["price"] });

function parseProduct(fd: FormData) {
  const specs: Record<string, string> = {};
  for (const line of lines(fd.get("specs"))) {
    const i = line.indexOf(":");
    if (i > 0) specs[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return productSchema.safeParse({
    name: fd.get("name"),
    slug: fd.get("slug") || undefined,
    brand: fd.get("brand"),
    categoryId: fd.get("categoryId"),
    price: fd.get("price"),
    mrp: fd.get("mrp"),
    stock: fd.get("stock"),
    description: fd.get("description") ?? "",
    isFeatured: fd.get("isFeatured") === "on",
    isActive: fd.get("isActive") === "on",
    images: lines(fd.get("images")),
    highlights: lines(fd.get("highlights")),
    specs,
  });
}

async function uniqueSlug(base: string, excludeId?: number) {
  let slug = slugify(base) || "product";
  for (let n = 2; ; n++) {
    const [hit] = await db
      .select({ id: products.id })
      .from(products)
      .where(excludeId ? and(eq(products.slug, slug), ne(products.id, excludeId)) : eq(products.slug, slug))
      .limit(1);
    if (!hit) return slug;
    slug = `${slugify(base)}-${n}`;
  }
}

async function afterProductChange(slugs: string[]) {
  await invalidateCatalog();
  revalidatePath("/", "layout");
  for (const s of slugs) revalidatePath(`/p/${s}`);
}

export async function saveProductAction(id: number | null, _: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  const parsed = parseProduct(fd);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { slug: rawSlug, ...data } = parsed.data;
  const slug = await uniqueSlug(rawSlug || data.name, id ?? undefined);

  let savedId = id;
  const oldSlugs: string[] = [];
  if (id) {
    const [old] = await db.select({ slug: products.slug }).from(products).where(eq(products.id, id));
    if (!old) return { error: "Product not found" };
    oldSlugs.push(old.slug);
    await db.update(products).set({ ...data, slug, updatedAt: new Date() }).where(eq(products.id, id));
  } else {
    const [row] = await db
      .insert(products)
      .values({ ...data, slug, rating: 0, ratingCount: 0 })
      .returning({ id: products.id });
    savedId = row.id;
  }
  await syncProductToSearch(savedId!);
  await afterProductChange([...oldSlugs, slug]);
  redirect(`/admin/products?saved=${savedId}`);
}

export async function deleteProductAction(id: number) {
  await requireAdmin();
  const [row] = await db.delete(products).where(eq(products.id, id)).returning({ slug: products.slug });
  await removeProductFromSearch(id);
  await afterProductChange(row ? [row.slug] : []);
  revalidatePath("/admin/products");
}

export async function toggleProductActiveAction(id: number) {
  await requireAdmin();
  const [row] = await db
    .update(products)
    .set({ isActive: sql`not ${products.isActive}`, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning({ slug: products.slug });
  await syncProductToSearch(id);
  await afterProductChange(row ? [row.slug] : []);
  revalidatePath("/admin/products");
}

const categorySchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().max(140).optional(),
  description: z.string().trim().max(1000).optional(),
  image: z.url().optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().default(0),
});

export async function saveCategoryAction(_: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  const id = Number(fd.get("id")) || null;
  const parsed = categorySchema.safeParse({
    name: fd.get("name"),
    slug: fd.get("slug") || undefined,
    description: fd.get("description") || undefined,
    image: fd.get("image") || "",
    sortOrder: fd.get("sortOrder") || 0,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { slug: rawSlug, image, ...rest } = parsed.data;
  const slug = slugify(rawSlug || rest.name);
  const [clash] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(id ? and(eq(categories.slug, slug), ne(categories.id, id)) : eq(categories.slug, slug));
  if (clash) return { error: `Slug "${slug}" is already used` };

  if (id) {
    await db.update(categories).set({ ...rest, slug, image: image || null }).where(eq(categories.id, id));
    await syncCategoryProducts(id);
  } else {
    await db.insert(categories).values({ ...rest, slug, image: image || null });
  }
  await afterProductChange([]);
  revalidatePath("/admin/categories");
  return { message: id ? "Category updated" : "Category created" };
}

export async function deleteCategoryAction(id: number, _: AdminState): Promise<AdminState> {
  await requireAdmin();
  const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(products).where(eq(products.categoryId, id));
  if (n > 0) return { error: `Cannot delete: ${n} products still use this category` };
  await db.delete(categories).where(eq(categories.id, id));
  await afterProductChange([]);
  revalidatePath("/admin/categories");
  return { message: "Category deleted" };
}

const STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "out_for_delivery", "delivered", "cancelled"];

export async function updateOrderStatusAction(id: number, fd: FormData) {
  await requireAdmin();
  const status = String(fd.get("status")) as OrderStatus;
  if (!STATUSES.includes(status)) return;
  const [order] = await db.select().from(orders).where(eq(orders.id, id));
  if (!order || order.status === "cancelled") return;
  await db
    .update(orders)
    .set({
      status,
      paymentStatus:
        status === "delivered" && order.paymentMethod === "cod"
          ? "paid"
          : status === "cancelled" && order.paymentStatus === "paid"
            ? "refunded"
            : order.paymentStatus,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, id));
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
}

const bannerSchema = z.object({
  title: z.string().trim().min(2).max(160),
  subtitle: z.string().trim().max(255).optional(),
  image: z.url(),
  link: z.string().trim().startsWith("/", "Link must be a site path like /c/mobiles"),
  sortOrder: z.coerce.number().int().default(0),
});

export async function saveBannerAction(_: AdminState, fd: FormData): Promise<AdminState> {
  await requireAdmin();
  const parsed = bannerSchema.safeParse({
    title: fd.get("title"),
    subtitle: fd.get("subtitle") || undefined,
    image: fd.get("image"),
    link: fd.get("link"),
    sortOrder: fd.get("sortOrder") || 0,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  await db.insert(banners).values(parsed.data);
  await afterProductChange([]);
  revalidatePath("/admin/banners");
  return { message: "Banner added" };
}

export async function toggleBannerAction(id: number) {
  await requireAdmin();
  await db.update(banners).set({ isActive: sql`not ${banners.isActive}` }).where(eq(banners.id, id));
  await afterProductChange([]);
  revalidatePath("/admin/banners");
}

export async function deleteBannerAction(id: number) {
  await requireAdmin();
  await db.delete(banners).where(eq(banners.id, id));
  await afterProductChange([]);
  revalidatePath("/admin/banners");
}

export async function reindexAction(_: AdminState): Promise<AdminState> {
  await requireAdmin();
  try {
    const n = await reindexAllProducts();
    await invalidateCatalog();
    return { message: `Indexed ${n} products into Elasticsearch` };
  } catch (e) {
    return { error: `Reindex failed: ${(e as Error).message}` };
  }
}

export async function flushCacheAction(_: AdminState): Promise<AdminState> {
  await requireAdmin();
  await flushAppCache();
  revalidatePath("/", "layout");
  return { message: "Redis cache flushed and pages revalidated" };
}
