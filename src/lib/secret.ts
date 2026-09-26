// Edge-safe (used by middleware): no Node-only imports here.

const KNOWN_DEFAULTS = new Set([
  "change-me-to-a-long-random-secret-string-of-32-chars-min",
  "please-change-this-secret-in-production-0123456789",
]);

/** Returns the JWT signing key, or throws if it is missing, too short, or a published default in production. */
export function jwtSecretKey(env: { JWT_SECRET?: string; NODE_ENV?: string } = process.env): Uint8Array {
  const s = env.JWT_SECRET ?? "";
  if (s.length < 32) throw new Error("JWT_SECRET must be set to at least 32 characters");
  if (env.NODE_ENV === "production" && KNOWN_DEFAULTS.has(s) && process.env.ALLOW_INSECURE_JWT_SECRET !== "1") {
    throw new Error("JWT_SECRET is still the example value. Generate one with: openssl rand -base64 48");
  }
  return new TextEncoder().encode(s);
}
