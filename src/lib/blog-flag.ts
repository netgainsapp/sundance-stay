import { prisma } from "@/lib/prisma";

export const AUTOPUBLISH_FLAG = "blog_autopublish";

/** Whether the engine is allowed to auto-publish. Defaults OFF (ships dormant). */
export async function isAutopublishOn(): Promise<boolean> {
  try {
    const f = await prisma.featureFlag.findUnique({
      where: { key: AUTOPUBLISH_FLAG },
    });
    return f?.enabled ?? false;
  } catch {
    return false;
  }
}

export async function setAutopublish(enabled: boolean): Promise<void> {
  await prisma.featureFlag.upsert({
    where: { key: AUTOPUBLISH_FLAG },
    update: { enabled },
    create: { key: AUTOPUBLISH_FLAG, enabled },
  });
}
