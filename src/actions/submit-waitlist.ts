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

    // Send confirmation email to admin for all signups (testing)
    await sendWaitlistNotification({
      email: data.email,
      companyName: data.companyName || "Guest",
      category: data.partnerCategory || "N/A",
      details: data.proposalDetails || "N/A",
      type: data.isPartner ? "partner" : "guest",
    });

    return { ok: true };
  } catch (error) {
    console.error("submitWaitlistSignup failed", error);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
