import { redis } from "./redis";

/**
 * Admin login lockout. After too many failed attempts from one client IP,
 * that IP is hard-blocked for a cooldown (every attempt rejected, even a
 * correct password), which stops brute force without letting an attacker lock
 * out the operator on a different network.
 *
 * Durable via Redis / Vercel KV when configured, otherwise per-process.
 */
const FAIL_LIMIT = 8; // failures within the window before a lockout
const FAIL_WINDOW_SEC = 15 * 60; // window to accumulate failures
const LOCK_SEC = 15 * 60; // lockout duration once tripped

const failKey = (ip: string) => `login:fail:${ip}`;
const lockKey = (ip: string) => `login:lock:${ip}`;

// In-memory fallback state.
const memFails = new Map<string, { count: number; resetAt: number }>();
const memLocks = new Map<string, number>(); // ip -> unix ms when lock lifts

export type LockState = { locked: boolean; retryAfterSec?: number };

export async function isLoginLocked(ip: string): Promise<LockState> {
  if (redis) {
    const ttl = await redis.ttl(lockKey(ip));
    return ttl && ttl > 0 ? { locked: true, retryAfterSec: ttl } : { locked: false };
  }
  const until = memLocks.get(ip);
  const now = Date.now();
  if (until && until > now) {
    return { locked: true, retryAfterSec: Math.ceil((until - now) / 1000) };
  }
  if (until) memLocks.delete(ip);
  return { locked: false };
}

export async function recordLoginFailure(ip: string): Promise<void> {
  if (redis) {
    const count = await redis.incr(failKey(ip));
    if (count === 1) await redis.expire(failKey(ip), FAIL_WINDOW_SEC);
    if (count >= FAIL_LIMIT) {
      await redis.set(lockKey(ip), "1", { ex: LOCK_SEC });
      await redis.del(failKey(ip));
    }
    return;
  }
  const now = Date.now();
  const entry = memFails.get(ip);
  if (!entry || entry.resetAt < now) {
    memFails.set(ip, { count: 1, resetAt: now + FAIL_WINDOW_SEC * 1000 });
    return;
  }
  entry.count += 1;
  if (entry.count >= FAIL_LIMIT) {
    memLocks.set(ip, now + LOCK_SEC * 1000);
    memFails.delete(ip);
  }
}

export async function clearLoginFailures(ip: string): Promise<void> {
  if (redis) {
    await redis.del(failKey(ip));
    await redis.del(lockKey(ip));
    return;
  }
  memFails.delete(ip);
  memLocks.delete(ip);
}

// Test helper.
export function __resetLoginGuard() {
  memFails.clear();
  memLocks.clear();
}
