import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListing } from "@/components/shop/listing";
import { JsonLd } from "@/components/json-ld";
import { getCategoryBySlug } from "@/lib/catalog";
import { parseListingParams, type RawParams } from "@/lib/listing-params";
import { siteUrl } from "@/lib/format";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<RawParams> };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };
  const sp = await searchParams;
  const filtered = Object.keys(sp).some((k) => k !== "page");
  const title = `${category.name} – Buy ${category.name} Online at Best Prices`;
  const description = `${category.description ?? ""} Shop ${category.name} online with great offers, fast delivery and easy returns.`.trim();
  return {
    title,
    description,
    alternates: { canonical: `/c/${slug}` },
    openGraph: { title, description, url: `/c/${slug}`, images: category.image ? [category.image] : undefined },
    // Filtered/sorted variants are near-duplicates; keep only the canonical listing in the index.
    robots: filtered ? { index: false, follow: true } : undefined,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();
  const sp = await searchParams;
  const query = { ...parseListingParams(sp), category: slug };
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteUrl() },
            { "@type": "ListItem", position: 2, name: category.name, item: `${siteUrl()}/c/${slug}` },
          ],
        }}
      />
      <ProductListing base={`/c/${slug}`} params={sp} query={query} title={category.name} lockCategory />
    </>
  );
}
