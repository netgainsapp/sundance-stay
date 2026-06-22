import { prisma } from "@/lib/prisma";
import { SITE } from "@/lib/site";
import { sendNewsletterEmail } from "@/lib/email";
import { UNSUBSCRIBE_PLACEHOLDER } from "./render";

export interface SendResult {
  sent: number;
  total: number;
}

/**
 * Sends a stored newsletter issue to every active subscriber, with a per
 * recipient unsubscribe link swapped into the body. No-ops cleanly without a
 * Resend key. The caller gates this behind the send flag.
 */
export async function sendIssue(issueId: string): Promise<SendResult> {
  const issue = await prisma.newsletterIssue.findUnique({ where: { id: issueId } });
  if (!issue) return { sent: 0, total: 0 };

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { status: "active" },
    select: { email: true, unsubscribeToken: true },
  });

  let sent = 0;
  for (const sub of subscribers) {
    const url = `${SITE.url}/newsletter/unsubscribe?token=${encodeURIComponent(sub.unsubscribeToken)}`;
    const html = issue.bodyHtml.split(UNSUBSCRIBE_PLACEHOLDER).join(url);
    const text = issue.bodyText.split(UNSUBSCRIBE_PLACEHOLDER).join(url);
    try {
      const ok = await sendNewsletterEmail(sub.email, issue.subject, html, text);
      if (ok) sent++;
    } catch (err) {
      console.error(`newsletter send to ${sub.email} failed`, err);
    }
  }

  await prisma.newsletterIssue.update({
    where: { id: issueId },
    data: { status: "sent", sentAt: new Date(), recipientCount: sent },
  });

  return { sent, total: subscribers.length };
}
