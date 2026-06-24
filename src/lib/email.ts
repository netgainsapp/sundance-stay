import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const TO = process.env.LEADS_EMAIL;
const FROM =
  process.env.RESEND_FROM_ADDRESS ??
  "Boulder Film Collective <noreply@netgains.app>";

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
    subject: "Your Boulder Film Collective sign in link",
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

/** Sends one newsletter email. No-ops without a Resend key. Returns true on send. */
export async function sendNewsletterEmail(
  to: string,
  subject: string,
  html: string,
  text: string,
): Promise<boolean> {
  if (!resend) {
    console.warn(`RESEND_API_KEY not set; newsletter to ${to} not sent`);
    return false;
  }
  await resend.emails.send({ from: FROM, to, subject, html, text });
  return true;
}

/** Alerts a board user that they have a new message, with a link to the thread. */
export async function sendBoardMessageAlert(to: string, url: string) {
  if (!resend) {
    console.warn(`RESEND_API_KEY not set; message alert for ${to}: ${url}`);
    return;
  }
  await resend.emails.send({
    from: FROM,
    to,
    subject: "You have a new message on the Last-Minute Board",
    text: [
      "Someone replied to you on the Last-Minute Board.",
      "",
      "Open the conversation here:",
      url,
      "",
      "For your safety, keep the conversation on the platform until you are ready.",
    ].join("\n"),
  });
}

/** Sends a confirmation email to admin for all waitlist signups (testing). */
export async function sendWaitlistNotification({
  email,
  companyName,
  category,
  details,
  type,
}: {
  email: string;
  companyName: string;
  category: string;
  details: string;
  type: "partner" | "guest";
}) {
  if (!resend || !TO) {
    console.warn(
      `RESEND_API_KEY or LEADS_EMAIL not set; skipping waitlist notification for ${email}`
    );
    return;
  }

  const subject = type === "partner"
    ? `New Partner Interest: ${companyName}`
    : `New Waitlist Signup: ${email}`;

  const body = type === "partner"
    ? [
        `A partner has joined the Boulder Film Collective waitlist.`,
        "",
        `Email: ${email}`,
        `Company: ${companyName}`,
        `Category: ${category}`,
        `Details: ${details}`,
      ].join("\n")
    : [
        `A new visitor has joined the Boulder Film Collective waitlist.`,
        "",
        `Email: ${email}`,
        `Type: Guest`,
      ].join("\n");

  await resend.emails.send({
    from: FROM,
    to: TO,
    subject,
    text: body,
  });
}
