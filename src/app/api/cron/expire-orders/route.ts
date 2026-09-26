import { NextResponse, type NextRequest } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { expireUnpaidOrders } from "@/lib/order-service";

export const dynamic = "force-dynamic";

/**
 * Cancels unpaid online orders older than 30 minutes and releases their stock.
 * Call from a scheduler (Vercel Cron, Kubernetes CronJob, crontab) with `Authorization: Bearer $CRON_SECRET`.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET ?? "";
  const given = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const ok = secret.length >= 16 && given.length === secret.length && timingSafeEqual(Buffer.from(given), Buffer.from(secret));
  if (!ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const minutes = Math.max(5, Number(req.nextUrl.searchParams.get("minutes")) || 30);
  const expired = await expireUnpaidOrders(minutes);
  return NextResponse.json({ expired });
}

export const GET = POST;
