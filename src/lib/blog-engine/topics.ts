import type { BlogCatalog, TopicCandidate } from "./types";

/** Cornerstone positioning topics, grounded only in fixed festival facts. */
export const CORNERSTONE_SEEDS: TopicCandidate[] = [
  {
    topicKey: "cornerstone:book-early-sundance-2027",
    label: "Why booking early matters for Sundance 2027 in Boulder",
    postType: "cornerstone",
    source: "seed",
    score: 55,
  },
  {
    topicKey: "cornerstone:no-commission-host-pitch",
    label: "How hosting your Boulder home for the festival works",
    postType: "cornerstone",
    source: "seed",
    score: 50,
  },
  {
    topicKey: "cornerstone:getting-around-festival-week",
    label: "Getting around Boulder during festival week",
    postType: "cornerstone",
    source: "seed",
    score: 48,
  },
];

/**
 * Ranks blog topics from owned catalog signals. A neighborhood topic is only
 * produced when that neighborhood has at least one listed home, and a category
 * topic only when that category has at least one business. Topics already used
 * (present in existingKeys) are dropped. Pure and deterministic.
 */
export function rankTopics(
  catalog: BlogCatalog,
  existingKeys: Set<string> = new Set(),
): TopicCandidate[] {
  const out: TopicCandidate[] = [];

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
    const count = catalog.businesses.filter((b) => b.category === c.slug).length;
    if (count <= 0) continue;
    out.push({
      topicKey: `category:${c.slug}`,
      label: `${c.name} in Boulder for festival week`,
      postType: "category",
      source: "category",
      score: 40 + count * 3,
    });
  }

  out.push(...CORNERSTONE_SEEDS);

  return out
    .filter((t) => !existingKeys.has(t.topicKey))
    .sort((a, b) => b.score - a.score);
}
