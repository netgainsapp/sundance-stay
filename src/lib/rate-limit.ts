export type RateResult = { ok: boolean; retryAfterSec?: number };

type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

/**
 * Per-process fixed-window rate limiter. Used as the fallback when no durable
 * store (Redis / Vercel KV) is configured. Friction, not a hard guarantee:
 * counters reset on serverless cold start and are not shared across instances.
 */
export function inMemoryRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateResult {
  const now = Date.now();

  // Sweep expired entries so the map does not grow unbounded.
  for (const [k, v] of store) {
    if (v.resetAt < now) store.delete(k);
  }

  const entry = store.get(key);
  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (entry.count >= limit) {
    return { ok: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count += 1;
  return { ok: true };
}

export function __resetRateLimit() {
  store.clear();
}
