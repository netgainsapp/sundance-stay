import type { NewsletterContent, NewsletterGuardrailResult } from "./types";
import { UNSUBSCRIBE_PLACEHOLDER } from "./render";

/** Gates a newsletter before send. Pure and testable. */
export function checkNewsletter(
  c: NewsletterContent,
  html: string,
): NewsletterGuardrailResult {
  const reasons: string[] = [];
  const copy = `${c.subject} ${c.previewText} ${c.intro}`;

  if (!c.subject.trim()) reasons.push("missing subject");
  if (c.subject.length > 120) reasons.push("subject too long");
  if (/[–—]/.test(copy)) reasons.push("contains an em or en dash");
  if (/ - /.test(copy)) reasons.push("contains a hyphen used as a dash");
  if (c.posts.length + c.advertisers.length + c.stays.length === 0) {
    reasons.push("no content blocks");
  }
  if (!html.includes(UNSUBSCRIBE_PLACEHOLDER)) {
    reasons.push("missing unsubscribe link");
  }

  return { ok: reasons.length === 0, reasons };
}
