import { prisma } from "@/lib/prisma";

export const NEWSLETTER_SEND_FLAG = "newsletter_send_enabled";

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
