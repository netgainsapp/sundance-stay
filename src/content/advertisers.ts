import { activeSponsors } from "@/content/sponsors";
import { getBusiness } from "@/content/businesses";

/** An advertiser's marketing assets, ready to drop into a newsletter or feed. */
export interface AdvertiserAsset {
  slug: string;
  name: string;
  blurb: string;
  logo: string;
  coverImage: string;
  href: string;
  website?: string;
  level: "festival" | "category" | "local";
}

const LEVEL_RANK: Record<string, number> = { festival: 3, category: 2, local: 1 };

/**
 * Active advertisers with their assets, highest sponsorship level first. Pulls
 * the logo, cover image, blurb, and link from each sponsor's business listing
 * so the newsletter can feature paid placements automatically.
 */
export function activeAdvertisers(): AdvertiserAsset[] {
  return activeSponsors()
    .map((s): AdvertiserAsset | null => {
      const b = getBusiness(s.businessSlug);
      if (!b) return null;
      return {
        slug: b.slug,
        name: b.name,
        blurb: b.description,
        logo: b.logo,
        coverImage: b.coverImage,
        href: `/business/${b.slug}`,
        website: b.website,
        level: s.level,
      };
    })
    .filter((a): a is AdvertiserAsset => a !== null)
    .sort((a, b) => LEVEL_RANK[b.level] - LEVEL_RANK[a.level]);
}
