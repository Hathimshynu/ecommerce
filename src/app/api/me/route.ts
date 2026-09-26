import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { wishlist } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  const noStore = { headers: { "Cache-Control": "private, no-store" } };
  if (!user) return NextResponse.json({ user: null, wishlist: [] }, noStore);
  const rows = await db.select({ id: wishlist.productId }).from(wishlist).where(eq(wishlist.userId, user.id));
  return NextResponse.json({ user: { name: user.name, email: user.email }, wishlist: rows.map((r) => r.id) }, noStore);
}
