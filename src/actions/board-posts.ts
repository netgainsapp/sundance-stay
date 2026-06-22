"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { boardPostSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { sendLeadNotification } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit-durable";
import { clientIp } from "@/lib/request";
import { currentBoardUserId } from "@/lib/board-auth";

export type PostState = { ok: boolean; message?: string; errors?: Record<string, string> };

export async function submitBoardPost(
  _prev: PostState,
  formData: FormData,
): Promise<PostState> {
  const userId = await currentBoardUserId();
  if (!userId) {
    return { ok: false, message: "Please sign in to post." };
  }

  const parsed = boardPostSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    if (parsed.error.issues.some((i) => i.path[0] === "website")) {
      return { ok: true, message: "Thanks. Your post is in review." };
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
  if (!(await rateLimit("board_post", ip, 8, 3600)).ok) {
    return { ok: false, message: "Too many posts. Please try again later." };
  }

  const d = parsed.data;
  try {
    await prisma.boardPost.create({
      data: {
        authorId: userId,
        type: d.type,
        area: d.area,
        dates: d.dates,
        partySize: d.partySize || null,
        budget: d.budget || null,
        notes: d.notes,
      },
    });

    await sendLeadNotification(`New board post in review (${d.type})`, [
      `Type: ${d.type}`,
      `Area: ${d.area}`,
      `Dates: ${d.dates}`,
      `Party or sleeps: ${d.partySize || "n/a"}`,
      `Budget or rate: ${d.budget || "n/a"}`,
      "",
      d.notes,
    ]);
  } catch (err) {
    console.error("submitBoardPost failed", err);
    return { ok: false, message: "Something went wrong on our end. Please try again." };
  }

  revalidatePath("/board");
  return { ok: true, message: "Thanks. Your post is in review and goes live once approved." };
}
