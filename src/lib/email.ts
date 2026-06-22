import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const TO = process.env.LEADS_EMAIL;
const FROM =
  process.env.RESEND_FROM_ADDRESS ??
  "Sundance Stay Collective <noreply@netgains.app>";

export async function sendLeadNotification(subject: string, lines: string[]) {
  if (!resend || !TO) {
    console.warn("RESEND_API_KEY or LEADS_EMAIL not set; skipping email send");
    return;
  }
  await resend.emails.send({ from: FROM, to: TO, subject, text: lines.join("\n") });
}

/** Sends a passwordless sign in link to a marketplace user's own email. */
export async function sendBoardMagicLink(to: string, url: string) {
  if (!resend) {
    // In dev with no key, log the link so sign in can still be tested.
    console.warn(`RESEND_API_KEY not set; magic link for ${to}: ${url}`);
    return;
  }
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Your Sundance Stay Collective sign in link",
    text: [
      "Use the link below to sign in to the Last-Minute Board.",
      "",
      url,
      "",
      "This link expires in 30 minutes and can be used once.",
      "If you did not request it, you can ignore this email.",
    ].join("\n"),
  });
}
