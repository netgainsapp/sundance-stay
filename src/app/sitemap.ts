import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { properties } from "@/content/properties";
import { businesses } from "@/content/businesses";
import { guides } from "@/content/guides";
import { blogPosts } from "@/content/blog";
import { serviceCategories } from "@/content/services";
import { newsItems } from "@/content/news";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const staticRoutes = [
    "",
    "/stay",
    "/last-minute",
    "/neighborhoods",
    "/services",
    "/concierge",
    "/list-your-home",
    "/guides",
    "/blog",
    "/news",
    "/advertise",
    "/contact",
  ];
  const urls: MetadataRoute.Sitemap = staticRoutes.map((r) => ({ url: `${base}${r}` }));
  for (const p of properties) urls.push({ url: `${base}/stay/${p.slug}` });
  for (const b of businesses) urls.push({ url: `${base}/business/${b.slug}` });
  for (const g of guides) urls.push({ url: `${base}/guides/${g.slug}` });
  for (const p of blogPosts) urls.push({ url: `${base}/blog/${p.slug}` });
  for (const c of serviceCategories) urls.push({ url: `${base}/services/${c.slug}` });
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
