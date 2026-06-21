import { describe, it, expect, beforeEach } from "vitest";
import {
  isLoginLocked,
  recordLoginFailure,
  clearLoginFailures,
  __resetLoginGuard,
} from "@/lib/login-guard";

// With no Redis env configured, the guard uses its in-memory fallback.
describe("login lockout (in-memory fallback)", () => {
  beforeEach(() => __resetLoginGuard());

  it("does not lock before the failure threshold", async () => {
    const ip = "9.9.9.9";
    for (let i = 0; i < 7; i++) await recordLoginFailure(ip);
    expect((await isLoginLocked(ip)).locked).toBe(false);
  });

  it("locks the IP after 8 failures", async () => {
    const ip = "9.9.9.9";
    for (let i = 0; i < 8; i++) await recordLoginFailure(ip);
    const state = await isLoginLocked(ip);
    expect(state.locked).toBe(true);
    expect(state.retryAfterSec).toBeGreaterThan(0);
  });

  it("locks each IP independently", async () => {
    for (let i = 0; i < 8; i++) await recordLoginFailure("1.1.1.1");
    expect((await isLoginLocked("1.1.1.1")).locked).toBe(true);
    expect((await isLoginLocked("2.2.2.2")).locked).toBe(false);
  });

  it("clears failures on a successful login", async () => {
    const ip = "3.3.3.3";
    for (let i = 0; i < 5; i++) await recordLoginFailure(ip);
    await clearLoginFailures(ip);
    for (let i = 0; i < 7; i++) await recordLoginFailure(ip);
    // Counter was reset, so 7 more failures is still under the threshold.
    expect((await isLoginLocked(ip)).locked).toBe(false);
  });
});
