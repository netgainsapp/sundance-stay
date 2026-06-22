/** Verified, free-license Boulder area Unsplash photos used as hero imagery for
 * generated content (newsletter issues, generated blog posts). Swappable. */
const IDS = [
  "photo-1600104146011-ad1a8571f161", // Flatirons in winter
  "photo-1502602898657-3e91760cbb34", // mountain town
  "photo-1454496522488-7a8e488e8606", // foothills and trails
  "photo-1449965408869-eaa3f722e40d", // open road to the mountains
  "photo-1414235077428-338989a2e8c0", // dining
  "photo-1484154218962-a197022b5858", // interior
  "photo-1459749411175-04bf5292ceea", // home exterior
  "photo-1659730251471-1b1dfc88b491", // snowy peaks
];

export function boulderImage(id: string, width = 1200): string {
  return `https://images.unsplash.com/${id}?w=${width}&q=80`;
}

export const BOULDER_IMAGES = IDS.map((id) => boulderImage(id));

/** A Boulder image chosen deterministically by a numeric seed (rotates). */
export function pickBoulderImage(seed: number, width = 1200): string {
  const idx = ((seed % IDS.length) + IDS.length) % IDS.length;
  return boulderImage(IDS[idx], width);
}
