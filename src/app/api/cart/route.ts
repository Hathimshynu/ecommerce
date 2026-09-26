import { NextResponse, type NextRequest } from "next/server";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";

export const dynamic = "force-dynamic";

/** Current price/stock for cart items: GET /api/cart?ids=1,2,3 (inactive or deleted products are omitted). */
export async function GET(req: NextRequest) {
  const ids = (req.nextUrl.searchParams.get("ids") ?? "")
    .split(",")
    .map(Number)
    .filter((n) => Number.isInteger(n) && n > 0)
    .slice(0, 50);
  if (!ids.length) return NextResponse.json({ items: [] });
  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      price: products.price,
      mrp: products.mrp,
      stock: products.stock,
      images: products.images,
    })
    .from(products)
    .where(and(inArray(products.id, ids), eq(products.isActive, true)));
  return NextResponse.json(
    { items: rows.map(({ images, ...r }) => ({ ...r, image: images[0] ?? null })) },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
