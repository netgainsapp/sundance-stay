import type { GeneratedDraft } from "./types";

export const CTA_MARKER = "Browse the homes";
export const CTA_TEXT =
  "Planning a Boulder stay for the festival? Browse the homes available for the festival window on Boulder Film Collective.";

/** Kebab-case slug from a title, capped at 80 chars. */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

/** Ensures a unique slug against an already-taken set. */
export function dedupeSlug(base: string, taken: Set<string>): string {
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

/**
 * Assembles markdown-lite body from a model draft: a lead paragraph, then each
 * section as a "## heading" block, then the call to action. The output renders
 * directly through the shared ArticleBody renderer. Pure.
 */
export function assembleBodyMd(draft: GeneratedDraft): string {
  const lead = (draft.dek || draft.excerpt || "").trim();
  const body = draft.sections
    .map((s) => `## ${s.heading.trim()}\n\n${s.body.trim()}`)
    .join("\n\n");
  return [lead, body, CTA_TEXT].filter(Boolean).join("\n\n");
}
