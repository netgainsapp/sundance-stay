import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { properties } from "@/content/properties";
import { businesses } from "@/content/businesses";
import { guides } from "@/content/guides";
import { serviceCategories } from "@/content/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const staticRoutes = [
    "",
    "/stay",
    "/services",
    "/list-your-home",
    "/guides",
    "/advertise",
    "/contact",
  ];
  const urls: MetadataRoute.Sitemap = staticRoutes.map((r) => ({ url: `${base}${r}` }));
  for (const p of properties) urls.push({ url: `${base}/stay/${p.slug}` });
  for (const b of businesses) urls.push({ url: `${base}/business/${b.slug}` });
  for (const g of guides) urls.push({ url: `${base}/guides/${g.slug}` });
  for (const c of serviceCategories) urls.push({ url: `${base}/services/${c.slug}` });
  return urls;
}
