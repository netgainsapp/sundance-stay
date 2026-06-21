/**
 * Derive a best effort client IP for rate limiting.
 *
 * x-forwarded-for is client controlled, so we prefer x-real-ip (set by the
 * Vercel edge from the actual connection). When falling back to
 * x-forwarded-for we take the RIGHTMOST entry, which is the one appended by
 * our own trusted proxy, not the leftmost spoofable client value.
 */
export function clientIp(hdrs: { get(name: string): string | null }): string {
  const realIp = hdrs.get("x-real-ip");
  if (realIp) return realIp.trim();

  const forwarded = hdrs.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1];
  }

  return "unknown";
}
