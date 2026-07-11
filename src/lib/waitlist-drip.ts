import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { assertSent } from "@/lib/email";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM =
  process.env.RESEND_FROM_ADDRESS ??
  "Boulder Film Collective <hello@boulderfilmcollective.com>";

/** Replies to drip emails land in the admin inbox until a real mailbox exists on the domain. */
const REPLY_TO = process.env.LEADS_EMAIL;

/**
 * While testing, set WAITLIST_DRIP_REDIRECT to an inbox (e.g. the admin's) and
 * every subscriber-facing email is delivered there instead of to the real
 * signup address. Remove the env var to go live to real subscribers.
 */
const REDIRECT = process.env.WAITLIST_DRIP_REDIRECT;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://boulderfilmcollective.com";

/** Days after signup that each drip stage becomes due. Stage 0 = welcome (sent inline on signup). */
const STAGE_DUE_DAYS: Record<number, number> = { 1: 3, 2: 7, 3: 12 };

function footer(unsubscribeToken: string): string {
  return [
    "",
    "Boulder Film Collective is an independent guide to lodging and services in Boulder. Not affiliated with, endorsed by, or sponsored by Sundance Institute or the Sundance Film Festival.",
    "",
    `Unsubscribe: ${SITE_URL}/api/waitlist/unsubscribe?token=${unsubscribeToken}`,
  ].join("\n");
}

type DripEmail = { subject: string; body: string };

/** Welcome email, sent immediately on signup. */
export function welcomeEmail(isPartner: boolean): DripEmail {
  if (isPartner) {
    return {
      subject: "You are in. Welcome to Boulder Film Collective.",
      body: [
        "Thanks for raising your hand as a founding partner.",
        "",
        "Festival Season is coming to Boulder in January 2027 and demand is already outrunning supply. Hotels look sold out seven months early. That is exactly the moment we built this for.",
        "",
        "Here is what happens next: a real person reviews every partner application. We will reach out within a few days to talk about your category, what placement looks like, and founding partner rates that will never be offered again after this first cycle.",
        "",
        "In the meantime you have full access to the guide at " + SITE_URL + ".",
        "",
        "Talk soon,",
        "Boulder Film Collective",
      ].join("\n"),
    };
  }
  return {
    subject: "You are on the list. Here is what that gets you.",
    body: [
      "Welcome to Boulder Film Collective.",
      "",
      "In January 2027, roughly ninety thousand people arrive in a town with 2,900 hotel rooms. We are the independent guide to navigating it: where to stay, how to get around, and where locals actually go.",
      "",
      "As a member of the list you get:",
      "",
      "1. Full access to the guide right now at " + SITE_URL,
      "2. The Festival Season Dispatch, our short weekly briefing as January approaches",
      "3. First access to the Last-Minute Board, where real Boulder inventory surfaces when everything else looks sold out",
      "",
      "One question, if you have thirty seconds: are you coming for the festival, or are you local? Reply to this email and tell us. It shapes what we send you.",
      "",
      "See you in Boulder,",
      "Boulder Film Collective",
    ].join("\n"),
  };
}

