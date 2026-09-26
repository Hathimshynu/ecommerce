import { Client } from "@elastic/elasticsearch";
import type { estypes } from "@elastic/elasticsearch";
import type { SearchQuery, SearchResult, ProductCardData } from "./search-types";
import { discountPercent } from "./format";

const globalForEs = globalThis as unknown as { es?: Client | null; esDownUntil?: number };

export const PRODUCT_INDEX = process.env.ELASTICSEARCH_INDEX ?? "products";

export function getEs(): Client | null {
  if (globalForEs.es !== undefined) return globalForEs.es;
  const node = process.env.ELASTICSEARCH_URL;
  if (!node) return (globalForEs.es = null);
  globalForEs.es = new Client({
    node,
    auth: process.env.ELASTICSEARCH_API_KEY ? { apiKey: process.env.ELASTICSEARCH_API_KEY } : undefined,
    requestTimeout: 3_000,
    maxRetries: 0,
    sniffOnStart: false,
  });
  return globalForEs.es;
}

/** Circuit breaker: after a failure, skip ES for 30s so requests don't pay the timeout each time. */
export function esAvailable() {
  return !!getEs() && (globalForEs.esDownUntil ?? 0) < Date.now();
}
export function markEsDown() {
  globalForEs.esDownUntil = Date.now() + 30_000;
}

export type ProductDoc = {
  id: number;
  name: string;
  slug: string;
  brand: string;
  description: string;
  category: string;
  categoryName: string;
  price: number;
  mrp: number;
  discount: number;
  rating: number;
  ratingCount: number;
  stock: number;
  image: string | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  suggest: { input: string[]; weight: number };
};

export function toDoc(p: {
  id: number;
  name: string;
  slug: string;
  brand: string;
  description: string;
  price: number;
  mrp: number;
  rating: number;
  ratingCount: number;
  stock: number;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date | string;
  category: { slug: string; name: string };
}): ProductDoc {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    brand: p.brand,
    description: p.description,
    category: p.category.slug,
    categoryName: p.category.name,
    price: p.price,
    mrp: p.mrp,
    discount: discountPercent(p.price, p.mrp),
    rating: p.rating,
    ratingCount: p.ratingCount,
    stock: p.stock,
    image: p.images[0] ?? null,
    isActive: p.isActive,
    isFeatured: p.isFeatured,
    createdAt: new Date(p.createdAt).toISOString(),
    suggest: {
      input: [p.name, p.brand, `${p.brand} ${p.category.name}`, p.category.name],
      weight: Math.max(1, Math.round(p.rating * 10 + Math.log10(p.ratingCount + 1) * 10)),
    },
  };
}

const INDEX_SETTINGS: estypes.IndicesIndexSettings = {
  number_of_shards: 1,
  number_of_replicas: 0,
  analysis: {
    filter: {
      autocomplete_filter: { type: "edge_ngram", min_gram: 2, max_gram: 20 },
    },
    analyzer: {
      autocomplete: { type: "custom", tokenizer: "standard", filter: ["lowercase", "asciifolding", "autocomplete_filter"] },
      autocomplete_search: { type: "custom", tokenizer: "standard", filter: ["lowercase", "asciifolding"] },
    },
  },
};

const INDEX_MAPPINGS: estypes.MappingTypeMapping = {
  properties: {
    id: { type: "integer" },
    name: {
      type: "text",
      analyzer: "english",
      fields: {
        autocomplete: { type: "text", analyzer: "autocomplete", search_analyzer: "autocomplete_search" },
        keyword: { type: "keyword", ignore_above: 256 },
      },
    },
    slug: { type: "keyword" },
    brand: {
      type: "text",
      fields: {
        keyword: { type: "keyword" },
        autocomplete: { type: "text", analyzer: "autocomplete", search_analyzer: "autocomplete_search" },
      },
    },
    description: { type: "text", analyzer: "english" },
    category: { type: "keyword" },
    categoryName: { type: "text", fields: { keyword: { type: "keyword" } } },
    price: { type: "integer" },
    mrp: { type: "integer" },
    discount: { type: "integer" },
    rating: { type: "float" },
    ratingCount: { type: "integer" },
    stock: { type: "integer" },
    image: { type: "keyword", index: false },
    isActive: { type: "boolean" },
    isFeatured: { type: "boolean" },
    createdAt: { type: "date" },
    suggest: { type: "completion", analyzer: "simple" },
  },
};

export async function ensureProductIndex(recreate = false) {
  const es = getEs();
  if (!es) throw new Error("ELASTICSEARCH_URL is not configured");
  const exists = await es.indices.exists({ index: PRODUCT_INDEX });
  if (exists && recreate) await es.indices.delete({ index: PRODUCT_INDEX });
  if (!exists || recreate) {
    await es.indices.create({ index: PRODUCT_INDEX, settings: INDEX_SETTINGS, mappings: INDEX_MAPPINGS });
  }
}

export async function bulkIndex(docs: ProductDoc[]) {
  const es = getEs();
  if (!es || docs.length === 0) return;
  const operations = docs.flatMap((doc) => [{ index: { _index: PRODUCT_INDEX, _id: String(doc.id) } }, doc]);
  const res = await es.bulk({ refresh: true, operations });
  if (res.errors) {
    const first = res.items.find((i) => i.index?.error)?.index?.error;
    throw new Error(`Bulk index failed: ${first?.reason ?? "unknown"}`);
  }
}

