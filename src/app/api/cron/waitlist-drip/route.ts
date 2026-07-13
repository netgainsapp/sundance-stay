import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// RETIRED 2026-07-13: the Boulder Film Collective newsletter list moved to the
// Dispatch engine (dispatch.netgains.app), which now owns double opt-in and all
// subscriber facing email. This local drip is a no-op to prevent double-emails.
// runDrip() and the drip stages remain in src/lib/waitlist-drip.ts as dead code
// pending removal, but are no longer invoked.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }
  return NextResponse.json({ status: "retired", note: "BFC newsletter moved to Dispatch" });
}
