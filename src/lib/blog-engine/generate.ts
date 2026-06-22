import { generateObject } from "ai";
import { z } from "zod";
import type { GroundedData, GeneratedDraft } from "./types";

const DraftSchema = z.object({
  title: z.string(),
  dek: z.string().optional(),
  excerpt: z.string(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  sections: z
    .array(z.object({ heading: z.string(), body: z.string() }))
    .min(3),
  tags: z.array(z.string()),
});

// AI SDK resolves a plain "provider/model" string through the Vercel AI Gateway
// when AI_GATEWAY_API_KEY is set. Default to the latest Sonnet.
const MODEL = process.env.BLOG_MODEL ?? "anthropic/claude-sonnet-4-6";

/** True only when the gateway key is configured. Lets the engine ship dormant. */
export function generationAvailable(): boolean {
  return Boolean(process.env.AI_GATEWAY_API_KEY);
}

const SYSTEM = [
  "You are the staff writer for Sundance Stay Collective, a Boulder Colorado lodging and local resource site for the Sundance Film Festival's first Boulder edition, January 21 to 31, 2027.",
  "Write a genuinely useful, specific travel article in a warm, grounded, trustworthy voice for a United States audience.",
  "STRICT BRAND VOICE: use ZERO dashes and ZERO hyphens of any kind. No em dashes, no en dashes, no hyphen used as a dash, and no hyphenated compound words. Write compounds open, for example 'farm to table', 'last minute', 'world class'.",
  "Do NOT include any price or dollar figure. Do NOT include email addresses, phone numbers, or web URLs.",
  "Only name businesses, places, or landmarks that appear in the provided allowed entities list. Never invent a business, place, statistic, or fact.",
  "Do not overclaim (no 'best in the world', 'guaranteed', 'cheapest'). Do not mention being an AI. Do not write 'in conclusion'.",
  "Write at least three sections of real substance. Keep the title under 70 characters.",
].join("\n");

function buildPrompt(g: GroundedData): string {
  return [
    `Topic type: ${g.postType}`,
    `Summary to build on: ${g.summary}`,
    `Grounded facts (write around these, do not contradict them):`,
    JSON.stringify(g.facts, null, 2),
    `Allowed entities (the ONLY proper nouns you may name): ${g.allowedEntities.join(", ")}`,
    "Write the article now. Put a one sentence hook in 'dek' and a one sentence summary in 'excerpt'.",
  ].join("\n\n");
}

/** Generates a draft for a grounded topic. Returns null when no model key is set. */
export async function generateDraft(
  grounded: GroundedData,
): Promise<GeneratedDraft | null> {
  if (!generationAvailable()) return null;
  const { object } = await generateObject({
    model: MODEL,
    schema: DraftSchema,
    system: SYSTEM,
    prompt: buildPrompt(grounded),
  });
  return object;
}
