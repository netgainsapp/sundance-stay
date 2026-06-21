const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

export function checkRateLimit(ip: string): { ok: boolean } {
  const now = Date.now();
  const entry = store.get(ip);
  if (!entry || entry.resetAt < now) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (entry.count >= MAX_PER_WINDOW) return { ok: false };
  entry.count += 1;
  return { ok: true };
}

export function __resetRateLimit() {
  store.clear();
}
