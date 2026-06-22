import Link from "next/link";
import { redirect } from "next/navigation";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { prisma } from "@/lib/prisma";
import { currentBoardUserId } from "@/lib/board-auth";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Your inbox",
  description: "Your Last-Minute Board conversations.",
  path: "/board/inbox",
});

export default async function InboxPage() {
  const userId = await currentBoardUserId();
  if (!userId) redirect("/board/signin?next=/board/inbox");

  let threads: Awaited<ReturnType<typeof loadThreads>> = [];
  let dbError = false;
  try {
    threads = await loadThreads(userId);
  } catch {
    dbError = true;
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-[var(--space-section)]">
      <SectionHeader
        eyebrow="Inbox"
        title="Your conversations"
        intro="Messages with travelers and hosts you have connected with on the board."
      />
      <div className="mt-6">
        <Link href="/board" className="text-sm text-mountain underline">
          Back to the board
        </Link>
      </div>

      {dbError ? (
        <p className="mt-8 rounded-card bg-sand/30 p-6 text-sm text-charcoal/70">
          Your inbox is not available right now. Please check back shortly.
        </p>
      ) : threads.length === 0 ? (
        <p className="mt-8 rounded-card border border-charcoal/10 p-6 text-sm text-charcoal/60">
          No conversations yet. Browse the board and start one when you find a
          match.
        </p>
      ) : (
        <div className="mt-8 space-y-3">
          {threads.map((t) => {
            const last = t.messages[0];
            const isAuthor = t.recipientId === userId;
            const authorRole = t.post.type === "availability" ? "Host" : "Traveler";
            const otherIsAuthor = !isAuthor;
            const other = isAuthor ? t.initiator : t.recipient;
            const otherLabel =
              other.name ||
              (otherIsAuthor ? authorRole : authorRole === "Host" ? "Traveler" : "Host");
            const unread = last && last.senderId !== userId && !last.readAt;
            return (
              <Link
                key={t.id}
                href={`/board/inbox/${t.id}`}
                className="block rounded-card border border-charcoal/10 p-5 transition-colors hover:border-mountain"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-heading text-charcoal">
                    {t.post.area}
                    <span className="ml-2 text-sm font-normal text-charcoal/50">
                      with {otherLabel}
                    </span>
                  </span>
                  {unread && (
                    <span className="rounded-full bg-copper px-2 py-0.5 text-xs font-medium text-white">
                      New
                    </span>
                  )}
                </div>
                {last && (
                  <p className="mt-2 line-clamp-1 text-sm text-charcoal/70">
                    {last.senderId === userId ? "You: " : ""}
                    {last.body}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

function loadThreads(userId: string) {
  return prisma.thread.findMany({
    where: { OR: [{ initiatorId: userId }, { recipientId: userId }] },
    include: {
      post: true,
      initiator: true,
      recipient: true,
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}
