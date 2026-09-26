import type { Metadata } from "next";
import { ProductListing } from "@/components/shop/listing";
import { parseListingParams, type RawParams } from "@/lib/listing-params";

type Props = { searchParams: Promise<RawParams> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = parseListingParams(await searchParams);
  return {
    title: q ? `${q} – Buy ${q} online at best prices` : "All Products",
    // Internal search result pages shouldn't be indexed, but their links should be followed.
    robots: { index: false, follow: true },
    alternates: { canonical: "/search" },
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = parseListingParams(params);
  return (
    <ProductListing
      base="/search"
      params={params}
      query={query}
      title={query.q ? `Showing results for "${query.q}"` : "All Products"}
    />
  );
}
