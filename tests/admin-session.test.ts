import { describe, it, expect, beforeAll } from "vitest";
import {
  createSessionToken,
  verifySessionToken,
} from "@/lib/admin-session";

beforeAll(() => {
  process.env.ADMIN_SESSION_SECRET = "test-secret-value-for-admin-session";
});

describe("admin session token", () => {
  it("verifies a freshly created token", async () => {
    const token = await createSessionToken();
    expect(await verifySessionToken(token)).toBe(true);
  });

  it("rejects an undefined or empty token", async () => {
    expect(await verifySessionToken(undefined)).toBe(false);
    expect(await verifySessionToken("")).toBe(false);
    expect(await verifySessionToken("notoken")).toBe(false);
  });

  it("rejects a tampered signature", async () => {
    const token = await createSessionToken();
    const [payload] = token.split(".");
    const forged = `${payload}.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`;
    expect(await verifySessionToken(forged)).toBe(false);
  });

  it("rejects an expired token", async () => {
    // Created 8 days ago; max age is 7 days.
    const eightDaysAgo = Date.now() - 8 * 24 * 60 * 60 * 1000;
    const token = await createSessionToken(eightDaysAgo);
    expect(await verifySessionToken(token)).toBe(false);
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await createSessionToken();
    process.env.ADMIN_SESSION_SECRET = "a-completely-different-secret";
    expect(await verifySessionToken(token)).toBe(false);
    process.env.ADMIN_SESSION_SECRET = "test-secret-value-for-admin-session";
  });
});
