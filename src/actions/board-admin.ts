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
