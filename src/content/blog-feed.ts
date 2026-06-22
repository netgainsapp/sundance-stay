import type { BlogPost } from "@/content/types";
import { blogPosts, getBlogPost } from "@/content/blog";
import { prisma } from "@/lib/prisma";
import type { GeneratedPost } from "@/generated/prisma/client";

const TYPE_CATEGORY: Record<string, string> = {
  neighborhood: "Neighborhoods",
  category: "Boulder Services",
  cornerstone: "Sundance 2027",
};

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Maps a published generated post into the shared BlogPost shape so it renders
 * through the same pages and cards as the curated posts. */
function mapGenerated(p: GeneratedPost): BlogPost {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: TYPE_CATEGORY[p.postType] ?? "Boulder",
    featuredImage: p.featuredImage,
    content: p.bodyMd,
    author: "The Sundance Stay Collective Team",
    publishedAt: isoDate(p.publishedAt ?? p.createdAt),
    tags: Array.isArray(p.tags) ? (p.tags as string[]) : [],
  };
}

/** All published posts: curated file posts plus published generated posts. */
export async function allBlogEntries(): Promise<BlogPost[]> {
  let generated: BlogPost[] = [];
  try {
    const rows = await prisma.generatedPost.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: 200,
    });
    generated = rows.map(mapGenerated);
  } catch {
    generated = [];
  }
  return [...blogPosts, ...generated].sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : -1,
  );
}

/** A single post by slug: curated first, then a published generated post. */
export async function getBlogEntry(slug: string): Promise<BlogPost | null> {
  const curated = getBlogPost(slug);
  if (curated) return curated;
  try {
    const p = await prisma.generatedPost.findFirst({
      where: { slug, status: "published" },
    });
    if (p) return mapGenerated(p);
  } catch {
    return null;
  }
  return null;
}

/** Slugs of the curated posts, for static prerendering. */
export function curatedSlugs(): string[] {
  return blogPosts.map((p) => p.slug);
}
