import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { redisHealth } from "@/lib/redis";
import { esHealth } from "@/lib/elasticsearch";

export const dynamic = "force-dynamic";

export async function GET() {
  const [database, redis, elasticsearch] = await Promise.all([
    db.execute(sql`select 1`).then(() => true, () => false),
    redisHealth(),
    esHealth(),
  ]);
  return NextResponse.json(
    { status: database ? "ok" : "degraded", database, redis, elasticsearch },
    { status: database ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
