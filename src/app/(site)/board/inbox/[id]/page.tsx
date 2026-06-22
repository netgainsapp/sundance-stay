import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { currentBoardUserId } from "@/lib/board-auth";
import { MessageReplyForm } from "@/components/forms/MessageReplyForm";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Conversation",
  description: "A Last-Minute Board conversation.",
  path: "/board/inbox",
});

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = await currentBoardUserId();
  if (!userId) redirect(`/board/signin?next=/board/inbox/${id}`);

  const thread = await prisma.thread.findUnique({
    where: { id },
    include: {
      post: true,
      initiator: true,
      recipient: true,
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  if (
    !thread ||
    (thread.initiatorId !== userId && thread.recipientId !== userId)
  ) {
    notFound();
  }

  // Mark messages from the other party as read.
  await prisma.message.updateMany({
    where: { threadId: id, senderId: { not: userId }, readAt: null },
    data: { readAt: new Date() },
  });

  const isAuthor = thread.recipientId === userId;
  const authorRole = thread.post.type === "availability" ? "Host" : "Traveler";
  const other = isAuthor ? thread.initiator : thread.recipient;
  const otherLabel =
    other.name ||
    (isAuthor
      ? authorRole === "Host"
        ? "Traveler"
        : "Host"
      : authorRole);

  return (
    <section className="mx-auto max-w-2xl px-6 py-[var(--space-section)]">
      <Link href="/board/inbox" className="text-sm text-mountain underline">
        Back to your inbox
      </Link>

      <div className="mt-6 rounded-card border border-charcoal/10 p-5">
        <p className="text-xs uppercase tracking-wide text-charcoal/50">
          {thread.post.type === "need" ? "Traveler needs a place" : "Host has space"}
        </p>
        <h1 className="mt-1 font-heading text-xl text-charcoal">
          {thread.post.area}
        </h1>
        <p className="text-sm text-charcoal/60">
          {thread.post.dates} · conversation with {otherLabel}
        </p>
        <Link
          href={`/board/${thread.post.id}`}
          className="mt-2 inline-block text-xs text-mountain underline"
        >
          View the post
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {thread.messages.map((m) => {
          const mine = m.senderId === userId;
          return (
            <div
              key={m.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-card px-4 py-3 text-sm leading-relaxed ${
                  mine
                    ? "bg-mountain text-white"
                    : "border border-charcoal/10 bg-white text-charcoal/80"
                }`}
              >
                <p className="mb-1 text-xs opacity-70">{mine ? "You" : otherLabel}</p>
                <p className="whitespace-pre-line">{m.body}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-card border border-charcoal/10 p-5">
        <MessageReplyForm threadId={thread.id} />
      </div>

      <p className="mt-4 text-xs text-charcoal/50">
        Keep the conversation here until you are comfortable. Never send payment
        for a stay through this chat.
      </p>
    </section>
  );
}
