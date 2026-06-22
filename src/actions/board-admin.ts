"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function approveBoardPost(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.boardPost.update({ where: { id }, data: { status: "active" } });
  revalidatePath("/admin/board");
  revalidatePath("/board");
}

export async function removeBoardPost(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.boardPost.update({ where: { id }, data: { status: "removed" } });
  revalidatePath("/admin/board");
  revalidatePath("/board");
}

export async function resolveReport(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const status = formData.get("status") === "dismissed" ? "dismissed" : "reviewed";
  if (!id) return;
  await prisma.report.update({ where: { id }, data: { status } });
  revalidatePath("/admin/reports");
}

export async function suspendBoardUser(formData: FormData): Promise<void> {
  await requireAdmin();
  const userId = String(formData.get("userId") || "");
  if (!userId) return;
  await prisma.boardUser.update({
    where: { id: userId },
    data: { status: "suspended" },
  });
  revalidatePath("/admin/reports");
  revalidatePath("/admin/board");
}

export async function reactivateBoardUser(formData: FormData): Promise<void> {
  await requireAdmin();
  const userId = String(formData.get("userId") || "");
  if (!userId) return;
  await prisma.boardUser.update({
    where: { id: userId },
    data: { status: "active" },
  });
  revalidatePath("/admin/reports");
  revalidatePath("/admin/board");
}
