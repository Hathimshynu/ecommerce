import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { JsonLd } from "@/components/json-ld";
import { ProductGallery } from "@/components/shop/product-gallery";
import { ProductActions, WishlistButton } from "@/components/shop/product-actions";
import { ProductRail, ProductRailSkeleton } from "@/components/shop/product-card";
import { RatingBadge } from "@/components/shop/rating";
import { ReviewForm } from "@/components/shop/review-form";
import { getAllProductSlugs, getProductBySlug, getProductReviews, getRelatedProducts } from "@/lib/catalog";
import { discountPercent, formatDate, formatPrice, siteName, siteUrl } from "@/lib/format";

export const revalidate = 600;
export const dynamicParams = true;

/** Pre-render the most popular products at build time; the rest render on first request (ISR). */
export async function generateStaticParams() {
  try {
    return (await getAllProductSlugs()).slice(0, 50).map(({ slug }) => ({ slug }));
  } catch {
    return [];
  }
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Product not found", robots: { index: false } };
  const off = discountPercent(p.price, p.mrp);
  const title = `${p.name} – Buy at ${formatPrice(p.price)}${off ? ` (${off}% off)` : ""}`;
  const description = `Buy ${p.name} online at ${formatPrice(p.price)}. ${p.highlights.slice(0, 3).join(", ")}. Free delivery, easy returns & COD on ${siteName()}.`;
  return {
    title,
    description: description.slice(0, 300),
    alternates: { canonical: `/p/${slug}` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `/p/${slug}`,
      images: p.images.slice(0, 1).map((url) => ({ url, width: 600, height: 600, alt: p.name })),
    },
    twitter: { card: "summary_large_image", title, description, images: p.images.slice(0, 1) },
  };
}

async function Related({ id, categoryId }: { id: number; categoryId: number }) {
  return <ProductRail title="Similar Products" products={await getRelatedProducts(id, categoryId)} />;
}

