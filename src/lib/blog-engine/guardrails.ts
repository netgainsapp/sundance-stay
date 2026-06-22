import type { CandidatePost, GuardrailResult } from "./types";
import { CTA_MARKER } from "./assemble";

export interface GuardrailOptions {
  minWords?: number;
  maxWords?: number;
  takenSlugs?: Set<string>;
  usedTopicKeys?: Set<string>;
  recentBodies?: string[];
  similarityThreshold?: number;
}

const BANNED_PHRASES = [
  /\bbest in the world\b/i,
  /\bguarantee(d|s)?\b/i,
  /\bcheapest\b/i,
  /\bnumber one\b/i,
  /#1\b/,
];
const MODEL_ARTIFACTS = [
  /\bas an ai\b/i,
  /\bas a language model\b/i,
  /\bin conclusion\b/i,
  /\bTBD\b/,
];

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function shingles(text: string, n = 3): Set<string> {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
  const out = new Set<string>();
  for (let i = 0; i + n <= words.length; i++) out.add(words.slice(i, i + n).join(" "));
  return out;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

/**
 * Gates a candidate post before publish. Any failure means the caller saves a
 * draft with these reasons, never publishes. Pure and exhaustively testable.
 */
export function checkPost(
  post: CandidatePost,
  opts: GuardrailOptions = {},
): GuardrailResult {
  const {
    minWords = 350,
    maxWords = 1500,
    takenSlugs = new Set(),
    usedTopicKeys = new Set(),
    recentBodies = [],
    similarityThreshold = 0.4,
  } = opts;
  const reasons: string[] = [];
  const body = post.bodyMd;

  // 1. Structure
  const words = wordCount(body);
  if (words < minWords) reasons.push(`too short (${words} words)`);
  if (words > maxWords) reasons.push(`too long (${words} words)`);
  const sectionCount = (body.match(/^##\s/gm) || []).length;
  if (sectionCount < 3) reasons.push(`needs at least 3 sections (has ${sectionCount})`);
  if (body.trimStart().startsWith("## ")) reasons.push("missing intro paragraph");
  if (!body.includes(CTA_MARKER)) reasons.push("missing call to action");

  // 2. Brand voice: zero dashes/hyphens in prose, no overclaim, no artifacts
  if (/[–—]/.test(body)) reasons.push("contains an em or en dash");
  if (/ - /.test(body)) reasons.push("contains a hyphen used as a dash");
  if (/[A-Za-z]-[A-Za-z]/.test(body)) reasons.push("contains a hyphenated word");
  if (post.title.length > 70) reasons.push("title over 70 characters");
  for (const re of BANNED_PHRASES) if (re.test(body)) reasons.push(`banned phrase: ${re.source}`);
  for (const re of MODEL_ARTIFACTS) if (re.test(body)) reasons.push(`model artifact: ${re.source}`);

  // 3. No prices (they change; never publish a number we did not verify)
  if (/\$\s?\d/.test(body)) reasons.push("contains a price figure");

  // 4. No invented contact details
  if (/[A-Za-z0-9._%+]+@[A-Za-z0-9.]+\.[A-Za-z]{2,}/.test(body)) reasons.push("contains an email address");
  if (/\b\d{3}[\s.]?\d{3}[\s.]?\d{4}\b/.test(body)) reasons.push("contains a phone number");
  if (/https?:\/\//i.test(body)) reasons.push("contains a raw URL");

  // 5. Dedupe
  if (takenSlugs.has(post.slug)) reasons.push("slug already exists");
  if (usedTopicKeys.has(post.topicKey)) reasons.push("topic already published");
  const sh = shingles(body);
  for (const prev of recentBodies) {
    if (jaccard(sh, shingles(prev)) > similarityThreshold) {
      reasons.push("too similar to a recent post");
      break;
    }
  }

  return { ok: reasons.length === 0, reasons };
}
