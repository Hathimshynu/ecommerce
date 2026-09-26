import { NextResponse, type NextRequest } from "next/server";
import { searchProducts } from "@/lib/search";
import { parseListingParams, type RawParams } from "@/lib/listing-params";

/** Public JSON search API: /api/products?q=phone&brand=Samsung&min=1000&sort=price_asc&page=2 */
export async function GET(req: NextRequest) {
  const raw: RawParams = {};
  for (const key of new Set(req.nextUrl.searchParams.keys())) {
    const all = req.nextUrl.searchParams.getAll(key);
    raw[key] = all.length > 1 ? all : all[0];
  }
  const result = await searchProducts(parseListingParams(raw));
  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, max-age=30, s-maxage=120, stale-while-revalidate=300" },
  });
}
