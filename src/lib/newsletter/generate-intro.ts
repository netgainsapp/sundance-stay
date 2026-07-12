import { generateText } from "ai";

const MODEL = process.env.BLOG_MODEL ?? "anthropic/claude-sonnet-4-6";

/**
 * Optional model-written intro for a newsletter issue. Returns null when no
 * gateway key is set, so the engine falls back to the templated default and
 * works fully without a model. Brand voice: zero dashes or hyphens.
 */
export async function generateIntro(ctx: {
  postTitles: string[];
  advertiserNames: string[];
}): Promise<string | null> {
  if (!process.env.AI_GATEWAY_API_KEY) return null;
  try {
    const { text } = await generateText({
      model: MODEL,
      system:
        "You write a warm two sentence intro for the Boulder Film Collective email newsletter about the Sundance Film Festival's first Boulder edition, January 21 to 31, 2027. Use ZERO dashes and hyphens of any kind. Do not include prices, links, or quotation marks. Keep it under 55 words.",
      prompt: [
        "Posts featured this issue: " + (ctx.postTitles.join("; ") || "none"),
        "Local partners featured: " + (ctx.advertiserNames.join("; ") || "none"),
        "Write the intro.",
      ].join("\n"),
    });
    return text.trim();
  } catch {
    return null;
  }
}
