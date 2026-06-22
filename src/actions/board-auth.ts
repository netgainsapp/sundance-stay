"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { magicLinkSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { sendBoardMagicLink } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit-durable";
import { clientIp } from "@/lib/request";
import { generateRawToken, hashToken, MAGIC_LINK_TTL_MS } from "@/lib/board-token";
import { BOARD_COOKIE_NAME } from "@/lib/board-session";

export type AuthState = { ok: boolean; message?: string; errors?: Record<string, string> };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3020";

export async function requestMagicLink(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = magicLinkSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    if (parsed.error.issues.some((i) => i.path[0] === "website")) {
      // Honeypot tripped. Look successful without doing anything.
      return { ok: true, message: "Check your email for a sign in link." };
    }
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (key !== "website") errors[key] = issue.message;
    }
    return { ok: false, errors, message: "Please fix the highlighted fields." };
  }

  const hdrs = await headers();
  const ip = clientIp(hdrs);
  const email = parsed.data.email.trim().toLowerCase();

  // Throttle per IP and per email so the link sender cannot be abused.
  if (!(await rateLimit("magiclink_ip", ip, 5, 900)).ok) {
    return { ok: false, message: "Too many attempts. Please try again shortly." };
  }
  if (!(await rateLimit("magiclink_email", email, 5, 900)).ok) {
    return { ok: true, message: "Check your email for a sign in link." };
  }

  try {
    const name = (parsed.data.name || "").trim() || null;
    const user = await prisma.boardUser.upsert({
      where: { email },
      update: name ? { name } : {},
      create: { email, name },
    });

    const raw = generateRawToken();
    const tokenHash = await hashToken(raw);
    await prisma.magicLinkToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + MAGIC_LINK_TTL_MS),
      },
    });

    await sendBoardMagicLink(
      email,
      `${SITE_URL}/board/verify?token=${encodeURIComponent(raw)}`,
    );
  } catch (err) {
    console.error("requestMagicLink failed", err);
    return { ok: false, message: "Something went wrong on our end. Please try again." };
  }

  return { ok: true, message: "Check your email for a sign in link." };
}

export async function logoutBoard(): Promise<void> {
  const store = await cookies();
  store.delete(BOARD_COOKIE_NAME);
  redirect("/board");
}
