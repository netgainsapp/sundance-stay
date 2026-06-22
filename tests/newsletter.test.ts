import { describe, it, expect } from "vitest";
import { assembleNewsletter } from "@/lib/newsletter/assemble";
import {
  renderNewsletterHtml,
  renderNewsletterText,
  UNSUBSCRIBE_PLACEHOLDER,
} from "@/lib/newsletter/render";
import { checkNewsletter } from "@/lib/newsletter/guardrails";
import type { AdvertiserBlock, PostBlock, StayBlock } from "@/lib/newsletter/types";

const advertiser: AdvertiserBlock = {
  name: "Flatiron Car Service",
  blurb: "Premium airport transfers across Boulder County.",
  logo: "https://img/logo.jpg",
  coverImage: "https://img/cover.jpg",
  href: "/business/flatiron-car-service",
};
const post: PostBlock = {
  title: "Where to Stay for Sundance",
  excerpt: "How to plan a downtown stay.",
  href: "/blog/where-to-stay",
  image: "https://img/post.jpg",
};
const stay: StayBlock = {
  title: "Pearl Street Penthouse",
  summary: "A downtown loft for festival week.",
  href: "/stay/pearl-street-penthouse",
  image: "https://img/stay.jpg",
};

const opts = { siteUrl: "https://sundancestay.example" };

describe("assembleNewsletter", () => {
  it("bounds each section and uses the default intro", () => {
    const content = assembleNewsletter({
      posts: Array(5).fill(post),
      advertisers: Array(6).fill(advertiser),
      stays: Array(5).fill(stay),
    });
    expect(content.posts.length).toBe(3);
    expect(content.advertisers.length).toBe(4);
    expect(content.stays.length).toBe(3);
    expect(content.intro).toMatch(/2027/);
  });
  it("keeps a provided intro", () => {
    const content = assembleNewsletter({ posts: [post], advertisers: [], stays: [], intro: "Custom intro." });
    expect(content.intro).toBe("Custom intro.");
  });
});

describe("renderNewsletterHtml", () => {
  const content = assembleNewsletter({ posts: [post], advertisers: [advertiser], stays: [stay] });
  const html = renderNewsletterHtml(content, opts);
  it("pulls in advertiser assets (cover image, logo, name)", () => {
    expect(html).toContain("Flatiron Car Service");
    expect(html).toContain("https://img/cover.jpg");
    expect(html).toContain("https://img/logo.jpg");
  });
  it("links posts and stays with absolute urls", () => {
    expect(html).toContain("https://sundancestay.example/blog/where-to-stay");
    expect(html).toContain("https://sundancestay.example/stay/pearl-street-penthouse");
  });
  it("includes the unsubscribe placeholder for the sender to fill", () => {
    expect(html).toContain(UNSUBSCRIBE_PLACEHOLDER);
  });
  it("text version lists sections and unsubscribe", () => {
    const text = renderNewsletterText(content, opts);
    expect(text).toContain("Flatiron Car Service");
    expect(text).toContain(UNSUBSCRIBE_PLACEHOLDER);
  });
});

describe("checkNewsletter guardrails", () => {
  const content = assembleNewsletter({ posts: [post], advertisers: [advertiser], stays: [stay] });
  const html = renderNewsletterHtml(content, opts);
  it("passes a clean issue", () => {
    expect(checkNewsletter(content, html).ok).toBe(true);
  });
  it("flags an em dash in the subject", () => {
    const bad = { ...content, subject: "A great issue — really" };
    expect(checkNewsletter(bad, html).reasons.join()).toMatch(/em or en dash/);
  });
  it("flags an issue with no content blocks", () => {
    const empty = assembleNewsletter({ posts: [], advertisers: [], stays: [] });
    const emptyHtml = renderNewsletterHtml(empty, opts);
    expect(checkNewsletter(empty, emptyHtml).reasons.join()).toMatch(/no content blocks/);
  });
  it("flags a body missing the unsubscribe link", () => {
    expect(checkNewsletter(content, "<p>no footer</p>").reasons.join()).toMatch(/unsubscribe/);
  });
});
