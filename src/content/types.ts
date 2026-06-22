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
}

export interface Neighborhood {
  slug: string;
  name: string;
  description: string;
  image: string;
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
