"use server";

import { headers } from "next/headers";
import { alertsSignupSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { sendLeadNotification } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit-durable";
import { clientIp } from "@/lib/request";
import { generateRawToken } from "@/lib/board-token";
import type { FormState } from "./submit-lead";

export async function submitAlertsSignup(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = alertsSignupSchema.safeParse(raw);

  if (!parsed.success) {
    if (parsed.error.issues.some((i) => i.path[0] === "website")) {
      return { ok: true, message: "You are on the list." };
    }
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (key !== "website") errors[key] = issue.message;
    }
    return { ok: false, errors, message: "Please enter a valid email." };
  }

  const hdrs = await headers();
  const ip = clientIp(hdrs);
  if (!(await rateLimit("alerts", ip, 5, 600)).ok) {
    return { ok: false, message: "Too many requests. Please try again shortly." };
  }

  const email = parsed.data.visitorEmail.trim().toLowerCase();
  try {
    await prisma.lead.create({
      data: {
        sourceType: "alerts_signup",
        visitorName: "Subscriber",
        visitorEmail: email,
        message: "Festival lodging alerts signup",
      },
    });

    // Add to the newsletter list (idempotent; re-subscribes if they return).
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { status: "active", unsubscribedAt: null },
      create: { email, unsubscribeToken: generateRawToken() },
    });

    await sendLeadNotification("New festival lodging alerts signup", [
      `Email: ${email}`,
    ]);
  } catch (err) {
    console.error("submitAlertsSignup failed", err);
    return { ok: false, message: "Something went wrong. Please try again." };
  }

  return { ok: true, message: "You are on the list. We will send festival lodging alerts." };
}
