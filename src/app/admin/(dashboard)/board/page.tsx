import { prisma } from "@/lib/prisma";
import { approveBoardPost, removeBoardPost } from "@/actions/board-admin";
import type { BoardPost } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

function statusBadge(status: string): string {
  if (status === "pending") return "bg-copper/15 text-copper";
  if (status === "active") return "bg-mountain/15 text-mountain";
  return "bg-charcoal/10 text-charcoal/60";
}

export default async function AdminBoardPage() {
  let posts: BoardPost[] = [];
  let dbError = false;
  try {
    posts = await prisma.boardPost.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      take: 200,
    });
  } catch {
    dbError = true;
  }

  return (
    <div>
      <h1 className="font-heading text-2xl text-charcoal">Board moderation</h1>
      <p className="mt-2 text-sm text-charcoal/60">
        Approve posts to make them public, or remove anything that does not
        belong. Pending posts appear first.
      </p>

      {dbError && (
        <p className="mt-4 rounded-card bg-sand/40 px-4 py-3 text-sm text-charcoal/70">
          No database connected yet. Posts appear here once DATABASE_URL is set.
        </p>
      )}

      {posts.length === 0 && !dbError ? (
        <p className="mt-6 rounded-card border border-charcoal/10 bg-white p-5 text-sm text-charcoal/60">
          No board posts yet.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {posts.map((p) => (
            <div
              key={p.id}
              className="rounded-card border border-charcoal/10 bg-white p-5"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadge(p.status)}`}>
                  {p.status}
                </span>
                <span className="text-xs uppercase tracking-wide text-charcoal/50">
                  {p.type === "need" ? "Traveler need" : "Host availability"}
                </span>
                <span className="text-sm text-charcoal">{p.area}</span>
                <span className="text-sm text-charcoal/60">{p.dates}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/80">
                {p.notes}
              </p>
              {(p.partySize || p.budget) && (
                <p className="mt-2 text-xs text-charcoal/50">
                  {[p.partySize, p.budget].filter(Boolean).join(" · ")}
                </p>
              )}
              <div className="mt-4 flex gap-3">
                {p.status !== "active" && (
                  <form action={approveBoardPost}>
                    <input type="hidden" name="id" value={p.id} />
                    <button
                      type="submit"
                      className="rounded-card bg-mountain px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-charcoal"
                    >
                      Approve
                    </button>
                  </form>
                )}
                {p.status !== "removed" && (
                  <form action={removeBoardPost}>
                    <input type="hidden" name="id" value={p.id} />
                    <button
                      type="submit"
                      className="rounded-card border border-charcoal/20 px-4 py-2 text-sm text-charcoal/70 transition-colors hover:bg-charcoal/5"
                    >
                      Remove
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
