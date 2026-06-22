"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { setAutopublish } from "@/lib/blog-flag";
import { setFlag, BLOG_DATA_POSTS_FLAG } from "@/lib/feature-flag";
import { runOnce } from "@/lib/blog-engine/run";

export async function toggleAutopublish(formData: FormData): Promise<void> {
  await requireAdmin();
  await setAutopublish(formData.get("enabled") === "true");
  revalidatePath("/admin/blog");
}

export async function toggleDataPosts(formData: FormData): Promise<void> {
  await requireAdmin();
  await setFlag(BLOG_DATA_POSTS_FLAG, formData.get("enabled") === "true");
  revalidatePath("/admin/blog");
}

/** Manually runs one engine pass (seed). No-ops cleanly without a model key. */
export async function generateOneNow(): Promise<void> {
  await requireAdmin();
  await runOnce();
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function publishGeneratedPost(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.generatedPost.update({
    where: { id },
    data: { status: "published", publishedAt: new Date() },
  });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function unpublishGeneratedPost(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.generatedPost.update({
    where: { id },
    data: { status: "unpublished" },
  });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
