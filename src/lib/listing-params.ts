import { SORT_OPTIONS, type SearchQuery, type SortOption } from "./search-types";

export type RawParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const num = (v: string | string[] | undefined) => {
  const n = Number(first(v));
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

export function parseListingParams(sp: RawParams): SearchQuery {
  const sort = first(sp.sort) as SortOption | undefined;
  const brands = sp.brand ? (Array.isArray(sp.brand) ? sp.brand : [sp.brand]).filter(Boolean).slice(0, 20) : undefined;
  return {
    q: first(sp.q)?.slice(0, 120) || undefined,
    category: first(sp.category) || undefined,
    brands: brands?.length ? brands : undefined,
    minPrice: num(sp.min),
    maxPrice: num(sp.max),
    minRating: num(sp.rating),
    inStock: first(sp.instock) === "1" || undefined,
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? sort : "relevance",
    page: Math.min(100, Math.max(1, num(sp.page) ?? 1)),
    pageSize: 24,
  };
}

/** Build a listing URL from the current params with some keys overridden (null removes). */
export function buildHref(base: string, sp: RawParams, overrides: Record<string, string | string[] | null>) {
  const u = new URLSearchParams();
  const merged: RawParams = { ...sp };
  for (const [k, v] of Object.entries(overrides)) merged[k] = v ?? undefined;
  if (!("page" in overrides)) delete merged.page;
  for (const [k, v] of Object.entries(merged)) {
    if (v == null || v === "") continue;
    for (const item of Array.isArray(v) ? v : [v]) if (item) u.append(k, item);
  }
  const qs = u.toString();
  return qs ? `${base}?${qs}` : base;
}