export async function indexDoc(doc: ProductDoc) {
  if (!esAvailable()) return;
  try {
    await getEs()!.index({ index: PRODUCT_INDEX, id: String(doc.id), document: doc, refresh: "wait_for" });
  } catch (e) {
    markEsDown();
    console.warn("[es] index failed", (e as Error).message);
  }
}

export async function deleteDoc(id: number) {
  if (!esAvailable()) return;
  try {
    await getEs()!.delete({ index: PRODUCT_INDEX, id: String(id), refresh: "wait_for" });
  } catch (e) {
    if ((e as { meta?: { statusCode?: number } }).meta?.statusCode !== 404) markEsDown();
  }
}

type Buckets = { buckets: { key: string; doc_count: number }[] };

export async function esSearch(query: SearchQuery): Promise<SearchResult> {
  const es = getEs()!;
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.min(48, query.pageSize ?? 24);

  const filter: estypes.QueryDslQueryContainer[] = [{ term: { isActive: true } }];
  if (query.category) filter.push({ term: { category: query.category } });
  if (query.minPrice != null || query.maxPrice != null)
    filter.push({ range: { price: { gte: query.minPrice, lte: query.maxPrice } } });
  if (query.minRating) filter.push({ range: { rating: { gte: query.minRating } } });
  if (query.inStock) filter.push({ range: { stock: { gt: 0 } } });

  const must: estypes.QueryDslQueryContainer[] = query.q
    ? [
        {
          multi_match: {
            query: query.q,
            fields: ["name^5", "name.autocomplete^2", "brand^4", "brand.autocomplete", "categoryName^3", "description"],
            type: "best_fields",
            fuzziness: "AUTO",
            operator: "and",
          },
        },
      ]
    : [{ match_all: {} }];

  // Brand filter lives in post_filter so the brand facet still lists every brand for the query.
  const brandFilter = query.brands?.length ? { terms: { "brand.keyword": query.brands } } : undefined;

  const sortMap: Record<string, estypes.Sort> = {
    relevance: query.q ? ["_score", { ratingCount: "desc" }] : [{ isFeatured: "desc" }, { ratingCount: "desc" }],
    price_asc: [{ price: "asc" }],
    price_desc: [{ price: "desc" }],
    newest: [{ createdAt: "desc" }],
    rating: [{ rating: "desc" }, { ratingCount: "desc" }],
    discount: [{ discount: "desc" }],
  };

  const res = await es.search<ProductDoc>({
    index: PRODUCT_INDEX,
    from: (page - 1) * pageSize,
    size: pageSize,
    track_total_hits: true,
    query: {
      function_score: {
        query: { bool: { must, filter } },
        // Mild popularity boost so well-rated products surface first among equal matches.
        functions: [{ field_value_factor: { field: "ratingCount", modifier: "log1p", factor: 0.1, missing: 0 } }],
        boost_mode: "sum",
      },
    },
    post_filter: brandFilter,
    sort: sortMap[query.sort ?? "relevance"],
    aggs: {
      brands: { terms: { field: "brand.keyword", size: 30 } },
      categories: { terms: { field: "category", size: 30 } },
      price: { stats: { field: "price" } },
    },
    _source: ["id", "name", "slug", "brand", "price", "mrp", "rating", "ratingCount", "image", "stock", "category"],
  });

  const total = typeof res.hits.total === "number" ? res.hits.total : (res.hits.total?.value ?? 0);
  const aggs = res.aggregations as unknown as {
    brands: Buckets;
    categories: Buckets;
    price: { min: number | null; max: number | null };
  };

  return {
    items: res.hits.hits.map((h) => {
      const s = h._source!;
      return {
        id: s.id,
        name: s.name,
        slug: s.slug,
        brand: s.brand,
        price: s.price,
        mrp: s.mrp,
        rating: s.rating,
        ratingCount: s.ratingCount,
        image: s.image,
        stock: s.stock,
        categorySlug: s.category,
      } satisfies ProductCardData;
    }),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    facets: {
      brands: aggs.brands.buckets.map((b) => ({ key: b.key, count: b.doc_count })),
      categories: aggs.categories.buckets.map((b) => ({ key: b.key, count: b.doc_count })),
      priceMin: aggs.price.min ?? 0,
      priceMax: aggs.price.max ?? 0,
    },
    engine: "elasticsearch",
  };
}

export async function esSuggest(prefix: string): Promise<string[]> {
  const es = getEs()!;
  const res = await es.search<ProductDoc>({
    index: PRODUCT_INDEX,
    size: 5,
    _source: ["name"],
    query: {
      bool: {
        filter: [{ term: { isActive: true } }],
        must: [
          {
            multi_match: {
              query: prefix,
              fields: ["name.autocomplete^2", "brand.autocomplete"],
              operator: "and",
            },
          },
        ],
      },
    },
    suggest: {
      completion: { prefix, completion: { field: "suggest", size: 6, skip_duplicates: true, fuzzy: { fuzziness: 1 } } },
    },
  });
  const fromSuggest = ((res.suggest?.completion?.[0]?.options ?? []) as { text: string }[]).map((o) => o.text);
  const fromHits = res.hits.hits.map((h) => h._source!.name);
  return [...new Set([...fromSuggest, ...fromHits])].slice(0, 8);
}

export async function esHealth(): Promise<boolean> {
  const es = getEs();
  if (!es) return false;
  try {
    return await es.ping();
  } catch {
    return false;
  }
}
