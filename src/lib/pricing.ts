/**
 * Single source of truth for advertiser pricing. Flat fees, per festival window
 * (one time, no commission, no subscription). Ready to feed Stripe later.
 *
 * Tiers: Standard (base listing, category multiplied), Premier (flat), Large
 * Carousel (flat, 5 shared slots), and the Realtor Spotlight (flat, 1 exclusive
 * realtor slot). Multiplied prices round UP to the nearest number ending in
 * 49 or 99.
 */

export type PlacementTier =
  | "standard"
  | "premier"
  | "carousel"
  | "realtor_spot";

export type AdvertiserCategory =
  | "restaurants"
  | "services"
  | "short_term_rentals"
  | "realtors";

// Base prices are the restaurants (1x) rate, in whole US dollars.
const BASE_PRICE: Record<PlacementTier, number> = {
  standard: 299,
  premier: 1500,
  carousel: 5000,
  realtor_spot: 5000,
};

const CATEGORY_MULTIPLIER: Record<AdvertiserCategory, number> = {
  restaurants: 1,
  services: 1.5,
  short_term_rentals: 2,
  realtors: 2.5,
};

// Premier, the Large Carousel, and the Realtor Spotlight are flat for any
// category; the multiplier applies only to the Standard listing tier.
const AGNOSTIC_TIERS: ReadonlySet<PlacementTier> = new Set([
  "premier",
  "carousel",
  "realtor_spot",
]);

// Scarcity limits.
export const CAROUSEL_TOTAL_SLOTS = 5;
export const REALTOR_SPOT_SLOTS = 1;

// Flat listing rate for individual care providers (child care, pet care).
// Set below the standard services rate to grow vetted care supply. These
// providers set and display their OWN client-facing rates; this is only what
// they pay to be listed.
export const CARE_LISTING_PRICE = 199;
export const CARE_CATEGORIES = ["child-care", "pet-care"] as const;

// Concierge packages, priced by coverage model. Flat fees for the festival
// window. We arrange; the licensed local providers deliver.
export type ConciergeTier = {
  key: string;
  label: string;
  price: number;
  coverage: string;
  blurb: string;
  emphasized?: boolean;
};

export const CONCIERGE_TIERS: ConciergeTier[] = [
  {
    key: "dedicated_day",
    label: "Dedicated, Noon to Midnight",
    price: 5000,
    coverage: "Noon to midnight, just for you",
    blurb:
      "Your own concierge from noon to midnight, covering the hours that matter most during the festival.",
  },
  {
    key: "shared_24_7",
    label: "Shared 24/7",
    price: 6000,
    coverage: "Around the clock, shared with one other party",
    blurb:
      "Full around the clock coverage at a shared rate. Your concierge supports you and one other party.",
  },
  {
    key: "dedicated_24_7",
    label: "Dedicated 24/7",
    price: 10000,
    coverage: "Around the clock, just for you",
    blurb:
      "Your own concierge, available any hour for the entire festival. The highest level of service.",
    emphasized: true,
  },
];

export const TIER_LABEL: Record<PlacementTier, string> = {
  standard: "Standard Listing",
  premier: "Premier",
  carousel: "Large Carousel",
  realtor_spot: "Realtor Spotlight",
};

export const TIER_BLURB: Record<PlacementTier, string> = {
  standard:
    "A clean profile in the directory with your details and inquiry form.",
  premier:
    "Top placement and a featured profile for standout visibility across the site.",
  carousel:
    "One of five rotating homepage spots seen sitewide. Maximum visibility.",
  realtor_spot:
    "The single exclusive realtor placement on the site. Be the agent festival visitors and home buyers see.",
};

export const CATEGORY_LABEL: Record<AdvertiserCategory, string> = {
  restaurants: "Restaurants",
  services: "Services",
  short_term_rentals: "Short-Term Rentals",
  realtors: "Realtors",
};

export const PLACEMENT_TIERS: PlacementTier[] = [
  "standard",
  "premier",
  "carousel",
  "realtor_spot",
];

// The listing levels a host or business chooses from.
export const LISTING_TIERS: PlacementTier[] = ["standard", "premier"];

export const ADVERTISER_CATEGORIES: AdvertiserCategory[] = [
  "restaurants",
  "services",
  "short_term_rentals",
  "realtors",
];

// Round UP to the nearest whole dollar ending in 49 or 99.
function roundUpTo49or99(value: number): number {
  let n = Math.ceil(value);
  while (n % 100 !== 49 && n % 100 !== 99) n++;
  return n;
}

/** Price in whole US dollars. Multiplied tiers round up to a 49/99 ending. */
export function priceFor(
  category: AdvertiserCategory,
  tier: PlacementTier,
): number {
  const base = BASE_PRICE[tier];
  if (AGNOSTIC_TIERS.has(tier)) return base;
  return roundUpTo49or99(base * CATEGORY_MULTIPLIER[category]);
}

export function isAgnosticTier(tier: PlacementTier): boolean {
  return AGNOSTIC_TIERS.has(tier);
}

/** Formats a whole-dollar amount as a clean price string, e.g. $1,500. */
export function formatPrice(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}
