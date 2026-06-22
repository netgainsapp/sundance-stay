"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { isFlagOn, setFlag, NEWSLETTER_SEND_FLAG } from "@/lib/feature-flag";
import { buildIssue } from "@/lib/newsletter/build";
import { sendIssue } from "@/lib/newsletter/send";

/** Assembles a draft issue from current content and advertiser assets. */
export async function buildDraftIssue(): Promise<void> {
  await requireAdmin();
  const { content, html, text, gate } = await buildIssue();
  await prisma.newsletterIssue.create({
    data: {
      subject: content.subject,
      previewText: content.previewText,
      bodyHtml: html,
      bodyText: text,
      blocks: content as unknown as object,
      status: "draft",
      guardrailReasons: gate.ok ? undefined : gate.reasons,
    },
  });
  revalidatePath("/admin/newsletter");
}

/** Sends a draft issue. Gated by the send flag (default OFF) so it ships dormant. */
export async function sendNewsletterIssue(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  if (!(await isFlagOn(NEWSLETTER_SEND_FLAG))) return; // dormant until enabled
  await sendIssue(id);
  revalidatePath("/admin/newsletter");
}

export async function toggleNewsletterSend(formData: FormData): Promise<void> {
  await requireAdmin();
  await setFlag(NEWSLETTER_SEND_FLAG, formData.get("enabled") === "true");
  revalidatePath("/admin/newsletter");
}
