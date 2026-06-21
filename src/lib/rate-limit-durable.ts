import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";
import { inMemoryRateLimit, type RateResult } from "./rate-limit";

// Cache one Ratelimit instance per (name, limit, window) so the sliding window
// state is consistent across calls.
const limiters = new Map<string, Ratelimit>();

function getLimiter(
  name: string,
  limit: number,
  windowSec: number,
): Ratelimit | null {
  if (!redis) return null;
  const cacheKey = `${name}:${limit}:${windowSec}`;
  let rl = limiters.get(cacheKey);
  if (!rl) {
    rl = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowSec} s`),
      prefix: `rl:${name}`,
      analytics: false,
    });
    limiters.set(cacheKey, rl);
  }
  return rl;
}

/**
 * Durable, distributed rate limit. Uses Redis / Vercel KV when configured,
 * otherwise falls back to the per-process in-memory limiter. If Redis is
 * configured but unreachable, it fails over to in-memory rather than taking
 * the app down (availability over strictness for this surface).
 */
export async function rateLimit(
  name: string,
  key: string,
  limit: number,
  windowSec: number,
): Promise<RateResult> {
  const rl = getLimiter(name, limit, windowSec);
  if (rl) {
    try {
      const res = await rl.limit(`${name}:${key}`);
      return {
        ok: res.success,
        retryAfterSec: res.success
          ? undefined
          : Math.max(1, Math.ceil((res.reset - Date.now()) / 1000)),
      };
    } catch {
      return inMemoryRateLimit(`${name}:${key}`, limit, windowSec * 1000);
    }
  }
  return inMemoryRateLimit(`${name}:${key}`, limit, windowSec * 1000);
}
