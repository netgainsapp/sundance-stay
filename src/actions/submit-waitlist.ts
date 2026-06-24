"use server";

import { prisma } from "@/lib/prisma";
import { sendWaitlistNotification } from "@/lib/email";

type WaitlistData = {
  email: string;
  isPartner: boolean;
  companyName: string | null;
  partnerCategory: string | null;
  proposalDetails: string | null;
};

export async function submitWaitlistSignup(
  data: WaitlistData
): Promise<{ ok: boolean; error?: string }> {
  try {
    // Check if email already exists
    const existing = await prisma.waitlist.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      return { ok: false, error: "This email is already on the waitlist." };
    }

    // Create waitlist entry
    const waitlistEntry = await prisma.waitlist.create({
      data: {
        email: data.email,
        isPartner: data.isPartner,
        companyName: data.companyName,
        partnerCategory: data.partnerCategory,
        proposalDetails: data.proposalDetails,
      },
    });

    // Send notification email only for partners
    if (data.isPartner) {
      await sendWaitlistNotification({
        email: data.email,
        companyName: data.companyName || "Unknown",
        category: data.partnerCategory || "Other",
        details: data.proposalDetails || "No details provided",
        type: "partner",
      });
    }

    return { ok: true };
  } catch (error) {
    console.error("submitWaitlistSignup failed", error);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
