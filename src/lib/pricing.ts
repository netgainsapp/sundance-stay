/**
 * Single source of truth for advertiser pricing. Flat fees, per festival window
 * (one time, no commission, no subscription). Ready to feed Stripe later.
 *
 * Pricing is a placement tier times a category multiplier, except the Large
 * Carousel which is category agnostic (flat price) and globally scarce.
 */

export type PlacementTier =
  | "standard"
  | "premium"
  | "featured_guide"
  | "carousel";

export type AdvertiserCategory =
  | "restaurants"
  | "services"
  | "short_term_rentals";

// Base prices are the restaurants (1x) tier, in whole US dollars.
const BASE_PRICE: Record<PlacementTier, number> = {
  standard: 299,
  premium: 599,
  featured_guide: 1500,
  carousel: 5000,
};

const CATEGORY_MULTIPLIER: Record<AdvertiserCategory, number> = {
  restaurants: 1,
  services: 1.5,
  short_term_rentals: 2,
};

// Premium placements are flat for any category; the multiplier applies only to
// the two base listing tiers (standard, premium).
const AGNOSTIC_TIERS: ReadonlySet<PlacementTier> = new Set([
  "featured_guide",
  "carousel",
]);

// Limited to five businesses total across the whole site.
export const CAROUSEL_TOTAL_SLOTS = 5;

export const TIER_LABEL: Record<PlacementTier, string> = {
  standard: "Standard Listing",
  premium: "Premium Visibility",
  featured_guide: "Featured Guide Placement",
  carousel: "Large Carousel",
};

export const TIER_BLURB: Record<PlacementTier, string> = {
  standard: "A clean profile in the directory with your details and inquiry form.",
  premium: "Priority placement and a highlighted card so you stand out in your category.",
  featured_guide: "Your brand woven into the editorial guides travelers actually read.",
  carousel: "One of five rotating homepage spots seen sitewide. Maximum visibility.",
};

export const CATEGORY_LABEL: Record<AdvertiserCategory, string> = {
  restaurants: "Restaurants",
  services: "Services",
  short_term_rentals: "Short-Term Rentals",
};

export const PLACEMENT_TIERS: PlacementTier[] = [
  "standard",
  "premium",
  "featured_guide",
  "carousel",
];

// The two base listing tiers a host or business chooses from.
export const LISTING_TIERS: PlacementTier[] = ["standard", "premium"];

// Premium add-on placements sold on the Advertise page.
export const PREMIUM_PLACEMENTS: PlacementTier[] = ["featured_guide", "carousel"];

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

/** Formats a whole-dollar amount as a clean price string, e.g. $1,198. */
export function formatPrice(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}
