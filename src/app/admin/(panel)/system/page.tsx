import { PageHeader, Panel, Badge } from "@/components/admin/ui";
import { ActionForm } from "@/components/admin/action-form";
import { flushCacheAction, reindexAction } from "@/app/admin/actions";
import { esHealth, PRODUCT_INDEX, getEs } from "@/lib/elasticsearch";
import { getRedis, redisHealth } from "@/lib/redis";

export const metadata = { title: "Search & Cache" };
export const dynamic = "force-dynamic";

async function esDocCount() {
  try {
    return (await getEs()!.count({ index: PRODUCT_INDEX })).count;
  } catch {
    return null;
  }
}

async function redisKeys() {
  try {
    const r = getRedis();
    return r ? await r.dbsize() : null;
  } catch {
    return null;
  }
}

export default async function SystemPage() {
  const [esUp, redisUp] = await Promise.all([esHealth(), redisHealth()]);
  const [docs, keys] = await Promise.all([esUp ? esDocCount() : null, redisUp ? redisKeys() : null]);
  return (
    <>
      <PageHeader title="Search & Cache" />
      <div className="grid gap-4 md:grid-cols-2">
        <Panel className="space-y-3 p-5">
          <h2 className="flex items-center justify-between font-semibold">
            Elasticsearch <Badge tone={esUp ? "green" : "amber"}>{esUp ? "online" : "offline"}</Badge>
          </h2>
          <p className="text-sm text-slate-600">
            Index <code className="rounded bg-slate-100 px-1">{PRODUCT_INDEX}</code>
            {docs != null && <> · {docs} documents</>}. Products are synced automatically on every create/update/delete; use a full reindex after
            bulk imports or mapping changes. When Elasticsearch is offline, search transparently falls back to PostgreSQL.
          </p>
          <ActionForm action={reindexAction} submitLabel="Rebuild search index" />
        </Panel>
        <Panel className="space-y-3 p-5">
          <h2 className="flex items-center justify-between font-semibold">
            Redis cache <Badge tone={redisUp ? "green" : "red"}>{redisUp ? "online" : "offline"}</Badge>
          </h2>
          <p className="text-sm text-slate-600">
            Catalog queries, product pages, search results and autocomplete suggestions are cached in Redis
            {keys != null && <> ({keys} keys)</>}. Relevant keys are invalidated automatically whenever data changes.
          </p>
          <ActionForm action={flushCacheAction} submitLabel="Flush cache" submitClassName="btn-outline" />
        </Panel>
      </div>
    </>
  );
}
