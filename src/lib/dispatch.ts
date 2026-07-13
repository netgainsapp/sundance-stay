// Forwards BFC newsletter signups to the Dispatch engine, which now owns the
// Boulder Film Collective subscriber list, double opt-in, and all subscriber
// facing email. The local Waitlist row is still written for site gating and
// admin alerts, but the subscriber welcome/drip is retired (Dispatch sends it).

const DISPATCH_URL = process.env.DISPATCH_URL ?? "https://dispatch.netgains.app";

export async function forwardToDispatch(email: string): Promise<void> {
  const key = process.env.DISPATCH_CAPTURE_KEY;
  if (!key) {
    console.warn("DISPATCH_CAPTURE_KEY not set; skipping Dispatch forward");
    return;
  }
  const res = await fetch(`${DISPATCH_URL}/api/v1/subscribe`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ email, source: "embed", meta: { site: "boulderfilmcollective.com" } }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Dispatch subscribe failed ${res.status}: ${detail.slice(0, 200)}`);
  }
}
