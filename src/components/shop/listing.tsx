import Link from "next/link";
import { searchProducts } from "@/lib/search";
import { getCategories } from "@/lib/catalog";
import { buildHref, type RawParams } from "@/lib/listing-params";
import { SORT_OPTIONS, type SearchQuery } from "@/lib/search-types";
import { formatPrice } from "@/lib/format";
import { ProductCard } from "./product-card";

type Props = { base: string; params: RawParams; query: SearchQuery; title: string; lockCategory?: boolean };

export async function ProductListing({ base, params, query, title, lockCategory }: Props) {
  const [result, categories] = await Promise.all([searchProducts(query), getCategories()]);
  const catName = new Map(categories.map((c) => [c.slug, c.name]));
  const selectedBrands = new Set(query.brands ?? []);
  const href = (o: Record<string, string | string[] | null>) => buildHref(base, params, o);

  const filters = (
    <div className="divide-y text-sm">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Link href={buildHref(base, { q: params.q }, {})} className="text-xs font-semibold uppercase text-brand">
          Clear all
        </Link>
      </div>

      {!lockCategory && result.facets.categories.length > 0 && (
        <fieldset className="p-4">
          <legend className="mb-2 text-xs font-semibold uppercase text-gray-700">Categories</legend>
          <ul className="space-y-1.5">
            {query.category && (
              <li>
                <Link href={href({ category: null })} className="text-gray-500">‹ All categories</Link>
              </li>
            )}
            {result.facets.categories.map((c) => (
              <li key={c.key}>
                <Link
                  href={href({ category: c.key })}
                  className={query.category === c.key ? "font-semibold text-brand" : "hover:text-brand"}
                >
                  {c.label ?? catName.get(c.key) ?? c.key} <span className="text-gray-400">({c.count})</span>
                </Link>
              </li>
            ))}
          </ul>
        </fieldset>
      )}

      <fieldset className="p-4">
        <legend className="mb-2 text-xs font-semibold uppercase text-gray-700">Price</legend>
        <form action={base} className="flex items-center gap-2">
          {Object.entries(params).map(([k, v]) =>
            ["min", "max", "page"].includes(k) || v == null
              ? null
              : (Array.isArray(v) ? v : [v]).map((val, i) => <input key={`${k}${i}`} type="hidden" name={k} value={val} />),
          )}
          <input name="min" type="number" min={0} defaultValue={query.minPrice} placeholder="Min" className="input py-1" aria-label="Minimum price" />
          <span className="text-gray-400">to</span>
          <input name="max" type="number" min={0} defaultValue={query.maxPrice} placeholder="Max" className="input py-1" aria-label="Maximum price" />
          <button className="rounded-sm bg-brand px-2 py-1.5 text-xs font-semibold text-white">Go</button>
        </form>
        {result.facets.priceMax > 0 && (
          <p className="mt-2 text-xs text-gray-500">
            Range: {formatPrice(result.facets.priceMin)} – {formatPrice(result.facets.priceMax)}
          </p>
        )}
      </fieldset>

      {result.facets.brands.length > 0 && (
        <fieldset className="p-4">
          <legend className="mb-2 text-xs font-semibold uppercase text-gray-700">Brand</legend>
          <ul className="max-h-64 space-y-1.5 overflow-y-auto">
            {result.facets.brands.map((b) => {
              const on = selectedBrands.has(b.key);
              const next = on ? [...selectedBrands].filter((x) => x !== b.key) : [...selectedBrands, b.key];
              return (
                <li key={b.key}>
                  <Link href={href({ brand: next })} className="flex items-center gap-2 hover:text-brand" rel="nofollow">
                    <span className={`flex h-4 w-4 items-center justify-center rounded-sm border ${on ? "border-brand bg-brand text-white" : "border-gray-400"}`}>
                      {on && "✓"}
                    </span>
                    {b.key} <span className="text-gray-400">({b.count})</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </fieldset>
      )}

      <fieldset className="p-4">
        <legend className="mb-2 text-xs font-semibold uppercase text-gray-700">Customer Ratings</legend>
        <ul className="space-y-1.5">
          {[4, 3].map((r) => (
            <li key={r}>
              <Link href={href({ rating: query.minRating === r ? null : String(r) })} rel="nofollow" className={query.minRating === r ? "font-semibold text-brand" : "hover:text-brand"}>
                {r}★ &amp; above
              </Link>
            </li>
          ))}
        </ul>
      </fieldset>

      <div className="p-4">
        <Link href={href({ instock: query.inStock ? null : "1" })} rel="nofollow" className="flex items-center gap-2 hover:text-brand">
          <span className={`flex h-4 w-4 items-center justify-center rounded-sm border ${query.inStock ? "border-brand bg-brand text-white" : "border-gray-400"}`}>
            {query.inStock && "✓"}
          </span>
          Exclude out of stock
        </Link>
      </div>
    </div>
  );

  const page = result.page;
  const from = result.total ? (page - 1) * result.pageSize + 1 : 0;
  const to = Math.min(result.total, page * result.pageSize);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-2 px-2 py-3 md:flex-row sm:px-3">
      <aside className="card hidden w-64 shrink-0 self-start md:block">{filters}</aside>
      <details className="card md:hidden">
        <summary className="cursor-pointer p-3 text-sm font-semibold">Filters</summary>
        {filters}
      </details>

      <section className="card min-w-0 flex-1">
        <div className="border-b px-4 pt-4">
          <h1 className="text-base font-semibold">
            {title}{" "}
            <span className="text-xs font-normal text-gray-500">
              (Showing {from} – {to} of {result.total.toLocaleString("en-IN")} products)
            </span>
          </h1>
          <nav aria-label="Sort" className="scrollbar-none mt-2 flex gap-5 overflow-x-auto text-sm">
            <span className="shrink-0 py-2 font-semibold">Sort By</span>
            {SORT_OPTIONS.map((o) => (
              <Link
                key={o.value}
                href={href({ sort: o.value === "relevance" ? null : o.value })}
                rel="nofollow"
                className={`shrink-0 border-b-2 py-2 ${query.sort === o.value ? "border-brand font-semibold text-brand" : "border-transparent hover:text-brand"}`}
              >
                {o.label}
              </Link>
            ))}
          </nav>
        </div>

        {result.items.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-lg font-semibold">Sorry, no results found!</p>
            <p className="mt-1 text-sm text-gray-500">Please check the spelling or try searching for something else</p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-px bg-gray-100 sm:grid-cols-3 lg:grid-cols-4">
            {result.items.map((p, i) => (
              <li key={p.id}>
                <ProductCard product={p} priority={i < 4} />
              </li>
            ))}
          </ul>
        )}

        {result.totalPages > 1 && (
          <nav aria-label="Pagination" className="flex items-center justify-between gap-3 border-t p-4 text-sm">
            <span className="text-gray-600">Page {page} of {result.totalPages}</span>
            <div className="flex items-center gap-1">
              {page > 1 && (
                <Link href={href({ page: String(page - 1) })} rel="prev" className="px-3 py-1.5 font-semibold text-brand">Previous</Link>
              )}
              {pageWindow(page, result.totalPages).map((p) => (
                <Link
                  key={p}
                  href={href({ page: p === 1 ? null : String(p) })}
                  aria-current={p === page ? "page" : undefined}
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${p === page ? "bg-brand text-white" : "hover:bg-gray-100"}`}
                >
                  {p}
                </Link>
              ))}
              {page < result.totalPages && (
                <Link href={href({ page: String(page + 1) })} rel="next" className="px-3 py-1.5 font-semibold text-brand">Next</Link>
              )}
            </div>
          </nav>
        )}
        <p className="px-4 pb-3 text-right text-[11px] text-gray-400">
          Search powered by {result.engine === "elasticsearch" ? "Elasticsearch" : "PostgreSQL"}
          {query.minPrice != null || query.maxPrice != null
            ? ` · ${formatPrice(query.minPrice ?? 0)} – ${query.maxPrice != null ? formatPrice(query.maxPrice) : "∞"}`
            : ""}
        </p>
      </section>
    </div>
  );
}

function pageWindow(page: number, total: number) {
  const start = Math.max(1, Math.min(page - 2, total - 4));
  return Array.from({ length: Math.min(5, total) }, (_, i) => start + i);
}

export function ListingSkeleton() {
  return (
    <div className="mx-auto flex max-w-7xl gap-2 px-3 py-3">
      <div className="card hidden h-[600px] w-64 animate-pulse md:block" />
      <div className="card grid flex-1 animate-pulse grid-cols-2 gap-4 p-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-72 rounded bg-gray-100" />
        ))}
      </div>
    </div>
  );
}
