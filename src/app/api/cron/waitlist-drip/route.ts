import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { runDrip } from "@/lib/waitlist-drip";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  // When a secret is configured, require it (Vercel cron sends it as a Bearer).
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  try {
    const result = await runDrip();
    return NextResponse.json({ status: "ok", ...result });
  } catch (err) {
    console.error("waitlist-drip cron failed", err);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
