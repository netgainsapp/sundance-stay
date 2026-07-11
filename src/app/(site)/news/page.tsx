import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { allNews } from "@/content/news";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Festival Season News",
  description:
    "Dated, source attributed coverage of Sundance Film Festival preparations in Boulder: lodging, venues, city decisions, and festival announcements ahead of January 2027.",
  path: "/news",
});

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function NewsPage() {
  const items = allNews();

  return (
    <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "News", path: "/news" },
        ])}
      />

      <p className="text-xs font-medium uppercase tracking-[0.2em] text-copper">
        Boulder, Colorado
      </p>
      <h1 className="mt-3 font-heading text-4xl text-charcoal md:text-5xl">
        Festival Season News
      </h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-charcoal/70">
        What is actually happening as Boulder prepares to host the Sundance Film
        Festival in January 2027. Every story is dated and cites its sources.
      </p>

      <div className="mt-12 space-y-8">
        {items.map((item) => (
          <article
            key={item.slug}
            className="rounded-card border border-charcoal/10 bg-white p-6 transition-shadow hover:shadow-md md:p-8"
          >
            <div className="flex items-center gap-3 text-xs text-charcoal/50">
              <span className="font-medium uppercase tracking-[0.15em] text-copper">
                {item.category}
              </span>
              <span>{formatDate(item.publishedAt)}</span>
            </div>
            <h2 className="mt-3 font-heading text-2xl text-charcoal">
              <Link
                href={`/news/${item.slug}`}
                className="transition-colors hover:text-mountain"
              >
                {item.title}
              </Link>
            </h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-charcoal/70">
              {item.excerpt}
            </p>
            <Link
              href={`/news/${item.slug}`}
              className="mt-4 inline-block text-sm font-medium text-mountain underline"
            >
              Read the story
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
