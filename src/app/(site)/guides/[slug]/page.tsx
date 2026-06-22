import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GuideCard } from "@/components/cards/GuideCard";
import { guides, getGuide } from "@/content/guides";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) {
    return pageMetadata({
      title: "Guide not found",
      description: "The guide you are looking for is not available.",
      path: `/guides/${slug}`,
    });
  }
  return pageMetadata({
    title: guide.title,
    description: guide.excerpt,
    path: `/guides/${guide.slug}`,
    image: guide.featuredImage,
  });
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const blocks = guide.content.trim().split(/\n\n+/);
  const related = guide.relatedSlugs
    .map((s) => getGuide(s))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));

  return (
    <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
      <div className="relative aspect-[21/9] w-full overflow-hidden rounded-card">
        <Image
          src={guide.featuredImage}
          alt={guide.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-copper">
            {guide.category}
          </p>
          <h1 className="max-w-3xl font-heading text-3xl text-white md:text-5xl">
            {guide.title}
          </h1>
        </div>
      </div>

      <article className="mx-auto mt-12 max-w-prose">
        {blocks.map((block, i) => {
          const trimmed = block.trim();
          if (trimmed.startsWith("## ")) {
            return (
              <h2
                key={i}
                className="mt-12 font-heading text-2xl text-charcoal first:mt-0"
              >
                {trimmed.slice(3).trim()}
              </h2>
            );
          }
          const lines = trimmed.split(/\n/);
          if (lines.every((l) => l.trim().startsWith("- "))) {
            return (
              <ul key={i} className="mt-5 space-y-2">
                {lines.map((l, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 leading-relaxed text-charcoal/80"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-copper"
                    />
                    <span>{l.trim().slice(2)}</span>
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p
              key={i}
              className={`leading-relaxed text-charcoal/80 ${
                i === 0 ? "text-lg" : "mt-5"
              }`}
            >
              {trimmed}
            </p>
          );
        })}

        <div className="mt-12 rounded-card bg-sand/20 p-6 text-center">
          <p className="text-sm text-charcoal/70">
            This guide is supported by Boulder area partners.
          </p>
          <Link
            href="/advertise"
            className="mt-2 inline-block text-sm font-medium text-mountain underline"
          >
            Become a sponsor
          </Link>
        </div>
      </article>

      {related.length > 0 && (
        <div className="mt-[var(--space-section)]">
          <SectionHeader title="Related guides" />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {related.map((g) => (
              <GuideCard key={g.slug} guide={g} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
