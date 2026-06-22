"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { boardMessageSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { sendBoardMessageAlert } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit-durable";
import { clientIp } from "@/lib/request";
import { currentBoardUserId, isBoardUserSuspended } from "@/lib/board-auth";

export type MsgState = { ok: boolean; message?: string; error?: string };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3020";

function parseBody(formData: FormData): { body?: string; spam?: boolean; error?: string } {
  const parsed = boardMessageSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    if (parsed.error.issues.some((i) => i.path[0] === "website")) return { spam: true };
    return { error: parsed.error.issues[0]?.message ?? "Write a message" };
  }
  return { body: parsed.data.body };
}

/**
 * Opens a conversation about a post (or reuses the existing one) and sends the
 * first message. Phase 3 will require a paid unlock before this point.
 */
export async function startThread(
  postId: string,
  _prev: MsgState,
  formData: FormData,
): Promise<MsgState> {
  const userId = await currentBoardUserId();
  if (!userId) return { ok: false, error: "Please sign in to start a conversation." };
  if (await isBoardUserSuspended(userId)) {
    return { ok: false, error: "Your account is restricted." };
  }

  const { body, spam, error } = parseBody(formData);
  if (spam) return { ok: true, message: "Sent." };
  if (error || !body) return { ok: false, error: error ?? "Write a message" };

  const hdrs = await headers();
  if (!(await rateLimit("board_msg", clientIp(hdrs), 20, 3600)).ok) {
    return { ok: false, error: "Too many messages. Please try again later." };
  }

  let threadId: string | null = null;
  try {
    const post = await prisma.boardPost.findFirst({
      where: { id: postId, status: "active" },
      include: { author: true },
    });
    if (!post) return { ok: false, error: "This post is no longer available." };
    if (post.authorId === userId) {
      return { ok: false, error: "This is your own post." };
    }

    const thread = await prisma.thread.upsert({
      where: { postId_initiatorId: { postId, initiatorId: userId } },
      update: {},
      create: { postId, initiatorId: userId, recipientId: post.authorId },
    });
    threadId = thread.id;

    await prisma.message.create({
      data: { threadId: thread.id, senderId: userId, body },
    });

    await sendBoardMessageAlert(
      post.author.email,
      `${SITE_URL}/board/inbox/${thread.id}`,
    );
  } catch (err) {
    console.error("startThread failed", err);
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  redirect(`/board/inbox/${threadId}`);
}

export async function sendMessage(
  threadId: string,
  _prev: MsgState,
  formData: FormData,
): Promise<MsgState> {
  const userId = await currentBoardUserId();
  if (!userId) return { ok: false, error: "Please sign in." };
  if (await isBoardUserSuspended(userId)) {
    return { ok: false, error: "Your account is restricted." };
  }

  const { body, spam, error } = parseBody(formData);
  if (spam) return { ok: true };
  if (error || !body) return { ok: false, error: error ?? "Write a message" };

  const hdrs = await headers();
  if (!(await rateLimit("board_msg", clientIp(hdrs), 20, 3600)).ok) {
    return { ok: false, error: "Too many messages. Please try again later." };
  }

  try {
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      include: { initiator: true, recipient: true },
    });
    if (!thread || (thread.initiatorId !== userId && thread.recipientId !== userId)) {
      return { ok: false, error: "Conversation not found." };
    }

    await prisma.message.create({ data: { threadId, senderId: userId, body } });

    const other = thread.initiatorId === userId ? thread.recipient : thread.initiator;
    await sendBoardMessageAlert(other.email, `${SITE_URL}/board/inbox/${threadId}`);
  } catch (err) {
    console.error("sendMessage failed", err);
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  revalidatePath(`/board/inbox/${threadId}`);
  return { ok: true };
}
