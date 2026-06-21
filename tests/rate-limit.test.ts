import { describe, it, expect, beforeEach } from "vitest";
import { inMemoryRateLimit, __resetRateLimit } from "@/lib/rate-limit";

const WINDOW = 10 * 60 * 1000;

describe("inMemoryRateLimit", () => {
  beforeEach(() => __resetRateLimit());

  it("allows up to the limit then blocks", () => {
    for (let i = 0; i < 5; i++) {
      expect(inMemoryRateLimit("1.2.3.4", 5, WINDOW).ok).toBe(true);
    }
    const blocked = inMemoryRateLimit("1.2.3.4", 5, WINDOW);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);
  });

  it("tracks different keys independently", () => {
    expect(inMemoryRateLimit("a", 2, WINDOW).ok).toBe(true);
    expect(inMemoryRateLimit("b", 2, WINDOW).ok).toBe(true);
  });

  it("honors the configured limit", () => {
    expect(inMemoryRateLimit("k", 1, WINDOW).ok).toBe(true);
    expect(inMemoryRateLimit("k", 1, WINDOW).ok).toBe(false);
  });
});
