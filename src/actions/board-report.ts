"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit-durable";
import { clientIp } from "@/lib/request";
import { currentBoardUserId } from "@/lib/board-auth";
import { sendLeadNotification } from "@/lib/email";

export type ReportState = { ok: boolean; message?: string };

/**
 * Files a moderation report against a post or a conversation. Requires sign in
 * to reduce abuse, and is rate limited per IP.
 */
export async function reportContent(
  targetType: "post" | "thread",
  targetId: string,
  _prev: ReportState,
  formData: FormData,
): Promise<ReportState> {
  const userId = await currentBoardUserId();
  if (!userId) return { ok: false, message: "Please sign in to report." };

  const reason = String(formData.get("reason") || "").trim().slice(0, 280);
  if (reason.length < 2) return { ok: false, message: "Please choose a reason." };

  const hdrs = await headers();
  if (!(await rateLimit("board_report", clientIp(hdrs), 10, 3600)).ok) {
    return { ok: false, message: "Too many reports. Please try again later." };
  }

  try {
    await prisma.report.create({
      data: { targetType, targetId, reporterId: userId, reason },
    });
    await sendLeadNotification(`Board content reported (${targetType})`, [
      `Type: ${targetType}`,
      `Target id: ${targetId}`,
      `Reason: ${reason}`,
    ]);
  } catch (err) {
    console.error("reportContent failed", err);
    return { ok: false, message: "Something went wrong. Please try again." };
  }

  return { ok: true, message: "Thanks. Our team will review this." };
}
