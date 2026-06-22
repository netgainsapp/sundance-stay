import { SITE } from "@/lib/site";
import { allBlogEntries } from "@/content/blog-feed";
import { activeAdvertisers } from "@/content/advertisers";
import { featuredProperties } from "@/content/properties";
import { assembleNewsletter } from "./assemble";
import { renderNewsletterHtml, renderNewsletterText } from "./render";
import { checkNewsletter } from "./guardrails";
import { generateIntro } from "./generate-intro";
import type { NewsletterContent, NewsletterGuardrailResult } from "./types";

export interface BuiltIssue {
  content: NewsletterContent;
  html: string;
  text: string;
  gate: NewsletterGuardrailResult;
}

/** Assembles a full newsletter issue from current owned content and advertiser
 * assets. Deterministic except for the optional model intro. */
export async function buildIssue(): Promise<BuiltIssue> {
  const entries = await allBlogEntries();
  const posts = entries.slice(0, 3).map((p) => ({
    title: p.title,
    excerpt: p.excerpt,
    href: `/blog/${p.slug}`,
    image: p.featuredImage,
  }));

  const advertisers = activeAdvertisers().map((a) => ({
    name: a.name,
    blurb: a.blurb,
    logo: a.logo,
    coverImage: a.coverImage,
    href: a.href,
  }));

  const stays = featuredProperties()
    .slice(0, 3)
    .map((p) => ({
      title: p.title,
      summary: p.summary,
      href: `/stay/${p.slug}`,
      image: p.images[0]?.url ?? "",
    }));

  const intro = await generateIntro({
    postTitles: posts.map((p) => p.title),
    advertiserNames: advertisers.map((a) => a.name),
  });

  const content = assembleNewsletter({
    posts,
    advertisers,
    stays,
    ...(intro ? { intro } : {}),
  });
  const html = renderNewsletterHtml(content, { siteUrl: SITE.url });
  const text = renderNewsletterText(content, { siteUrl: SITE.url });
  const gate = checkNewsletter(content, html);
  return { content, html, text, gate };
}
