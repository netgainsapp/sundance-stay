import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return new NextResponse("Missing token", { status: 400 });
  }

  const row = await prisma.waitlist.findUnique({
    where: { unsubscribeToken: token },
  });
  if (!row) {
    return new NextResponse("Not found", { status: 404 });
  }

  if (!row.unsubscribed) {
    await prisma.waitlist.update({
      where: { id: row.id },
      data: { unsubscribed: true },
    });
  }

  return new NextResponse(
    [
      "<!doctype html><html><head><title>Unsubscribed</title></head>",
      '<body style="font-family: sans-serif; max-width: 480px; margin: 80px auto; text-align: center;">',
      "<h1>You are unsubscribed.</h1>",
      "<p>You will not receive further emails from Boulder Film Collective.</p>",
      "</body></html>",
    ].join(""),
    { status: 200, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}
