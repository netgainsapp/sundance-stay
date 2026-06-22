"use server";

import { headers } from "next/headers";
import { propertySubmissionSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { sendLeadNotification } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit-durable";
import { clientIp } from "@/lib/request";
import type { FormState } from "./submit-lead";

export async function submitProperty(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = propertySubmissionSchema.safeParse(raw);

  if (!parsed.success) {
    if (parsed.error.issues.some((i) => i.path[0] === "website")) {
      return { ok: true, message: "Thank you. We will review your property." };
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
  if (!(await rateLimit("property", ip, 5, 600)).ok) {
    return { ok: false, message: "Too many requests. Please try again shortly." };
  }

  const d = parsed.data;
  try {
    await prisma.propertySubmission.create({
      data: {
        name: d.name, email: d.email, phone: d.phone || null,
        propertyAddress: d.propertyAddress, propertyType: d.propertyType,
        bedrooms: d.bedrooms, bathrooms: d.bathrooms, capacity: d.capacity,
        availabilityDates: d.availabilityDates || null, description: d.description,
        bookingUrl: d.bookingUrl || null,
        shortNotice: d.shortNotice === "on",
        licenseNumber: d.licenseNumber || null,
      },
    });

    await sendLeadNotification("New property submission", [
      `Name: ${d.name}`, `Email: ${d.email}`, `Phone: ${d.phone || "n/a"}`,
      `Address: ${d.propertyAddress}`, `Type: ${d.propertyType}`,
      `Bedrooms: ${d.bedrooms}  Bathrooms: ${d.bathrooms}  Sleeps: ${d.capacity}`,
      `Availability: ${d.availabilityDates || "n/a"}`,
      `Booking link: ${d.bookingUrl || "n/a"}`,
      `Standby host (short notice): ${d.shortNotice === "on" ? "yes" : "no"}`,
      `Rental license: ${d.licenseNumber || "n/a"}`,
      "", d.description,
    ]);
  } catch (err) {
    console.error("submitProperty failed", err);
    return { ok: false, message: "Something went wrong on our end. Please try again." };
  }

  return { ok: true, message: "Thank you. We will review your property and reach out." };
}
