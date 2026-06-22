import { SectionHeader } from "@/components/ui/SectionHeader";
import { prisma } from "@/lib/prisma";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Unsubscribe",
  description: "Unsubscribe from the Sundance Stay Collective newsletter.",
  path: "/newsletter/unsubscribe",
});

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  let done = false;
  if (token) {
    try {
      const res = await prisma.newsletterSubscriber.updateMany({
        where: { unsubscribeToken: token, status: "active" },
        data: { status: "unsubscribed", unsubscribedAt: new Date() },
      });
      done = res.count > 0;
    } catch {
      done = false;
    }
  }

  return (
    <section className="mx-auto max-w-xl px-6 py-[var(--space-section)]">
      <SectionHeader
        eyebrow="Newsletter"
        title={done ? "You are unsubscribed" : "Unsubscribe"}
        intro={
          done
            ? "You will no longer receive the Sundance Stay Collective newsletter. You are always welcome back."
            : "We could not find that subscription. It may already be removed."
        }
      />
    </section>
  );
}
