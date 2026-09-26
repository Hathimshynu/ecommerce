import "dotenv/config";
import { pool } from "../src/db";
import { reindexAllProducts } from "../src/lib/indexing";
import { flushAppCache, getRedis } from "../src/lib/redis";

async function main() {
  const count = await reindexAllProducts();
  console.log(`✔ indexed ${count} products into Elasticsearch`);
  await new Promise((r) => setTimeout(r, 300));
  await flushAppCache();
  getRedis()?.disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error("✘ reindex failed:", e.message);
  process.exit(1);
});
