import { prisma } from "@/lib/prisma";
import { isAutopublishOn } from "@/lib/blog-flag";
import {
  toggleAutopublish,
  publishGeneratedPost,
  unpublishGeneratedPost,
  generateOneNow,
} from "@/actions/blog-admin";
import type { GeneratedPost } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

function statusBadge(status: string): string {
  if (status === "published") return "bg-mountain/15 text-mountain";
  if (status === "draft") return "bg-copper/15 text-copper";
  return "bg-charcoal/10 text-charcoal/60";
}

export default async function AdminBlogPage() {
  let posts: GeneratedPost[] = [];
  let autopublish = false;
  let dbError = false;
  try {
    [posts, autopublish] = await Promise.all([
      prisma.generatedPost.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
      isAutopublishOn(),
    ]);
  } catch {
    dbError = true;
  }

  return (
    <div>
      <h1 className="font-heading text-2xl text-charcoal">Blog engine</h1>
      <p className="mt-2 text-sm text-charcoal/60">
        Auto-generated posts. Curated posts are managed in code. The engine ships
        dormant: nothing auto-publishes until you turn the switch on.
      </p>

      {dbError && (
        <p className="mt-4 rounded-card bg-sand/40 px-4 py-3 text-sm text-charcoal/70">
          No database connected yet. Generated posts appear here once
          DATABASE_URL is set.
        </p>
      )}

      <div className="mt-6 flex items-center justify-between rounded-card border border-charcoal/10 bg-white p-5">
        <div>
          <p className="font-medium text-charcoal">Auto-publish</p>
          <p className="text-sm text-charcoal/60">
            {autopublish
              ? "On. The engine publishes posts that pass every guardrail."
              : "Off. The engine writes drafts only; you publish them yourself."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <form action={generateOneNow}>
            <button
              type="submit"
              className="rounded-card border border-charcoal/20 px-4 py-2 text-sm text-charcoal/70 transition-colors hover:bg-charcoal/5"
            >
              Generate one now
            </button>
          </form>
          <form action={toggleAutopublish}>
            <input type="hidden" name="enabled" value={autopublish ? "false" : "true"} />
            <button
              type="submit"
              className={`rounded-card px-4 py-2 text-sm font-medium transition-colors ${
                autopublish
                  ? "border border-charcoal/20 text-charcoal/70 hover:bg-charcoal/5"
                  : "bg-mountain text-white hover:bg-charcoal"
              }`}
            >
              {autopublish ? "Turn off" : "Turn on"}
            </button>
          </form>
        </div>
      </div>

      {posts.length === 0 && !dbError ? (
        <p className="mt-6 rounded-card border border-charcoal/10 bg-white p-5 text-sm text-charcoal/60">
          No generated posts yet. Run the seed from the engine once a database
          and model key are connected.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {posts.map((p) => (
            <div key={p.id} className="rounded-card border border-charcoal/10 bg-white p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadge(p.status)}`}>
                  {p.status}
                </span>
                <span className="text-xs uppercase tracking-wide text-charcoal/50">
                  {p.postType}
                </span>
                <span className="text-sm text-charcoal">{p.title}</span>
              </div>
              {Array.isArray(p.guardrailReasons) && p.guardrailReasons.length > 0 && (
                <p className="mt-2 text-xs text-copper">
                  Held as draft: {(p.guardrailReasons as string[]).join(", ")}
                </p>
              )}
              <div className="mt-4 flex gap-3">
                {p.status !== "published" ? (
                  <form action={publishGeneratedPost}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="rounded-card bg-mountain px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-charcoal">
                      Publish
                    </button>
                  </form>
                ) : (
                  <form action={unpublishGeneratedPost}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="rounded-card border border-charcoal/20 px-4 py-2 text-sm text-charcoal/70 transition-colors hover:bg-charcoal/5">
                      Unpublish
                    </button>
                  </form>
                )}
                <a
                  href={`/blog/${p.slug}`}
                  className="rounded-card border border-charcoal/20 px-4 py-2 text-sm text-charcoal/70 transition-colors hover:bg-charcoal/5"
                >
                  View
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
