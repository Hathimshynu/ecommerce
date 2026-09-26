import "server-only";
import { and, asc, count, desc, eq, gt, gte, ilike, inArray, lte, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { cached } from "./redis";
import { esAvailable, esSearch, esSuggest, markEsDown } from "./elasticsearch";
import type { SearchQuery, SearchResult } from "./search-types";

const SEARCH_TTL = 120;

function cacheKey(q: SearchQuery) {
  const norm = {
    q: q.q?.trim().toLowerCase() || undefined,
    c: q.category,
    b: q.brands?.slice().sort(),
    min: q.minPrice,
    max: q.maxPrice,
    r: q.minRating,
    s: q.sort,
    st: q.inStock,
    p: q.page,
    ps: q.pageSize,
  };
  return `search:${Buffer.from(JSON.stringify(norm)).toString("base64url")}`;
}

/** Product search: Elasticsearch first, PostgreSQL fallback, results cached in Redis. */
export async function searchProducts(query: SearchQuery): Promise<SearchResult> {
  return cached(cacheKey(query), SEARCH_TTL, async () => {
    if (esAvailable()) {
      try {
        return await esSearch(query);
      } catch (e) {
        markEsDown();
        console.warn("[search] elasticsearch unavailable, falling back to postgres:", (e as Error).message);
      }
    }
    return pgSearch(query);
  });
}

export async function suggestProducts(prefix: string): Promise<string[]> {
  const q = prefix.trim().toLowerCase();
  if (q.length < 2) return [];
  return cached(`suggest:${q}`, 300, async () => {
    if (esAvailable()) {
      try {
        return await esSuggest(q);
      } catch {
        markEsDown();
      }
    }
    const rows = await db
      .select({ name: products.name })
      .from(products)
      .where(and(eq(products.isActive, true), or(ilike(products.name, `%${escapeLike(q)}%`), ilike(products.brand, `${escapeLike(q)}%`))))
      .orderBy(desc(products.ratingCount))
      .limit(8);
    return rows.map((r) => r.name);
  });
}

const escapeLike = (s: string) => s.replace(/[\\%_]/g, (m) => `\\${m}`);

async function pgSearch(query: SearchQuery): Promise<SearchResult> {
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.min(48, query.pageSize ?? 24);

  const base: SQL[] = [eq(products.isActive, true)];
  if (query.q?.trim()) {
    const terms = query.q.trim().split(/\s+/).slice(0, 6);
    for (const term of terms) {
      const like = `%${escapeLike(term)}%`;
      base.push(or(ilike(products.name, like), ilike(products.brand, like), ilike(categories.name, like))!);
    }
  }
  if (query.category) base.push(eq(categories.slug, query.category));
  if (query.minPrice != null) base.push(gte(products.price, query.minPrice));
  if (query.maxPrice != null) base.push(lte(products.price, query.maxPrice));
  if (query.minRating) base.push(gte(products.rating, query.minRating));
  if (query.inStock) base.push(gt(products.stock, 0));

  const withBrand = query.brands?.length ? [...base, inArray(products.brand, query.brands)] : base;

  const orderBy = {
    relevance: [desc(products.isFeatured), desc(products.ratingCount)],
    price_asc: [asc(products.price)],
    price_desc: [desc(products.price)],
    newest: [desc(products.createdAt)],
    rating: [desc(products.rating), desc(products.ratingCount)],
    discount: [desc(sql`(${products.mrp} - ${products.price})::float / nullif(${products.mrp}, 0)`)],
  }[query.sort ?? "relevance"];

  const [rows, [{ total }], brandFacets, categoryFacets, [priceStats]] = await Promise.all([
    db
      .select({
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
        categorySlug: categories.slug,
      })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(and(...withBrand))
      .orderBy(...orderBy, asc(products.id))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db
      .select({ total: count() })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(and(...withBrand)),
    db
      .select({ key: products.brand, count: count() })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(and(...base))
      .groupBy(products.brand)
      .orderBy(desc(count()))
      .limit(30),
    db
      .select({ key: categories.slug, label: categories.name, count: count() })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(and(...base))
      .groupBy(categories.slug, categories.name)
      .orderBy(desc(count())),
    db
      .select({ min: sql<number>`coalesce(min(${products.price}), 0)::int`, max: sql<number>`coalesce(max(${products.price}), 0)::int` })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(and(...base)),
  ]);

  return {
    items: rows.map(({ images, ...r }) => ({ ...r, image: images[0] ?? null })),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    facets: {
      brands: brandFacets,
      categories: categoryFacets,
      priceMin: priceStats?.min ?? 0,
      priceMax: priceStats?.max ?? 0,
    },
    engine: "postgres",
  };
}
