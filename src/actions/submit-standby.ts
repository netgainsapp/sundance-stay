"use server";

import { headers } from "next/headers";
import { standbyHostSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { sendLeadNotification } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit-durable";
import { clientIp } from "@/lib/request";
import type { FormState } from "./submit-lead";

export async function submitStandbyHost(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = standbyHostSchema.safeParse(raw);

  if (!parsed.success) {
    if (parsed.error.issues.some((i) => i.path[0] === "website")) {
      return { ok: true, message: "Thank you. You are on the standby list." };
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
  if (!(await rateLimit("standby", ip, 5, 600)).ok) {
    return { ok: false, message: "Too many requests. Please try again shortly." };
  }

  const d = parsed.data;
  const composed = [
    `Home area: ${d.area}`,
    `Sleeps: ${d.sleeps || "n/a"}`,
    `Dates available: ${d.datesAvailable}`,
    "",
    d.message || "(no additional notes)",
  ].join("\n");

  try {
    await prisma.lead.create({
      data: {
        sourceType: "standby_host",
        visitorName: d.visitorName,
        visitorEmail: d.visitorEmail,
        visitorPhone: d.visitorPhone || null,
        message: composed,
      },
    });

    await sendLeadNotification("New standby host", [
      `Name: ${d.visitorName}`,
      `Email: ${d.visitorEmail}`,
      `Phone: ${d.visitorPhone || "n/a"}`,
      "",
      composed,
    ]);
  } catch (err) {
    console.error("submitStandbyHost failed", err);
    return { ok: false, message: "Something went wrong on our end. Please try again." };
  }

  return {
    ok: true,
    message: "Thank you. You are on the standby list. We will reach out if there is a match.",
  };
}
