import type { BlogCatalog, TopicCandidate } from "./types";

// Evergreen score floor: cornerstones always outrank data posts so the engine
// runs them first (the evergreen-first strategy). Distinct from the curated
// posts already in src/content/blog.ts to avoid duplicate coverage.
const EVERGREEN_SCORE = 1000;

const CORNERSTONE_LABELS: [string, string][] = [
  ["getting-around-festival-week", "Getting around Boulder during festival week"],
  ["what-to-pack-january-festival", "What to pack for a January festival trip to Boulder"],
  ["walkable-vs-quiet-stay", "Choosing a walkable stay or a quiet one for the festival"],
  ["planning-a-group-trip", "Planning a group trip to the Boulder festival"],
  ["reservation-strategy-festival-week", "A reservation strategy for festival week in Boulder"],
  ["car-free-festival-boulder", "Doing the festival in Boulder without a car"],
  ["working-remotely-during-festival", "Working remotely from Boulder during the festival"],
  ["wellness-and-downtime", "Wellness and downtime between festival screenings"],
  ["altitude-and-staying-healthy", "Altitude and staying healthy at a mile high festival"],
  ["evenings-out-festival-week", "Evenings out in Boulder during festival week"],
];

/** Cornerstone positioning topics, grounded only in fixed festival facts. */
export const CORNERSTONE_SEEDS: TopicCandidate[] = CORNERSTONE_LABELS.map(
  ([key, label], i) => ({
    topicKey: `cornerstone:${key}`,
    label,
    postType: "cornerstone",
    source: "seed",
    score: EVERGREEN_SCORE - i,
  }),
);

/**
 * Ranks blog topics. Cornerstone (evergreen) seeds always come first. Data
 * posts (neighborhood, category) are only included when includeDataPosts is on
 * (the blog_data_posts flag), and only when the catalog has real backing: a
 * neighborhood needs at least one listed home, a category at least one
 * business. Topics in existingKeys are dropped. Pure and deterministic.
 */
export function rankTopics(
  catalog: BlogCatalog,
  existingKeys: Set<string> = new Set(),
  includeDataPosts = true,
): TopicCandidate[] {
  const out: TopicCandidate[] = [...CORNERSTONE_SEEDS];

  if (includeDataPosts) {
    for (const n of catalog.neighborhoods) {
      const homes = catalog.properties.filter(
        (p) => p.neighborhoodSlug === n.slug,
      ).length;
      if (homes <= 0) continue;
      out.push({
        topicKey: `neighborhood:${n.slug}`,
        label: `Staying in ${n.name} for Sundance 2027`,
        postType: "neighborhood",
        source: "neighborhood",
        score: 60 + homes * 5,
      });
    }

    for (const c of catalog.serviceCategories) {
      const count = catalog.businesses.filter(
        (b) => b.category === c.slug,
      ).length;
      if (count <= 0) continue;
      out.push({
        topicKey: `category:${c.slug}`,
        label: `${c.name} in Boulder for festival week`,
        postType: "category",
        source: "category",
        score: 40 + count * 3,
      });
    }
  }

  return out
    .filter((t) => !existingKeys.has(t.topicKey))
    .sort((a, b) => b.score - a.score);
}
