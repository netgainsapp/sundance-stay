import { describe, it, expect } from "vitest";
import { rankTopics, CORNERSTONE_SEEDS } from "@/lib/blog-engine/topics";
import { groundTopic } from "@/lib/blog-engine/grounding";
import { checkPost } from "@/lib/blog-engine/guardrails";
import { slugify, dedupeSlug, assembleBodyMd, CTA_TEXT } from "@/lib/blog-engine/assemble";
import type { BlogCatalog, CandidatePost, GeneratedDraft } from "@/lib/blog-engine/types";

const catalog: BlogCatalog = {
  neighborhoods: [
    { slug: "downtown", name: "Downtown Boulder", overview: "The lively center near the Pearl Street Mall.", highlights: ["Most walkable", "Near venues"] },
    { slug: "empty-area", name: "Empty Area", overview: "Nothing listed here yet.", highlights: [] },
  ],
  properties: [
    { neighborhoodSlug: "downtown", propertyType: "Loft", capacity: 4 },
    { neighborhoodSlug: "downtown", propertyType: "Condo", capacity: 6 },
  ],
  businesses: [
    { name: "Flatiron Car Service", category: "transportation", services: ["Airport transfers"] },
    { name: "Alpine Clean", category: "cleaning", services: ["Turnover cleaning"] },
  ],
  serviceCategories: [
    { slug: "transportation", name: "Transportation" },
    { slug: "photography", name: "Photography" },
  ],
};

describe("rankTopics", () => {
  it("creates a neighborhood topic only when homes exist", () => {
    const topics = rankTopics(catalog);
    expect(topics.some((t) => t.topicKey === "neighborhood:downtown")).toBe(true);
    expect(topics.some((t) => t.topicKey === "neighborhood:empty-area")).toBe(false);
  });
  it("creates a category topic only when businesses exist", () => {
    const topics = rankTopics(catalog);
    expect(topics.some((t) => t.topicKey === "category:transportation")).toBe(true);
    expect(topics.some((t) => t.topicKey === "category:photography")).toBe(false);
  });
  it("includes cornerstone seeds and drops already-used topics", () => {
    const topics = rankTopics(catalog, new Set(["neighborhood:downtown"]));
    expect(topics.some((t) => t.topicKey === "neighborhood:downtown")).toBe(false);
    expect(topics.some((t) => t.postType === "cornerstone")).toBe(true);
    expect(topics.length).toBeGreaterThanOrEqual(CORNERSTONE_SEEDS.length);
  });
  it("sorts by score descending", () => {
    const topics = rankTopics(catalog);
    for (let i = 1; i < topics.length; i++) {
      expect(topics[i - 1].score).toBeGreaterThanOrEqual(topics[i].score);
    }
  });
});

describe("groundTopic", () => {
  it("grounds a neighborhood topic with home facts and allowed entities", () => {
    const topic = rankTopics(catalog).find((t) => t.topicKey === "neighborhood:downtown")!;
    const g = groundTopic(topic, catalog);
    expect(g).not.toBeNull();
    expect(g!.facts.homeCount).toBe(2);
    expect(g!.allowedEntities).toContain("Downtown Boulder");
  });
  it("returns null for a thin neighborhood", () => {
    const g = groundTopic(
      { topicKey: "neighborhood:empty-area", label: "x", postType: "neighborhood", source: "neighborhood", score: 1 },
      catalog,
    );
    expect(g).toBeNull();
  });
  it("grounds a category topic with the real business names", () => {
    const g = groundTopic(
      { topicKey: "category:transportation", label: "x", postType: "category", source: "category", score: 1 },
      catalog,
    );
    expect(g!.allowedEntities).toContain("Flatiron Car Service");
    expect(g!.facts.businessCount).toBe(1);
  });
  it("grounds a cornerstone topic on fixed festival facts", () => {
    const g = groundTopic(CORNERSTONE_SEEDS[0], catalog);
    expect(g).not.toBeNull();
    expect(String(g!.facts.festivalWindow)).toContain("2027");
  });
});

