import Redis from "ioredis";

const globalForRedis = globalThis as unknown as { redis?: Redis | null };

/** Lazily-created Redis client. Returns null when REDIS_URL isn't configured. */
export function getRedis(): Redis | null {
  if (globalForRedis.redis !== undefined) return globalForRedis.redis;
  const url = process.env.REDIS_URL;
  if (!url) return (globalForRedis.redis = null);
  const client = new Redis(url, {
    lazyConnect: false,
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    connectTimeout: 2_000,
    retryStrategy: (times) => Math.min(times * 500, 10_000),
  });
  client.on("error", (err) => {
    if (process.env.NODE_ENV !== "test") console.warn("[redis]", err.message);
  });
  globalForRedis.redis = client;
  return client;
}

function ready(r: Redis | null): r is Redis {
  return !!r && r.status === "ready";
}

const PREFIX = "sk:";

/**
 * Cache-aside helper. Reads JSON from Redis, otherwise runs `loader` and stores the result.
 * Redis failures never break the request – we just fall through to the loader.
 */
export async function cached<T>(key: string, ttlSeconds: number, loader: () => Promise<T>): Promise<T> {
  const redis = getRedis();
  const fullKey = PREFIX + key;
  if (ready(redis)) {
    try {
      const hit = await redis.get(fullKey);
      if (hit !== null) return JSON.parse(hit) as T;
    } catch {
      /* fall through */
    }
  }
  const value = await loader();
  if (ready(redis) && value !== undefined) {
    redis.set(fullKey, JSON.stringify(value), "EX", ttlSeconds).catch(() => {});
  }
  return value;
}

/** Delete every cache key starting with one of the given prefixes (uses SCAN, never KEYS). */
export async function invalidate(...prefixes: string[]): Promise<void> {
  const redis = getRedis();
  if (!ready(redis)) return;
  await Promise.all(
    prefixes.map(
      (prefix) =>
        new Promise<void>((resolve) => {
          const stream = redis.scanStream({ match: `${PREFIX}${prefix}*`, count: 200 });
          stream.on("data", (keys: string[]) => {
            if (keys.length) redis.unlink(...keys).catch(() => {});
          });
          stream.on("end", () => resolve());
          stream.on("error", () => resolve());
        }),
    ),
  );
}

export async function flushAppCache(): Promise<void> {
  await invalidate("");
}

/** Fixed-window rate limiter. Fails open if Redis is down. */
export async function rateLimit(key: string, limit: number, windowSeconds: number) {
  const redis = getRedis();
  if (!ready(redis)) return { ok: true, remaining: limit };
  try {
    const fullKey = `${PREFIX}rl:${key}`;
    const [[, count]] = (await redis.multi().incr(fullKey).expire(fullKey, windowSeconds, "NX").exec()) as [
      [Error | null, number],
    ];
    return { ok: count <= limit, remaining: Math.max(0, limit - count) };
  } catch {
    return { ok: true, remaining: limit };
  }
}

export async function redisHealth(): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;
  try {
    return (await redis.ping()) === "PONG";
  } catch {
    return false;
  }
}
