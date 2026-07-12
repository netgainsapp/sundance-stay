import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Regenerate hourly so engine-published posts appear without relying on
// revalidatePath, which does not reliably reach metadata routes.
export const revalidate = 3600;
import { businesses } from "@/content/businesses";
import { guides } from "@/content/guides";
import { blogPosts } from "@/content/blog";
import { newsItems } from "@/content/news";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  // Only public (non waitlist-gated) routes belong in the sitemap. Gated
  // marketplace routes 307 to the homepage for crawlers, which Search Console
  // reports as redirect errors.
  const staticRoutes = ["", "/guides", "/blog", "/news"];
  const urls: MetadataRoute.Sitemap = staticRoutes.map((r) => ({ url: `${base}${r}` }));
  for (const b of businesses) urls.push({ url: `${base}/business/${b.slug}` });
  for (const g of guides) urls.push({ url: `${base}/guides/${g.slug}` });
  for (const p of blogPosts) urls.push({ url: `${base}/blog/${p.slug}` });
  for (const n of newsItems)
    urls.push({ url: `${base}/news/${n.slug}`, lastModified: n.updatedAt ?? n.publishedAt });
  try {
    const generated = await prisma.generatedPost.findMany({
      where: { status: "published" },
      select: { slug: true },
    });
    for (const p of generated) urls.push({ url: `${base}/blog/${p.slug}` });
  } catch {
    // No database connected; curated blog URLs still ship.
  }
  return urls;
}
