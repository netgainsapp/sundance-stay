import { describe, it, expect, vi, beforeEach } from "vitest";

const create = vi.fn();
vi.mock("@/lib/prisma", () => ({ prisma: { lead: { create: (...a: unknown[]) => create(...a) } } }));
const sendLeadNotification = vi.fn();
vi.mock("@/lib/email", () => ({ sendLeadNotification: (...a: unknown[]) => sendLeadNotification(...a) }));
vi.mock("@/lib/rate-limit", () => ({ checkRateLimit: () => ({ ok: true }) }));
vi.mock("next/headers", () => ({ headers: async () => new Map([["x-forwarded-for", "1.2.3.4"]]) }));

import { submitLead } from "@/actions/submit-lead";

function form(data: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(data)) fd.set(k, v);
  return fd;
}

describe("submitLead", () => {
  beforeEach(() => { create.mockReset(); sendLeadNotification.mockReset(); });
  it("persists a valid lead and sends a notification", async () => {
    const r = await submitLead({ ok: false }, form({ sourceType: "general_contact", visitorName: "Jane Guest", visitorEmail: "jane@example.com", message: "I would love more information please.", website: "" }));
    expect(r.ok).toBe(true);
    expect(create).toHaveBeenCalledOnce();
    expect(sendLeadNotification).toHaveBeenCalledOnce();
  });
  it("returns field errors and does not persist on invalid input", async () => {
    const r = await submitLead({ ok: false }, form({ sourceType: "general_contact", visitorName: "x", visitorEmail: "bad", message: "short", website: "" }));
    expect(r.ok).toBe(false);
    expect(create).not.toHaveBeenCalled();
  });
});
