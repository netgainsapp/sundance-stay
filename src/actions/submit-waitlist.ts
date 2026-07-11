"use server";

import { prisma } from "@/lib/prisma";
import { sendWaitlistNotification } from "@/lib/email";
import { sendWelcome } from "@/lib/waitlist-drip";

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

    // Admin alert for every signup. A send failure is logged loudly but must
    // not fail the signup itself; the row is already saved.
    try {
      await sendWaitlistNotification({
        email: data.email,
        companyName: data.companyName || "Guest",
        category: data.partnerCategory || "N/A",
        details: data.proposalDetails || "N/A",
        type: data.isPartner ? "partner" : "guest",
      });
    } catch (err) {
      console.error("waitlist admin alert failed", err);
    }

    // Welcome email to the subscriber (redirected to the test inbox while
    // WAITLIST_DRIP_REDIRECT is set). Drip stages 1..3 follow via daily cron.
    await sendWelcome({
      email: waitlistEntry.email,
      isPartner: waitlistEntry.isPartner,
      unsubscribeToken: waitlistEntry.unsubscribeToken,
    });

    return { ok: true };
  } catch (error) {
    console.error("submitWaitlistSignup failed", error);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
