import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/content/ArticleBody";
import { JsonLd } from "@/components/seo/JsonLd";
import { allNews, getNewsItem, newsSlugs } from "@/content/news";
import { pageMetadata, newsArticleJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return newsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getNewsItem(slug);
  if (!item) {
    return pageMetadata({
      title: "Story not found",
      description: "The news story you are looking for is not available.",
      path: `/news/${slug}`,
    });
  }
  return pageMetadata({
    title: item.title,
    description: item.excerpt,
    path: `/news/${item.slug}`,
  });
}

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getNewsItem(slug);
  if (!item) notFound();

  const related = allNews()
    .filter((n) => n.slug !== item.slug)
    .slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
      <JsonLd
        data={[
          newsArticleJsonLd({
            title: item.title,
            description: item.excerpt,
            path: `/news/${item.slug}`,
            datePublished: item.publishedAt,
            dateModified: item.updatedAt,
            sourceUrls: item.sources.map((s) => s.url),
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "News", path: "/news" },
            { name: item.title, path: `/news/${item.slug}` },
          ]),
        ]}
      />

      <article className="mx-auto max-w-prose">
        <div className="flex items-center gap-3 text-xs text-charcoal/50">
          <span className="font-medium uppercase tracking-[0.15em] text-copper">
            {item.category}
          </span>
          <span>{formatDate(item.publishedAt)}</span>
          {item.updatedAt && <span>Updated {formatDate(item.updatedAt)}</span>}
        </div>

        <h1 className="mt-4 font-heading text-3xl text-charcoal md:text-4xl">
          {item.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-charcoal/70">
          {item.excerpt}
        </p>

        <div className="mt-8">
          <ArticleBody content={item.content} />
        </div>

        <div className="mt-10 rounded-card bg-sand/20 p-6">
          <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-charcoal/60">
            Sources
          </h2>
          <ul className="mt-3 space-y-2">
            {item.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-mountain underline"
                >
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 rounded-card border border-charcoal/10 p-6 text-center">
          <p className="text-sm text-charcoal/70">
            Planning a Boulder stay for Festival Season?
          </p>
          <Link
            href="/"
            className="mt-2 inline-block text-sm font-medium text-mountain underline"
          >
            Join the Boulder Film Collective list
          </Link>
        </div>
      </article>

      {related.length > 0 && (
        <div className="mx-auto mt-[var(--space-section)] max-w-prose">
          <h2 className="font-heading text-2xl text-charcoal">More news</h2>
          <ul className="mt-4 space-y-3">
            {related.map((n) => (
              <li key={n.slug}>
                <Link
                  href={`/news/${n.slug}`}
                  className="text-mountain underline"
                >
                  {n.title}
                </Link>
                <span className="ml-2 text-xs text-charcoal/50">
                  {formatDate(n.publishedAt)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
