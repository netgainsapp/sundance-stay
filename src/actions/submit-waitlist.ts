"use server";

import { prisma } from "@/lib/prisma";
import { sendWaitlistNotification } from "@/lib/email";
import { forwardToDispatch } from "@/lib/dispatch";

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

    // Dispatch now owns the newsletter list. Forward the signup so Dispatch
    // sends the double opt-in and all subscriber facing email. A forward
    // failure is logged but must not fail the signup; the local row is saved
    // and the site gate cookie is set regardless.
    try {
      await forwardToDispatch(waitlistEntry.email);
    } catch (err) {
      console.error("dispatch forward failed", err);
    }

    return { ok: true };
  } catch (error) {
    console.error("submitWaitlistSignup failed", error);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
