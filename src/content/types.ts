export type Tier = "basic" | "featured" | "premier";

export interface PropertyImage {
  url: string;
  alt: string;
  sortOrder: number;
}

export interface Property {
  slug: string;
  title: string;
  description: string;
  summary: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  capacity: number;
  city: string;
  state: string;
  neighborhoodSlug: string;
  amenities: string[];
  images: PropertyImage[];
  featured: boolean;
  tier: Tier;
  // Optional direct booking link to the host's own channel (Airbnb, Vrbo, or
  // their own site). We funnel demand there; we never process the booking.
  bookingUrl?: string;
  // Host accepts last-minute, festival-window stays and may vacate on short
  // notice. Surfaces this home in the standby / Last-Minute supply pool.
  shortNotice?: boolean;
}

export interface Business {
  slug: string;
  name: string;
  description: string;
  category: string;
  website?: string;
  phone?: string;
  email?: string;
  logo: string;
  coverImage: string;
  serviceArea: string;
  services: string[];
  featured: boolean;
  tier: Tier;
  // Vetting credentials shown on the listing: references, licenses,
  // affiliations, or certifications. Required for trust-sensitive categories
  // (child care, pet care) so guests can see proof of vetting.
  credentials?: string[];
  // The provider's own client-facing rates, shown on the listing. We do not
  // set these. Required for care providers so guests see pricing up front.
  rates?: string[];
}

export interface Neighborhood {
  slug: string;
  name: string;
  description: string;
  image: string;
  // Richer area overview shown on the Neighborhoods page.
  overview: string;
  // A few quick characteristics, e.g. "Most walkable", "Near CU".
  highlights: string[];
  // Position on the schematic area map, as percentages (0 to 100).
  // x: west to east, y: north to south.
  mapX: number;
  mapY: number;
}

export interface ServiceCategory {
  slug: string;
  name: string;
  blurb: string;
  image: string;
}

export interface Guide {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  featuredImage: string;
  content: string;
  relatedSlugs: string[];
}

export interface Sponsor {
  businessSlug: string;
  level: "local" | "category" | "festival";
  active: boolean;
}
