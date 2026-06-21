"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const leadStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["new", "contacted", "closed"]),
});

const submissionStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["new", "contacted", "closed"]),
});

const sponsorshipStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["pending", "active", "expired"]),
});

const createSponsorshipSchema = z.object({
  businessName: z.string().min(1),
  contactEmail: z.string().email(),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  level: z.enum(["local", "category", "festival"]),
  placement: z.string().min(1),
  amountDollars: z.coerce.number().optional(),
  status: z.enum(["pending", "active", "expired"]).default("pending"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  notes: z.string().optional(),
});

function optionalDate(value: string | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function updateLeadStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = leadStatusSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return;

  try {
    await prisma.lead.update({
      where: { id: parsed.data.id },
      data: { status: parsed.data.status },
    });
  } catch (err) {
    console.error("updateLeadStatus failed", err);
    return;
  }

  revalidatePath("/admin/leads");
}

export async function updateSubmissionStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = submissionStatusSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success) return;

  try {
    await prisma.propertySubmission.update({
      where: { id: parsed.data.id },
      data: { status: parsed.data.status },
    });
  } catch (err) {
    console.error("updateSubmissionStatus failed", err);
    return;
  }

  revalidatePath("/admin/submissions");
}

export async function updateSponsorshipStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = sponsorshipStatusSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success) return;

  try {
    await prisma.sponsorship.update({
      where: { id: parsed.data.id },
      data: { status: parsed.data.status },
    });
  } catch (err) {
    console.error("updateSponsorshipStatus failed", err);
    return;
  }

  revalidatePath("/admin/sponsorships");
}

export async function createSponsorship(formData: FormData): Promise<void> {
  await requireAdmin();
  const raw = Object.fromEntries(formData.entries());
  const parsed = createSponsorshipSchema.safeParse(raw);
  if (!parsed.success) return;

  const data = parsed.data;
  const amountCents =
    data.amountDollars === undefined || Number.isNaN(data.amountDollars)
      ? null
      : Math.round(data.amountDollars * 100);

  try {
    await prisma.sponsorship.create({
      data: {
        businessName: data.businessName,
        contactEmail: data.contactEmail,
        contactName: data.contactName || null,
        contactPhone: data.contactPhone || null,
        level: data.level,
        placement: data.placement,
        amountCents,
        status: data.status,
        startDate: optionalDate(data.startDate),
        endDate: optionalDate(data.endDate),
        notes: data.notes || null,
      },
    });
  } catch (err) {
    console.error("createSponsorship failed", err);
    return;
  }

  revalidatePath("/admin/sponsorships");
}
