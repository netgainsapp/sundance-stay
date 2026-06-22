import { SectionHeader } from "@/components/ui/SectionHeader";
import { BlogCard } from "@/components/cards/BlogCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { allBlogEntries } from "@/content/blog-feed";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Boulder and Sundance 2027 Blog",
  description:
    "Guides, tips, and planning for the Sundance Film Festival's move to Boulder. Lodging, travel, dining, and making the most of festival week.",
  path: "/blog",
});

export default async function BlogIndexPage() {
  const posts = await allBlogEntries();

  return (
    <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <SectionHeader
        eyebrow="Blog"
        title="Planning Boulder and Sundance 2027"
        intro="Practical guides and local knowledge for the Sundance Film Festival's first Boulder edition. Where to stay, how to get around, and how to make the most of festival week."
      />
      {posts.length === 0 ? (
        <p className="mt-12 rounded-card border border-charcoal/10 p-6 text-sm text-charcoal/60">
          New articles are on the way.
        </p>
      ) : (
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
