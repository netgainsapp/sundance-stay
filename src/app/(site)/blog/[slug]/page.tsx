import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BlogCard } from "@/components/cards/BlogCard";
import { ArticleBody } from "@/components/content/ArticleBody";
import { JsonLd } from "@/components/seo/JsonLd";
import { blogPosts, getBlogPost } from "@/content/blog";
import {
  pageMetadata,
  articleJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
} from "@/lib/seo";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) {
    return pageMetadata({
      title: "Article not found",
      description: "The article you are looking for is not available.",
      path: `/blog/${slug}`,
    });
  }
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.featuredImage,
  });
}

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = (post.relatedSlugs ?? [])
    .map((s) => getBlogPost(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const structured: object[] = [
    articleJsonLd({
      title: post.title,
      description: post.excerpt,
      path: `/blog/${post.slug}`,
      image: post.featuredImage,
      datePublished: post.publishedAt,
      authorName: post.author,
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
  ];
  if (post.faqs && post.faqs.length > 0) {
    structured.push(faqPageJsonLd(post.faqs));
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
      <JsonLd data={structured} />

      <div className="relative aspect-[21/9] w-full overflow-hidden rounded-card">
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-copper">
            {post.category}
          </p>
          <h1 className="max-w-3xl font-heading text-3xl text-white md:text-5xl">
            {post.title}
          </h1>
        </div>
      </div>

      <article className="mx-auto mt-10 max-w-prose">
        <p className="text-sm text-charcoal/50">
          {post.author} · {formatDate(post.publishedAt)}
        </p>
        <div className="mt-8">
          <ArticleBody content={post.content} />
        </div>

        {post.faqs && post.faqs.length > 0 && (
          <div className="mt-12">
            <h2 className="font-heading text-2xl text-charcoal">
              Frequently asked questions
            </h2>
            <dl className="mt-4 space-y-5">
              {post.faqs.map((f) => (
                <div key={f.q}>
                  <dt className="font-medium text-charcoal">{f.q}</dt>
                  <dd className="mt-1 leading-relaxed text-charcoal/80">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className="mt-12 rounded-card bg-sand/20 p-6 text-center">
          <p className="text-sm text-charcoal/70">
            Planning a Boulder stay for the festival?
          </p>
          <Link
            href="/stay"
            className="mt-2 inline-block text-sm font-medium text-mountain underline"
          >
            Browse homes for the festival window
          </Link>
        </div>
      </article>

      {related.length > 0 && (
        <div className="mt-[var(--space-section)]">
          <SectionHeader title="Keep reading" />
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
