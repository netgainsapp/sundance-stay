import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { prisma } from "@/lib/prisma";
import { currentBoardUserId } from "@/lib/board-auth";
import { logoutBoard } from "@/actions/board-auth";
import { pageMetadata } from "@/lib/seo";
import type { BoardPost } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Last-Minute Board",
  description:
    "Travelers post what they need and hosts post short notice availability for Boulder's festival window. Browse the board and connect.",
  path: "/board",
});

const FILTERS = [
  { key: "", label: "All posts" },
  { key: "need", label: "Travelers need a place" },
  { key: "availability", label: "Hosts with space" },
] as const;

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const activeType = type === "need" || type === "availability" ? type : "";

  const userId = await currentBoardUserId();

  let posts: BoardPost[] = [];
  let dbError = false;
  try {
    posts = await prisma.boardPost.findMany({
      where: { status: "active", ...(activeType ? { type: activeType } : {}) },
      orderBy: { createdAt: "desc" },
      take: 60,
    });
  } catch {
    dbError = true;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
      <SectionHeader
        eyebrow="Last-Minute Board"
        title="Post what you need. Find who has space."
        intro="During the festival window, travelers post what they are looking for and hosts post short notice availability. Posting is free. When you find a match, a flat fee unlocks the conversation."
      />

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const isActive = f.key === activeType;
            return (
              <Link
                key={f.key}
                href={f.key ? `/board?type=${f.key}` : "/board"}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? "border-mountain bg-mountain text-white"
                    : "border-charcoal/15 text-charcoal/70 hover:border-mountain"
                }`}
              >
                {f.label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-3 text-sm">
          {userId ? (
            <>
              <Link href="/board/inbox" className="text-charcoal/70 underline">
                Inbox
              </Link>
              <Link
                href="/board/new"
                className="rounded-card bg-copper px-4 py-2 font-medium text-white transition-colors hover:bg-charcoal"
              >
                Post to the board
              </Link>
              <form action={logoutBoard}>
                <button type="submit" className="text-charcoal/50 underline">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/board/signin"
              className="rounded-card bg-mountain px-4 py-2 font-medium text-white transition-colors hover:bg-charcoal"
            >
              Sign in to post
            </Link>
          )}
        </div>
      </div>

      {dbError ? (
        <p className="mt-12 rounded-card bg-sand/30 p-6 text-sm text-charcoal/70">
          The board is not available right now. Please check back shortly.
        </p>
      ) : posts.length === 0 ? (
        <p className="mt-12 rounded-card border border-charcoal/10 p-6 text-sm text-charcoal/60">
          No posts yet. Be the first to post what you need or what you have open.
        </p>
      ) : (
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.id}
              href={`/board/${p.id}`}
              className="flex flex-col rounded-card border border-charcoal/10 p-6 transition-colors hover:border-mountain"
            >
              <span
                className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${
                  p.type === "need"
                    ? "bg-copper/15 text-copper"
                    : "bg-mountain/15 text-mountain"
                }`}
              >
                {p.type === "need" ? "Traveler needs a place" : "Host has space"}
              </span>
              <h3 className="mt-4 font-heading text-lg text-charcoal">{p.area}</h3>
              <p className="mt-1 text-sm text-charcoal/60">{p.dates}</p>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-charcoal/70">
                {p.notes}
              </p>
              {(p.partySize || p.budget) && (
                <p className="mt-4 text-xs uppercase tracking-wide text-charcoal/50">
                  {[p.partySize, p.budget].filter(Boolean).join(" · ")}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
