"use server";

import { headers } from "next/headers";
import { leadSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { sendLeadNotification } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/request";

export type FormState = { ok: boolean; message?: string; errors?: Record<string, string> };

export async function submitLead(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = leadSchema.safeParse(raw);

  if (!parsed.success) {
    if (parsed.error.issues.some((i) => i.path[0] === "website")) {
      return { ok: true, message: "Thank you. We will be in touch soon." };
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
  if (!checkRateLimit(`lead:${ip}`).ok) {
    return { ok: false, message: "Too many requests. Please try again shortly." };
  }

  const data = parsed.data;
  try {
    await prisma.lead.create({
      data: {
        sourceType: data.sourceType,
        propertySlug: data.propertySlug || null,
        businessSlug: data.businessSlug || null,
        visitorName: data.visitorName,
        visitorEmail: data.visitorEmail,
        visitorPhone: data.visitorPhone || null,
        message: data.message,
      },
    });

    await sendLeadNotification(`New ${data.sourceType.replaceAll("_", " ")}`, [
      `Name: ${data.visitorName}`,
      `Email: ${data.visitorEmail}`,
      `Phone: ${data.visitorPhone || "n/a"}`,
      `Property: ${data.propertySlug || "n/a"}`,
      `Business: ${data.businessSlug || "n/a"}`,
      "",
      data.message,
    ]);
  } catch (err) {
    console.error("submitLead failed", err);
    return { ok: false, message: "Something went wrong on our end. Please try again." };
  }

  return { ok: true, message: "Thank you. Your inquiry is on its way." };
}
