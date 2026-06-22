import type {
  BlogCatalog,
  GroundedData,
  TopicCandidate,
} from "./types";

// Base proper nouns any post may reference (fixed, verified facts).
const BASE_ENTITIES = ["Boulder", "Sundance Film Festival", "Colorado"];
export const FESTIVAL_WINDOW = "January 21 to 31, 2027";

/**
 * Builds the grounded fact set for a topic from owned catalog data. Returns
 * null when the grounding is too thin (the "no grounding, no post" rule), so
 * the caller skips the topic instead of letting the model invent material.
 * Pure and deterministic.
 */
export function groundTopic(
  topic: TopicCandidate,
  catalog: BlogCatalog,
): GroundedData | null {
  if (topic.postType === "neighborhood") {
    const slug = topic.topicKey.replace("neighborhood:", "");
    const n = catalog.neighborhoods.find((x) => x.slug === slug);
    if (!n) return null;
    const homes = catalog.properties.filter((p) => p.neighborhoodSlug === slug);
    if (homes.length < 1) return null;
    const homeTypes = Array.from(new Set(homes.map((h) => h.propertyType)));
    const maxCapacity = Math.max(...homes.map((h) => h.capacity));
    return {
      topicKey: topic.topicKey,
      postType: topic.postType,
      summary: n.overview,
      facts: {
        neighborhood: n.name,
        overview: n.overview,
        highlights: n.highlights,
        homeCount: homes.length,
        homeTypes,
        maxCapacity,
        festivalWindow: FESTIVAL_WINDOW,
      },
      allowedEntities: [...BASE_ENTITIES, n.name, ...n.highlights],
    };
  }

  if (topic.postType === "category") {
    const slug = topic.topicKey.replace("category:", "");
    const c = catalog.serviceCategories.find((x) => x.slug === slug);
    if (!c) return null;
    const list = catalog.businesses.filter((b) => b.category === slug);
    if (list.length < 1) return null;
    const services = Array.from(new Set(list.flatMap((b) => b.services))).slice(
      0,
      8,
    );
    return {
      topicKey: topic.topicKey,
      postType: topic.postType,
      summary: `Real ${c.name.toLowerCase()} options serving Boulder for the festival window.`,
      facts: {
        category: c.name,
        businessCount: list.length,
        services,
        festivalWindow: FESTIVAL_WINDOW,
      },
      allowedEntities: [...BASE_ENTITIES, c.name, ...list.map((b) => b.name)],
    };
  }

  // Cornerstone: grounded only in fixed festival facts.
  return {
    topicKey: topic.topicKey,
    postType: topic.postType,
    summary:
      "The Sundance Film Festival moves to Boulder, Colorado, with its first edition running " +
      FESTIVAL_WINDOW +
      ".",
    facts: { festivalWindow: FESTIVAL_WINDOW },
    allowedEntities: [...BASE_ENTITIES, "Park City", "Pearl Street Mall"],
  };
}