async function Reviews({ productId, slug, rating, ratingCount }: { productId: number; slug: string; rating: number; ratingCount: number }) {
  const list = await getProductReviews(productId);
  const dist = [5, 4, 3, 2, 1].map((s) => ({ s, n: list.filter((r) => r.rating === s).length }));
  const max = Math.max(1, ...dist.map((d) => d.n));
  return (
    <section className="card p-4 sm:p-6" aria-labelledby="reviews-h">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="reviews-h" className="text-xl font-semibold">Ratings &amp; Reviews</h2>
        <ReviewForm productId={productId} slug={slug} />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-8 border-b pb-6">
        <div className="text-center">
          <p className="text-3xl font-semibold">{rating.toFixed(1)} ★</p>
          <p className="text-sm text-gray-500">{ratingCount.toLocaleString("en-IN")} Ratings &amp; {list.length} Reviews</p>
        </div>
        <ul className="w-64 space-y-1 text-xs">
          {dist.map(({ s, n }) => (
            <li key={s} className="flex items-center gap-2">
              <span className="w-6">{s} ★</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded bg-gray-200">
                <span className={`block h-full ${s >= 3 ? "bg-success" : s === 2 ? "bg-orange-400" : "bg-red-500"}`} style={{ width: `${(n / max) * 100}%` }} />
              </span>
              <span className="w-6 text-right text-gray-500">{n}</span>
            </li>
          ))}
        </ul>
      </div>
      <ul className="divide-y">
        {list.map((r) => (
          <li key={r.id} className="py-4">
            <div className="flex items-center gap-2">
              <RatingBadge rating={r.rating} />
              <p className="font-semibold">{r.title}</p>
            </div>
            <p className="mt-2 text-sm text-gray-700">{r.comment}</p>
            <p className="mt-2 text-xs text-gray-500">
              {r.userName} · Certified Buyer · {formatDate(r.createdAt)}
            </p>
          </li>
        ))}
        {!list.length && <li className="py-6 text-sm text-gray-500">No reviews yet. Be the first to review this product.</li>}
      </ul>
    </section>
  );
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) notFound();
  const off = discountPercent(p.price, p.mrp);
  const url = `${siteUrl()}/p/${p.slug}`;

  return (
    <div className="mx-auto max-w-7xl space-y-3 px-2 py-3 sm:px-3">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.name,
            image: p.images,
            description: p.description,
            sku: String(p.id),
            brand: { "@type": "Brand", name: p.brand },
            category: p.category.name,
            aggregateRating:
              p.ratingCount > 0
                ? { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.ratingCount, bestRating: 5, worstRating: 1 }
                : undefined,
            offers: {
              "@type": "Offer",
              url,
              priceCurrency: "INR",
              price: p.price,
              availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              itemCondition: "https://schema.org/NewCondition",
              seller: { "@type": "Organization", name: siteName() },
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteUrl() },
              { "@type": "ListItem", position: 2, name: p.category.name, item: `${siteUrl()}/c/${p.category.slug}` },
              { "@type": "ListItem", position: 3, name: p.name, item: url },
            ],
          },
        ]}
      />
      <div className="card grid gap-6 p-4 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:p-6">
        <div className="md:sticky md:top-20 md:self-start">
          <div className="relative">
            <WishlistButton productId={p.id} />
            <ProductGallery images={p.images} name={p.name} />
          </div>
          <div className="mt-4">
            <ProductActions
              item={{ id: p.id, slug: p.slug, name: p.name, image: p.images[0] ?? null, price: p.price, mrp: p.mrp, stock: p.stock }}
            />
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-500">
            <ol className="flex flex-wrap gap-1">
              <li><Link href="/" className="hover:text-brand">Home</Link> ›</li>
              <li><Link href={`/c/${p.category.slug}`} className="hover:text-brand">{p.category.name}</Link> ›</li>
              <li className="truncate">{p.brand}</li>
            </ol>
          </nav>
          <h1 className="text-lg text-gray-900 sm:text-xl">{p.name}</h1>
          <div className="flex items-center gap-2">
            <RatingBadge rating={p.rating} />
            <span className="text-sm font-medium text-gray-500">{p.ratingCount.toLocaleString("en-IN")} Ratings</span>
          </div>
          {off > 0 && <p className="text-sm font-semibold text-success">Special price</p>}
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-semibold">{formatPrice(p.price)}</span>
            {off > 0 && (
              <>
                <span className="text-gray-500 line-through">{formatPrice(p.mrp)}</span>
                <span className="font-semibold text-success">{off}% off</span>
              </>
            )}
          </div>
          <p className={`text-sm font-medium ${p.stock > 0 ? (p.stock < 10 ? "text-orange-600" : "text-success") : "text-red-600"}`}>
            {p.stock > 0 ? (p.stock < 10 ? `Hurry, only ${p.stock} left!` : "In stock") : "Out of stock"}
          </p>

          <div>
            <h2 className="mb-2 font-semibold">Available offers</h2>
            <ul className="space-y-1.5 text-sm">
              <li>🏷️ <b>Bank Offer</b> 10% instant discount on select credit cards, up to ₹1,500</li>
              <li>🏷️ <b>Special Price</b> Get extra {Math.max(5, off)}% off (price inclusive of discount)</li>
              <li>🚚 <b>Free delivery</b> on orders above ₹500 · Cash on Delivery available</li>
            </ul>
          </div>

          {p.highlights.length > 0 && (
            <div className="grid gap-2 text-sm sm:grid-cols-[120px_1fr]">
              <h2 className="text-gray-500">Highlights</h2>
              <ul className="list-disc space-y-1 pl-4">
                {p.highlights.map((h) => <li key={h}>{h}</li>)}
              </ul>
            </div>
          )}

          <div className="rounded-sm border">
            <h2 className="border-b px-4 py-3 text-xl font-semibold">Product Description</h2>
            <p className="px-4 py-3 text-sm leading-6 text-gray-700">{p.description}</p>
          </div>

          {Object.keys(p.specs).length > 0 && (
            <div className="rounded-sm border">
              <h2 className="border-b px-4 py-3 text-xl font-semibold">Specifications</h2>
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(p.specs).map(([k, v]) => (
                    <tr key={k} className="border-b last:border-0">
                      <th scope="row" className="w-1/3 px-4 py-2.5 text-left font-normal text-gray-500">{k}</th>
                      <td className="px-4 py-2.5">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Suspense fallback={<div className="card h-48 animate-pulse" />}>
        <Reviews productId={p.id} slug={p.slug} rating={p.rating} ratingCount={p.ratingCount} />
      </Suspense>
      <Suspense fallback={<ProductRailSkeleton />}>
        <Related id={p.id} categoryId={p.categoryId} />
      </Suspense>
    </div>
  );
}
