import { prisma } from "@/lib/prisma";
import { isAutopublishOn } from "@/lib/blog-flag";
import { blogPosts } from "@/content/blog";
import { loadCatalog } from "./catalog";
import { rankTopics } from "./topics";
import { groundTopic } from "./grounding";
import { generateDraft, generationAvailable } from "./generate";
import { assembleBodyMd, slugify, dedupeSlug } from "./assemble";
import { checkPost } from "./guardrails";
import type { CandidatePost, TopicCandidate } from "./types";

// Verified Boulder Unsplash IDs, assigned deterministically per slug.
const IMAGES = [
  "photo-1600104146011-ad1a8571f161",
  "photo-1449965408869-eaa3f722e40d",
  "photo-1414235077428-338989a2e8c0",
  "photo-1454496522488-7a8e488e8606",
  "photo-1502602898657-3e91760cbb34",
  "photo-1484154218962-a197022b5858",
];

function imageFor(seed: string): string {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return `https://images.unsplash.com/${IMAGES[h % IMAGES.length]}?w=1400&q=80`;
}

export type RunResult = {
  status: "no_key" | "no_topic" | "thin" | "published" | "draft" | "error";
  slug?: string;
  reasons?: string[];
};

async function markTopic(topic: TopicCandidate, status: "used" | "skipped_thin") {
  await prisma.blogTopic.upsert({
    where: { topicKey: topic.topicKey },
    update: { status, lastAttemptAt: new Date() },
    create: {
      topicKey: topic.topicKey,
      label: topic.label,
      postType: topic.postType,
      source: topic.source,
      score: topic.score,
      status,
      lastAttemptAt: new Date(),
    },
  });
}

/**
 * One engine pass: pick the top unused topic, ground it, generate, run
 * guardrails, then publish (only if the kill switch is on and every gate
 * passes) or save a draft with reasons. Returns a status for the caller.
 */
export async function runOnce(): Promise<RunResult> {
  if (!generationAvailable()) return { status: "no_key" };

  const catalog = loadCatalog();
  const [genPosts, topicRows] = await Promise.all([
    prisma.generatedPost.findMany({
      select: { slug: true, topicKey: true, status: true, bodyMd: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.blogTopic.findMany({ select: { topicKey: true, status: true } }),
  ]);

  const usedKeys = new Set<string>([
    ...genPosts.map((p) => p.topicKey),
    ...topicRows.filter((t) => t.status !== "candidate").map((t) => t.topicKey),
  ]);

  const candidates = rankTopics(catalog, usedKeys);
  if (candidates.length === 0) return { status: "no_topic" };
  const topic = candidates[0];

  const grounded = groundTopic(topic, catalog);
  if (!grounded) {
    await markTopic(topic, "skipped_thin");
    return { status: "thin" };
  }

  const draft = await generateDraft(grounded);
  if (!draft) return { status: "no_key" };

  const bodyMd = assembleBodyMd(draft);
  const takenSlugs = new Set<string>([
    ...blogPosts.map((p) => p.slug),
    ...genPosts.map((p) => p.slug),
  ]);
  const slug = dedupeSlug(slugify(draft.title), takenSlugs);
  const candidate: CandidatePost = {
    topicKey: topic.topicKey,
    postType: topic.postType,
    title: draft.title,
    slug,
    excerpt: draft.excerpt,
    bodyMd,
    tags: draft.tags,
  };

  const gate = checkPost(candidate, {
    takenSlugs,
    usedTopicKeys: new Set(
      genPosts.filter((p) => p.status === "published").map((p) => p.topicKey),
    ),
    recentBodies: genPosts.map((p) => p.bodyMd),
  });

  const publish = gate.ok && (await isAutopublishOn());

  await prisma.generatedPost.create({
    data: {
      slug,
      title: draft.title,
      dek: draft.dek ?? null,
      excerpt: draft.excerpt,
      bodyMd,
      postType: topic.postType,
      status: publish ? "published" : "draft",
      topicKey: topic.topicKey,
      dataSnapshot: grounded.facts,
      seoTitle: draft.seoTitle ?? null,
      seoDescription: draft.seoDescription ?? null,
      tags: draft.tags,
      guardrailReasons: gate.ok ? undefined : gate.reasons,
      featuredImage: imageFor(slug),
      publishedAt: publish ? new Date() : null,
    },
  });
  await markTopic(topic, "used");

  return {
    status: publish ? "published" : "draft",
    slug,
    reasons: gate.ok ? undefined : gate.reasons,
  };
}
