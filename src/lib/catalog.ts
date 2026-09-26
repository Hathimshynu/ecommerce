import "server-only";
import { and, asc, desc, eq, ne, sql } from "drizzle-orm";
import { db } from "@/db";
import { banners, categories, products, reviews, users, type Product } from "@/db/schema";
import { cached, invalidate } from "./redis";
import type { ProductCardData } from "./search-types";

const TTL = { short: 60, medium: 300, long: 1800 };

const cardColumns = {
  id: products.id,
  name: products.name,
  slug: products.slug,
  brand: products.brand,
  price: products.price,
  mrp: products.mrp,
  rating: products.rating,
  ratingCount: products.ratingCount,
  stock: products.stock,
  images: products.images,
};

type CardRow = { images: string[] } & Omit<ProductCardData, "image">;
const toCard = ({ images, ...rest }: CardRow): ProductCardData => ({ ...rest, image: images[0] ?? null });

export function getCategories() {
  return cached("catalog:categories", TTL.long, () =>
    db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name)),
  );
}

export async function getCategoryBySlug(slug: string) {
  const all = await getCategories();
  return all.find((c) => c.slug === slug) ?? null;
}

export function getBanners() {
  return cached("catalog:banners", TTL.long, () =>
    db.select().from(banners).where(eq(banners.isActive, true)).orderBy(asc(banners.sortOrder)),
  );
}

export function getFeaturedProducts(limit = 12) {
  return cached(`catalog:featured:${limit}`, TTL.medium, async () =>
    (
      await db
        .select(cardColumns)
        .from(products)
        .where(and(eq(products.isActive, true), eq(products.isFeatured, true)))
        .orderBy(desc(products.ratingCount))
        .limit(limit)
    ).map(toCard),
  );
}

export function getTopDeals(limit = 12) {
  return cached(`catalog:deals:${limit}`, TTL.medium, async () =>
    (
      await db
        .select(cardColumns)
        .from(products)
        .where(and(eq(products.isActive, true), sql`${products.stock} > 0`))
        .orderBy(desc(sql`(${products.mrp} - ${products.price})::float / nullif(${products.mrp}, 0)`))
        .limit(limit)
    ).map(toCard),
  );
}

export function getProductsByCategory(categoryId: number, limit = 12) {
  return cached(`catalog:bycat:${categoryId}:${limit}`, TTL.medium, async () =>
    (
      await db
        .select(cardColumns)
        .from(products)
        .where(and(eq(products.isActive, true), eq(products.categoryId, categoryId)))
        .orderBy(desc(products.rating), desc(products.ratingCount))
        .limit(limit)
    ).map(toCard),
  );
}

export type ProductDetail = Product & { category: { id: number; name: string; slug: string } };

export function getProductBySlug(slug: string) {
  return cached<ProductDetail | null>(`product:slug:${slug}`, TTL.medium, async () => {
    const [row] = await db
      .select({ product: products, category: { id: categories.id, name: categories.name, slug: categories.slug } })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.slug, slug), eq(products.isActive, true)))
      .limit(1);
    return row ? { ...row.product, category: row.category } : null;
  });
}

export function getRelatedProducts(productId: number, categoryId: number, limit = 8) {
  return cached(`product:related:${productId}`, TTL.medium, async () =>
    (
      await db
        .select(cardColumns)
        .from(products)
        .where(and(eq(products.isActive, true), eq(products.categoryId, categoryId), ne(products.id, productId)))
        .orderBy(desc(products.rating))
        .limit(limit)
    ).map(toCard),
  );
}

export function getProductReviews(productId: number) {
  return cached(`product:reviews:${productId}`, TTL.medium, () =>
    db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        title: reviews.title,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        userName: users.name,
        userId: reviews.userId,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt))
      .limit(50),
  );
}

export function getAllProductSlugs() {
  return cached("catalog:slugs", TTL.medium, () =>
    db
      .select({ slug: products.slug, updatedAt: products.updatedAt })
      .from(products)
      .where(eq(products.isActive, true))
      .orderBy(desc(products.ratingCount)),
  );
}

/** Drop every catalog-related cache entry after an admin change. */
export async function invalidateCatalog() {
  await invalidate("catalog:", "product:", "search:", "suggest:");
}