describe("slug helpers + assembly", () => {
  it("slugifies a title", () => {
    expect(slugify("Staying in Downtown Boulder for Sundance 2027")).toBe(
      "staying-in-downtown-boulder-for-sundance-2027",
    );
  });
  it("dedupes a taken slug", () => {
    expect(dedupeSlug("foo", new Set(["foo"]))).toBe("foo-2");
    expect(dedupeSlug("foo", new Set(["foo", "foo-2"]))).toBe("foo-3");
  });
  it("assembles a lead, sections, and the CTA", () => {
    const draft: GeneratedDraft = {
      title: "T",
      excerpt: "An intro paragraph that sets the scene.",
      sections: [
        { heading: "One", body: "First section body." },
        { heading: "Two", body: "Second section body." },
      ],
      tags: ["a"],
    };
    const md = assembleBodyMd(draft);
    expect(md.startsWith("An intro paragraph")).toBe(true);
    expect(md).toContain("## One");
    expect(md).toContain(CTA_TEXT);
  });
});

function goodPost(over: Partial<CandidatePost> = {}): CandidatePost {
  const body = [
    "Boulder fills quickly when the festival arrives, and planning ahead is the surest way to land the right home for the week.",
    "## Why Plan Ahead",
    "The closest homes go first, so deciding early pays off for both choice and budget across the festival window.",
    "## Choosing an Area",
    "Each part of the city has its own rhythm, and matching it to your group makes the trip far smoother.",
    "## Getting Settled",
    "Confirm the essentials before you arrive so the first day is relaxed rather than rushed.",
    "Browse the homes available for the festival window on Sundance Stay Collective.",
  ].join("\n\n");
  return {
    topicKey: "neighborhood:downtown",
    postType: "neighborhood",
    title: "Staying in Downtown Boulder for Sundance",
    slug: "staying-in-downtown-boulder-for-sundance",
    excerpt: "How to plan a downtown stay.",
    bodyMd: body,
    tags: ["Sundance 2027"],
    ...over,
  };
}

describe("checkPost guardrails", () => {
  it("passes a clean, well-structured post", () => {
    const r = checkPost(goodPost(), { minWords: 50 });
    expect(r.ok).toBe(true);
    expect(r.reasons).toEqual([]);
  });
  it("flags an em dash", () => {
    const r = checkPost(goodPost({ bodyMd: goodPost().bodyMd + "\n\nThis is a problem — really." }));
    expect(r.ok).toBe(false);
    expect(r.reasons.join()).toMatch(/em or en dash/);
  });
  it("flags a price figure", () => {
    const r = checkPost(goodPost({ bodyMd: goodPost().bodyMd.replace("budget", "rate of $500") }));
    expect(r.reasons.join()).toMatch(/price/);
  });
  it("flags a missing call to action", () => {
    const r = checkPost(goodPost({ bodyMd: goodPost().bodyMd.replace(/Browse the homes[\s\S]*$/, "The end.") }));
    expect(r.reasons.join()).toMatch(/call to action/);
  });
  it("flags too few sections", () => {
    const r = checkPost(goodPost({ bodyMd: "Intro paragraph here about the festival.\n\n## Only One\n\nBody text. Browse the homes available for the festival window on Sundance Stay Collective." }));
    expect(r.reasons.join()).toMatch(/3 sections/);
  });
  it("flags a duplicate topic and slug", () => {
    const r = checkPost(goodPost(), {
      takenSlugs: new Set(["staying-in-downtown-boulder-for-sundance"]),
      usedTopicKeys: new Set(["neighborhood:downtown"]),
    });
    expect(r.reasons.join()).toMatch(/slug already exists/);
    expect(r.reasons.join()).toMatch(/topic already published/);
  });
  it("flags near-duplicate body content", () => {
    const r = checkPost(goodPost(), { recentBodies: [goodPost().bodyMd] });
    expect(r.reasons.join()).toMatch(/too similar/);
  });
  it("flags an invented phone number and URL", () => {
    const r = checkPost(goodPost({ bodyMd: goodPost().bodyMd + "\n\nCall 303 555 0142 or visit https://example.com today." }));
    expect(r.reasons.join()).toMatch(/phone number/);
    expect(r.reasons.join()).toMatch(/raw URL/);
  });
});
