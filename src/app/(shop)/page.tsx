import { Suspense } from "react";
import { BannerCarousel } from "@/components/shop/banner-carousel";
import { CategoryBar } from "@/components/shop/category-bar";
import { ProductRail, ProductRailSkeleton } from "@/components/shop/product-card";
import { JsonLd } from "@/components/json-ld";
import { getBanners, getCategories, getFeaturedProducts, getProductsByCategory, getTopDeals } from "@/lib/catalog";
import { siteName, siteUrl } from "@/lib/format";

// Incremental Static Regeneration: served from the edge/static cache, rebuilt in the background.
export const revalidate = 60;

/** During `next build` the database may not be reachable (e.g. Docker image builds). */
async function safe<T>(p: Promise<T>, fallback: T): Promise<T> {
  try {
    return await p;
  } catch (e) {
    console.warn("[home] data unavailable:", (e as Error).message);
    return fallback;
  }
}

async function CategoryRails() {
  const categories = await safe(getCategories(), []);
  const rails = await Promise.all(
    categories.slice(0, 6).map(async (c) => ({ c, items: await safe(getProductsByCategory(c.id, 12), []) })),
  );
  return (
    <>
      {rails.map(({ c, items }) => (
        <ProductRail key={c.id} title={`Best of ${c.name}`} href={`/c/${c.slug}`} products={items} />
      ))}
    </>
  );
}

async function Deals() {
  return <ProductRail title="Top Deals" href="/search?sort=discount" products={await safe(getTopDeals(14), [])} />;
}

async function Featured() {
  return <ProductRail title="Suggested For You" href="/search" products={await safe(getFeaturedProducts(14), [])} />;
}

export default async function HomePage() {
  const banners = await safe(getBanners(), []);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteName(),
          url: siteUrl(),
          logo: `${siteUrl()}/icon.svg`,
        }}
      />
      <h1 className="sr-only">{siteName()} — Online shopping for mobiles, electronics, fashion and more</h1>
      <CategoryBar />
      <div className="mx-auto max-w-7xl space-y-3 px-2 py-3 sm:px-3">
        <BannerCarousel banners={banners} />
        <Suspense fallback={<ProductRailSkeleton />}>
          <Deals />
        </Suspense>
        <Suspense fallback={<ProductRailSkeleton />}>
          <Featured />
        </Suspense>
        <Suspense fallback={<ProductRailSkeleton />}>
          <CategoryRails />
        </Suspense>
      </div>
    </>
  );
}
