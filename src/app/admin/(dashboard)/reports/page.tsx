import { prisma } from "@/lib/prisma";
import {
  resolveReport,
  suspendBoardUser,
  removeBoardPost,
} from "@/actions/board-admin";

export const dynamic = "force-dynamic";

type Enriched = {
  id: string;
  targetType: string;
  targetId: string;
  reason: string;
  createdAt: Date;
  postArea?: string;
  postStatus?: string;
  authorId?: string;
  authorEmail?: string;
  parties?: { id: string; email: string }[];
  missing?: boolean;
};

async function loadReports(): Promise<Enriched[]> {
  const reports = await prisma.report.findMany({
    where: { status: "open" },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return Promise.all(
    reports.map(async (r): Promise<Enriched> => {
      const base = {
        id: r.id,
        targetType: r.targetType,
        targetId: r.targetId,
        reason: r.reason,
        createdAt: r.createdAt,
      };
      if (r.targetType === "post") {
        const post = await prisma.boardPost.findUnique({
          where: { id: r.targetId },
          include: { author: true },
        });
        if (!post) return { ...base, missing: true };
        return {
          ...base,
          postArea: post.area,
          postStatus: post.status,
          authorId: post.authorId,
          authorEmail: post.author.email,
        };
      }
      const thread = await prisma.thread.findUnique({
        where: { id: r.targetId },
        include: { initiator: true, recipient: true, post: true },
      });
      if (!thread) return { ...base, missing: true };
      return {
        ...base,
        postArea: thread.post.area,
        parties: [
          { id: thread.initiator.id, email: thread.initiator.email },
          { id: thread.recipient.id, email: thread.recipient.email },
        ],
      };
    }),
  );
}

export default async function AdminReportsPage() {
  let reports: Enriched[] = [];
  let dbError = false;
  try {
    reports = await loadReports();
  } catch {
    dbError = true;
  }

  return (
    <div>
      <h1 className="font-heading text-2xl text-charcoal">Reports</h1>
      <p className="mt-2 text-sm text-charcoal/60">
        Open moderation reports. Resolve each one, and remove content or suspend
        a user when needed.
      </p>

      {dbError && (
        <p className="mt-4 rounded-card bg-sand/40 px-4 py-3 text-sm text-charcoal/70">
          No database connected yet. Reports appear here once DATABASE_URL is set.
        </p>
      )}

      {reports.length === 0 && !dbError ? (
        <p className="mt-6 rounded-card border border-charcoal/10 bg-white p-5 text-sm text-charcoal/60">
          No open reports.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {reports.map((r) => (
            <div key={r.id} className="rounded-card border border-charcoal/10 bg-white p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-copper/15 px-3 py-1 text-xs font-medium text-copper">
                  {r.reason}
                </span>
                <span className="text-xs uppercase tracking-wide text-charcoal/50">
                  {r.targetType}
                </span>
                {r.postArea && <span className="text-sm text-charcoal">{r.postArea}</span>}
                <span className="text-xs text-charcoal/50">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>

              {r.missing ? (
                <p className="mt-2 text-sm text-charcoal/50">
                  The reported content no longer exists.
                </p>
              ) : (
                <p className="mt-2 text-sm text-charcoal/70">
                  {r.targetType === "post"
                    ? `Post status: ${r.postStatus}. Author: ${r.authorEmail}`
                    : `Conversation between ${r.parties?.map((p) => p.email).join(" and ")}`}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-3">
                <form action={resolveReport}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="status" value="reviewed" />
                  <button type="submit" className="rounded-card bg-mountain px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-charcoal">
                    Mark reviewed
                  </button>
                </form>
                <form action={resolveReport}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="status" value="dismissed" />
                  <button type="submit" className="rounded-card border border-charcoal/20 px-4 py-2 text-sm text-charcoal/70 transition-colors hover:bg-charcoal/5">
                    Dismiss
                  </button>
                </form>
                {r.targetType === "post" && !r.missing && (
                  <form action={removeBoardPost}>
                    <input type="hidden" name="id" value={r.targetId} />
                    <button type="submit" className="rounded-card border border-charcoal/20 px-4 py-2 text-sm text-charcoal/70 transition-colors hover:bg-charcoal/5">
                      Remove post
                    </button>
                  </form>
                )}
                {r.targetType === "post" && r.authorId && (
                  <form action={suspendBoardUser}>
                    <input type="hidden" name="userId" value={r.authorId} />
                    <button type="submit" className="rounded-card border border-copper/40 px-4 py-2 text-sm text-copper transition-colors hover:bg-copper/5">
                      Suspend author
                    </button>
                  </form>
                )}
                {r.parties?.map((p) => (
                  <form action={suspendBoardUser} key={p.id}>
                    <input type="hidden" name="userId" value={p.id} />
                    <button type="submit" className="rounded-card border border-copper/40 px-4 py-2 text-sm text-copper transition-colors hover:bg-copper/5">
                      Suspend {p.email}
                    </button>
                  </form>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
