import { Redis } from "@upstash/redis";

/**
 * Shared Redis client. Returns null when no durable store is configured, in
 * which case rate limiting and the login lockout fall back to a per-process
 * in-memory store. Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (or
 * the Vercel KV equivalents KV_REST_API_URL + KV_REST_API_TOKEN) to make the
 * limits durable and shared across all serverless instances.
 */
function build(): Redis | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  try {
    return new Redis({ url, token });
  } catch {
    return null;
  }
}

export const redis: Redis | null = build();

export function isDurableStoreConfigured(): boolean {
  return redis !== null;
}