/** Drip stages 1..3, sent by the daily cron. */
export function dripEmail(stage: number): DripEmail | null {
  switch (stage) {
    case 1:
      return {
        subject: "Where to actually stay for Festival Season (a Boulder primer)",
        body: [
          "Quick orientation, because most of what you will read about Boulder lodging is written by people selling you something.",
          "",
          "Downtown and Pearl Street: walkable to the core venues, priciest, first to sell out. The St. Julien and the Boulderado are the marquee names and they are effectively gone already.",
          "",
          "University Hill and Chautauqua: quieter, character homes, a short ride to venues. This is where the private rental market matters most.",
          "",
          "North and South Boulder: real neighborhoods, better prices, plan on the bus or a car service.",
          "",
          "The US-36 corridor (Louisville, Superior, Broomfield, Westminster): the value play. Twenty minutes out, hotel inventory still exists, and prices are a fraction of downtown.",
          "",
          "The full neighborhood guide, with maps and honest tradeoffs, is on the site: " + SITE_URL + "/guides",
          "",
          "Next week: what the price panic headlines get wrong.",
          "",
          "Boulder Film Collective",
        ].join("\n"),
      };
    case 2:
      return {
        subject: "The Boulder lodging math nobody is publishing",
        body: [
          "You may have seen the headlines. Hotels sold out. Four hundred a night for a one bedroom. Five thousand a night for luxury homes.",
          "",
          "Here is the part the panic stories leave out: Boulder created a Festival Lodging Rental License that lets local homeowners rent their homes during the festival window. That means a large wave of private inventory comes online between now and January that does not exist on any booking site today.",
          "",
          "Our job is to surface it. The guide tracks lodging as it opens, and closer to the festival our Last-Minute Board becomes the live layer: locals posting availability, visitors posting needs, matched directly with no middleman.",
          "",
          "If you take one thing from this email: do not overpay in a panic this summer. Supply is coming.",
          "",
          "Browse what is live now: " + SITE_URL + "/stay",
          "",
          "Boulder Film Collective",
        ].join("\n"),
      };
    case 3:
      return {
        subject: "Do you know someone in Boulder? This is worth forwarding.",
        body: [
          "Two things this week.",
          "",
          "First, if you own a home in Boulder, or know someone who does, the festival window is a rare income event. A licensed home near downtown can earn more in ten days of Festival Season than in months of normal renting. The city license costs 190 dollars and we wrote up the whole process in plain English on the site.",
          "",
          "Second, we are selecting founding partners: one transportation company, one private chef service, one cleaning service, and a small number of others. Founding partners get category exclusivity and rates that will never be offered again after this first festival cycle. If that is you, or someone you trust, the partner form is on the homepage: " + SITE_URL,
          "",
          "The list is growing every week. January is coming.",
          "",
          "Boulder Film Collective",
        ].join("\n"),
      };
    default:
      return null;
  }
}

async function deliver(
  to: string,
  email: DripEmail,
  unsubscribeToken: string,
): Promise<boolean> {
  if (!resend) {
    console.warn(`RESEND_API_KEY not set; drip email to ${to} not sent`);
    return false;
  }
  assertSent(await resend.emails.send({
    from: FROM,
    to: REDIRECT ?? to,
    replyTo: REPLY_TO,
    subject: REDIRECT ? `[DRIP TEST for ${to}] ${email.subject}` : email.subject,
    text: email.body + "\n" + footer(unsubscribeToken),
  }), `drip to ${to}`);
  return true;
}

/** Sends the welcome email to a new signup. Never throws. */
export async function sendWelcome(entry: {
  email: string;
  isPartner: boolean;
  unsubscribeToken: string;
}): Promise<void> {
  try {
    await deliver(entry.email, welcomeEmail(entry.isPartner), entry.unsubscribeToken);
  } catch (err) {
    console.error(`welcome email failed for ${entry.email}`, err);
  }
}

/**
 * Advances the drip for every subscriber who is due. Called by the daily cron.
 * Partners skip stage 3 (it is the founding partner pitch; they already applied).
 */
export async function runDrip(): Promise<{ sent: number; failed: number }> {
  const now = Date.now();
  const candidates = await prisma.waitlist.findMany({
    where: { unsubscribed: false, dripStage: { lt: 3 } },
    orderBy: { createdAt: "asc" },
    take: 200,
  });

  let sent = 0;
  let failed = 0;

  for (const row of candidates) {
    const nextStage = row.dripStage + 1;
    const dueDays = STAGE_DUE_DAYS[nextStage];
    if (dueDays === undefined) continue;

    const ageDays = (now - row.createdAt.getTime()) / 86_400_000;
    if (ageDays < dueDays) continue;

    // Partners already applied; the stage 3 pitch is not for them.
    if (nextStage === 3 && row.isPartner) {
      await prisma.waitlist.update({
        where: { id: row.id },
        data: { dripStage: 3 },
      });
      continue;
    }

    const email = dripEmail(nextStage);
    if (!email) continue;

    try {
      const ok = await deliver(row.email, email, row.unsubscribeToken);
      if (ok) {
        await prisma.waitlist.update({
          where: { id: row.id },
          data: { dripStage: nextStage, dripLastSentAt: new Date() },
        });
        sent += 1;
      }
    } catch (err) {
      console.error(`drip stage ${nextStage} failed for ${row.email}`, err);
      failed += 1;
    }
  }

  return { sent, failed };
}
