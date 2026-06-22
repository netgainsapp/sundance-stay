import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { isFlagOn, NEWSLETTER_SEND_FLAG } from "@/lib/feature-flag";
import {
  buildDraftIssue,
  sendNewsletterIssue,
  toggleNewsletterSend,
} from "@/actions/newsletter-admin";
import type { NewsletterIssue } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  let issues: NewsletterIssue[] = [];
  let subscribers = 0;
  let sendOn = false;
  let dbError = false;
  try {
    [issues, subscribers, sendOn] = await Promise.all([
      prisma.newsletterIssue.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
      prisma.newsletterSubscriber.count({ where: { status: "active" } }),
      isFlagOn(NEWSLETTER_SEND_FLAG),
    ]);
  } catch {
    dbError = true;
  }

  return (
    <div>
      <h1 className="font-heading text-2xl text-charcoal">Newsletter</h1>
      <p className="mt-2 text-sm text-charcoal/60">
        Build an issue from the latest posts, featured homes, and your active
        advertisers (their logo, cover image, and blurb are pulled in
        automatically). Sending ships dormant until you turn it on.
      </p>

      {dbError && (
        <p className="mt-4 rounded-card bg-sand/40 px-4 py-3 text-sm text-charcoal/70">
          No database connected yet. Issues and subscribers appear here once
          DATABASE_URL is set.
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-card border border-charcoal/10 bg-white p-5">
        <div>
          <p className="font-medium text-charcoal">
            {subscribers} active subscriber{subscribers === 1 ? "" : "s"}
          </p>
          <p className="text-sm text-charcoal/60">
            Sending is {sendOn ? "ON" : "OFF"}.{" "}
            {sendOn
              ? "The Send button will email subscribers."
              : "Turn it on to allow sending."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <form action={buildDraftIssue}>
            <button
              type="submit"
              className="rounded-card bg-mountain px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-charcoal"
            >
              Build a draft
            </button>
          </form>
          <form action={toggleNewsletterSend}>
            <input type="hidden" name="enabled" value={sendOn ? "false" : "true"} />
            <button
              type="submit"
              className="rounded-card border border-charcoal/20 px-4 py-2 text-sm text-charcoal/70 transition-colors hover:bg-charcoal/5"
            >
              {sendOn ? "Turn sending off" : "Turn sending on"}
            </button>
          </form>
        </div>
      </div>

      {issues.length === 0 && !dbError ? (
        <p className="mt-6 rounded-card border border-charcoal/10 bg-white p-5 text-sm text-charcoal/60">
          No issues yet. Build a draft to preview one.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {issues.map((iss) => (
            <div key={iss.id} className="rounded-card border border-charcoal/10 bg-white p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    iss.status === "sent"
                      ? "bg-mountain/15 text-mountain"
                      : "bg-copper/15 text-copper"
                  }`}
                >
                  {iss.status}
                </span>
                <span className="text-sm text-charcoal">{iss.subject}</span>
                {iss.status === "sent" && (
                  <span className="text-xs text-charcoal/50">
                    {iss.recipientCount} sent
                  </span>
                )}
              </div>
              {Array.isArray(iss.guardrailReasons) && iss.guardrailReasons.length > 0 && (
                <p className="mt-2 text-xs text-copper">
                  Held: {(iss.guardrailReasons as string[]).join(", ")}
                </p>
              )}
              <div className="mt-4 flex gap-3">
                <Link
                  href={`/admin/newsletter/${iss.id}`}
                  className="rounded-card border border-charcoal/20 px-4 py-2 text-sm text-charcoal/70 transition-colors hover:bg-charcoal/5"
                >
                  Preview
                </Link>
                {iss.status !== "sent" && sendOn && (
                  <form action={sendNewsletterIssue}>
                    <input type="hidden" name="id" value={iss.id} />
                    <button
                      type="submit"
                      className="rounded-card bg-mountain px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-charcoal"
                    >
                      Send to {subscribers}
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
