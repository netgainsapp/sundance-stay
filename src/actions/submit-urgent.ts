"use server";

import { headers } from "next/headers";
import { urgentStaySchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { sendLeadNotification } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit-durable";
import { clientIp } from "@/lib/request";
import type { FormState } from "./submit-lead";

export async function submitUrgentStay(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = urgentStaySchema.safeParse(raw);

  if (!parsed.success) {
    if (parsed.error.issues.some((i) => i.path[0] === "website")) {
      return { ok: true, message: "Thank you. We will be in touch as fast as we can." };
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
  if (!(await rateLimit("urgent", ip, 5, 600)).ok) {
    return { ok: false, message: "Too many requests. Please try again shortly." };
  }

  const d = parsed.data;
  const composed = [
    `Dates needed: ${d.datesNeeded}`,
    `Party size: ${d.partySize || "n/a"}`,
    `Budget: ${d.budget || "n/a"}`,
    "",
    d.message || "(no additional notes)",
  ].join("\n");

  try {
    await prisma.lead.create({
      data: {
        sourceType: "urgent_stay",
        visitorName: d.visitorName,
        visitorEmail: d.visitorEmail,
        visitorPhone: d.visitorPhone || null,
        message: composed,
      },
    });

    await sendLeadNotification("URGENT stay request", [
      `Name: ${d.visitorName}`,
      `Email: ${d.visitorEmail}`,
      `Phone: ${d.visitorPhone || "n/a"}`,
      "",
      composed,
    ]);
  } catch (err) {
    console.error("submitUrgentStay failed", err);
    return { ok: false, message: "Something went wrong on our end. Please try again." };
  }

  return {
    ok: true,
    message: "Thank you. We will reach out as fast as we can with options.",
  };
}
