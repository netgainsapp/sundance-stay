import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, __resetRateLimit } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => __resetRateLimit());
  it("allows up to the limit then blocks", () => {
    const ip = "1.2.3.4";
    for (let i = 0; i < 5; i++) expect(checkRateLimit(ip).ok).toBe(true);
    expect(checkRateLimit(ip).ok).toBe(false);
  });
  it("tracks different IPs independently", () => {
    expect(checkRateLimit("a").ok).toBe(true);
    expect(checkRateLimit("b").ok).toBe(true);
  });
});
