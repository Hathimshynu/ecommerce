import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { bulkIndex, deleteDoc, ensureProductIndex, esAvailable, indexDoc, toDoc } from "./elasticsearch";

async function loadForIndex(ids?: number[]) {
  const rows = await db
    .select({ product: products, category: { slug: categories.slug, name: categories.name } })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(ids ? inArray(products.id, ids) : undefined);
  return rows.map((r) => toDoc({ ...r.product, category: r.category }));
}

/** Push a single product's latest state to Elasticsearch (no-op when ES is down). */
export async function syncProductToSearch(id: number) {
  if (!esAvailable()) return;
  const [doc] = await loadForIndex([id]);
  if (doc) await indexDoc(doc);
  else await deleteDoc(id);
}

export async function syncCategoryProducts(categoryId: number) {
  if (!esAvailable()) return;
  const ids = (await db.select({ id: products.id }).from(products).where(eq(products.categoryId, categoryId))).map((r) => r.id);
  if (ids.length) await bulkIndex(await loadForIndex(ids));
}

export async function removeProductFromSearch(id: number) {
  await deleteDoc(id);
}

/** Rebuild the whole product index from PostgreSQL. */
export async function reindexAllProducts() {
  await ensureProductIndex(true);
  const docs = await loadForIndex();
  for (let i = 0; i < docs.length; i += 500) await bulkIndex(docs.slice(i, i + 500));
  return docs.length;
}
