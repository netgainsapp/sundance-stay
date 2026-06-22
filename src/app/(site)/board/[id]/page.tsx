import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { currentBoardUserId } from "@/lib/board-auth";
import { StartConversationForm } from "@/components/forms/StartConversationForm";
import { pageMetadata } from "@/lib/seo";
import type { BoardPost } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Board post",
  description: "A Last-Minute Board post for the Boulder festival window.",
  path: "/board",
});

export default async function BoardPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let post: BoardPost | null = null;
  try {
    post = await prisma.boardPost.findFirst({ where: { id, status: "active" } });
  } catch {
    post = null;
  }
  if (!post) notFound();

  const userId = await currentBoardUserId();
  const isAuthor = userId === post.authorId;
  const isNeed = post.type === "need";

  let existingThreadId: string | null = null;
  if (userId && !isAuthor) {
    try {
      const t = await prisma.thread.findUnique({
        where: { postId_initiatorId: { postId: post.id, initiatorId: userId } },
        select: { id: true },
      });
      existingThreadId = t?.id ?? null;
    } catch {
      existingThreadId = null;
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-[var(--space-section)]">
      <Link href="/board" className="text-sm text-mountain underline">
        Back to the board
      </Link>

      <div className="mt-6 rounded-card border border-charcoal/10 p-8">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
            isNeed ? "bg-copper/15 text-copper" : "bg-mountain/15 text-mountain"
          }`}
        >
          {isNeed ? "Traveler needs a place" : "Host has space"}
        </span>
        <h1 className="mt-4 font-heading text-3xl text-charcoal">{post.area}</h1>
        <p className="mt-1 text-charcoal/60">{post.dates}</p>

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          {post.partySize && (
            <div>
              <dt className="text-charcoal/50">Party size or sleeps</dt>
              <dd className="mt-1 text-charcoal">{post.partySize}</dd>
            </div>
          )}
          {post.budget && (
            <div>
              <dt className="text-charcoal/50">Budget or nightly rate</dt>
              <dd className="mt-1 text-charcoal">{post.budget}</dd>
            </div>
          )}
        </dl>

        <p className="mt-6 whitespace-pre-line leading-relaxed text-charcoal/80">
          {post.notes}
        </p>
      </div>

      <div className="mt-6 rounded-card bg-sand/20 p-6">
        {isAuthor ? (
          <p className="text-sm text-charcoal/70">
            This is your post. We will let you know when someone wants to connect.
          </p>
        ) : !userId ? (
          <>
            <h2 className="font-heading text-lg text-charcoal">
              Want to connect?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
              Sign in, then a flat fee unlocks a private conversation with this
              poster. We never take a cut of the stay.
            </p>
            <Link
              href="/board/signin"
              className="mt-4 inline-flex rounded-card bg-mountain px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-charcoal"
            >
              Sign in to connect
            </Link>
          </>
        ) : existingThreadId ? (
          <>
            <h2 className="font-heading text-lg text-charcoal">
              You have a conversation going
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
              Pick up where you left off.
            </p>
            <Link
              href={`/board/inbox/${existingThreadId}`}
              className="mt-4 inline-flex rounded-card bg-mountain px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-charcoal"
            >
              Open the conversation
            </Link>
          </>
        ) : (
          <>
            <h2 className="font-heading text-lg text-charcoal">
              Start a conversation
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
              Send a first message to connect privately with this poster. We
              never take a cut of the stay.
            </p>
            <div className="mt-4">
              <StartConversationForm postId={post.id} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
