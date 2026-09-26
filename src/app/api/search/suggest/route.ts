import { NextResponse, type NextRequest } from "next/server";
import { suggestProducts } from "@/lib/search";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").slice(0, 60);
  try {
    const suggestions = await suggestProducts(q);
    return NextResponse.json(
      { suggestions },
      { headers: { "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600" } },
    );
  } catch {
    return NextResponse.json({ suggestions: [] }, { status: 200 });
  }
}
