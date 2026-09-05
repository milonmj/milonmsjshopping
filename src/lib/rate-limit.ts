// Stage 6 — requirement: rate limiting on sensitive endpoints (login, register, password
// change). This is a simple in-memory, fixed-window limiter — deliberately dependency-free
// (no Redis/Upstash) per "avoid unnecessary dependencies."
//
// IMPORTANT PRODUCTION NOTE: an in-memory Map only rate-limits within a single Node.js process.
// On a single long-running server (e.g. one Vercel "Node" runtime instance, a Docker container,
// a traditional VPS) this works correctly. On a multi-instance or serverless-per-request
// deployment (e.g. Vercel Edge functions, multiple replicas behind a load balancer), each
// instance has its own memory, so the *effective* limit is (your configured limit) × (number of
// instances) — still better than nothing, but not a hard guarantee. If you deploy behind
// multiple instances and need a hard guarantee, swap the Map below for a shared store (e.g.
// Upstash Redis's `@upstash/ratelimit`) — the `checkRateLimit` call sites don't need to change.
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}, CLEANUP_INTERVAL_MS);
cleanupTimer.unref?.();

export type RateLimitResult = { allowed: boolean; remaining: number; resetAt: number };

export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now > existing.resetAt) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}

export function getClientIp(headers: Headers | Record<string, string | string[] | undefined>): string {
  const get = (name: string): string | undefined => {
    if (headers instanceof Headers) return headers.get(name) ?? undefined;
    const v = headers[name];
    return Array.isArray(v) ? v[0] : v;
  };
  const forwarded = get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return get("x-real-ip") ?? "unknown";
}
