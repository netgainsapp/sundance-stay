import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const TO = process.env.LEADS_EMAIL ?? "sdwbouldah55@gmail.com";
const FROM = "Sundance Stay Collective <noreply@netgains.app>";

export async function sendLeadNotification(subject: string, lines: string[]) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set; skipping email send");
    return;
  }
  await resend.emails.send({ from: FROM, to: TO, subject, text: lines.join("\n") });
}
