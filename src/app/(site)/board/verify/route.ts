import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/board-token";
import {
  createBoardToken,
  BOARD_COOKIE_NAME,
  BOARD_MAX_AGE_SECONDS,
} from "@/lib/board-session";

export const dynamic = "force-dynamic";

function fail(req: NextRequest, reason: string) {
  const url = req.nextUrl.clone();
  url.pathname = "/board/signin";
  url.search = `?error=${reason}`;
  return NextResponse.redirect(url);
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("token");
  if (!raw) return fail(req, "missing");

  let userId: string | null = null;
  try {
    const tokenHash = await hashToken(raw);
    const record = await prisma.magicLinkToken.findUnique({ where: { tokenHash } });
    if (!record || record.usedAt || record.expiresAt.getTime() < Date.now()) {
      return fail(req, "invalid");
    }
    // Single use: mark consumed before issuing the session.
    await prisma.magicLinkToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    });
    userId = record.userId;
  } catch (err) {
    console.error("magic link verify failed", err);
    return fail(req, "error");
  }

  const token = await createBoardToken(userId);
  const dest = req.nextUrl.clone();
  dest.pathname = "/board";
  dest.search = "";
  const res = NextResponse.redirect(dest);
  res.cookies.set(BOARD_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: BOARD_MAX_AGE_SECONDS,
  });
  return res;
}
