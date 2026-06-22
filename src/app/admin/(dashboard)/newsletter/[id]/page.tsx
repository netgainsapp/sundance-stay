import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UNSUBSCRIBE_PLACEHOLDER } from "@/lib/newsletter/render";

export const dynamic = "force-dynamic";

export default async function NewsletterPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const issue = await prisma.newsletterIssue.findUnique({ where: { id } });
  if (!issue) notFound();

  const html = issue.bodyHtml.split(UNSUBSCRIBE_PLACEHOLDER).join("#");

  return (
    <div>
      <Link href="/admin/newsletter" className="text-sm text-mountain underline">
        Back to newsletter
      </Link>
      <h1 className="mt-3 font-heading text-2xl text-charcoal">{issue.subject}</h1>
      <p className="mt-1 text-sm text-charcoal/60">{issue.previewText}</p>
      <div className="mt-6 overflow-hidden rounded-card border border-charcoal/10">
        <iframe
          sandbox=""
          srcDoc={html}
          title="Newsletter preview"
          className="h-[80vh] w-full bg-white"
        />
      </div>
    </div>
  );
}
