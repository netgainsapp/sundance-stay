import { prisma } from "@/lib/prisma";

export const NEWSLETTER_SEND_FLAG = "newsletter_send_enabled";
// When OFF (default), the blog engine runs evergreen cornerstone topics only.
// Flip ON to also generate catalog-grounded neighborhood and category posts.
export const BLOG_DATA_POSTS_FLAG = "blog_data_posts";

/** Reads a feature flag. Defaults OFF and fails closed (engines ship dormant). */
export async function isFlagOn(key: string): Promise<boolean> {
  try {
    const f = await prisma.featureFlag.findUnique({ where: { key } });
    return f?.enabled ?? false;
  } catch {
    return false;
  }
}

export async function setFlag(key: string, enabled: boolean): Promise<void> {
  await prisma.featureFlag.upsert({
    where: { key },
    update: { enabled },
    create: { key, enabled },
  });
}
