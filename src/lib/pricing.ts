/**
 * Single source of truth for advertiser pricing. Flat fees, per festival window
 * (one time, no commission, no subscription). Ready to feed Stripe later.
 *
 * Three tiers: Standard (base listing, category multiplied), Premier (flat),
 * and Large Carousel (flat and globally scarce).
 */

export type PlacementTier = "standard" | "premier" | "carousel";

export type AdvertiserCategory =
  | "restaurants"
  | "services"
  | "short_term_rentals";

// Base prices are the restaurants (1x) rate, in whole US dollars.
const BASE_PRICE: Record<PlacementTier, number> = {
  standard: 299,
  premier: 1500,
  carousel: 5000,
};

const CATEGORY_MULTIPLIER: Record<AdvertiserCategory, number> = {
  restaurants: 1,
  services: 1.5,
  short_term_rentals: 2,
};

// Premier and the Large Carousel are flat for any category; the multiplier
// applies only to the Standard listing tier.
const AGNOSTIC_TIERS: ReadonlySet<PlacementTier> = new Set([
  "premier",
  "carousel",
]);

// Limited to five businesses total across the whole site.
export const CAROUSEL_TOTAL_SLOTS = 5;

export const TIER_LABEL: Record<PlacementTier, string> = {
  standard: "Standard Listing",
  premier: "Premier",
  carousel: "Large Carousel",
};

export const TIER_BLURB: Record<PlacementTier, string> = {
  standard:
    "A clean profile in the directory with your details and inquiry form.",
  premier:
    "Top placement and a featured profile for standout visibility across the site.",
  carousel:
    "One of five rotating homepage spots seen sitewide. Maximum visibility.",
};

export const CATEGORY_LABEL: Record<AdvertiserCategory, string> = {
  restaurants: "Restaurants",
  services: "Services",
  short_term_rentals: "Short-Term Rentals",
};

export const PLACEMENT_TIERS: PlacementTier[] = [
  "standard",
  "premier",
  "carousel",
];

// The listing levels a host or business chooses from.
export const LISTING_TIERS: PlacementTier[] = ["standard", "premier"];

export const ADVERTISER_CATEGORIES: AdvertiserCategory[] = [
  "restaurants",
  "services",
  "short_term_rentals",
];

/** Price in whole US dollars, rounded to a clean number. */
export function priceFor(
  category: AdvertiserCategory,
  tier: PlacementTier,
): number {
  const base = BASE_PRICE[tier];
  if (AGNOSTIC_TIERS.has(tier)) return base;
  return Math.round(base * CATEGORY_MULTIPLIER[category]);
}

export function isAgnosticTier(tier: PlacementTier): boolean {
  return AGNOSTIC_TIERS.has(tier);
}

/** Formats a whole-dollar amount as a clean price string, e.g. $1,500. */
export function formatPrice(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}
