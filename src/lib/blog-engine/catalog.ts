import { neighborhoods } from "@/content/neighborhoods";
import { properties } from "@/content/properties";
import { businesses } from "@/content/businesses";
import { serviceCategories } from "@/content/services";
import type { BlogCatalog } from "./types";

/** Thin adapter: maps the site content modules to the engine's catalog shape. */
export function loadCatalog(): BlogCatalog {
  return {
    neighborhoods: neighborhoods.map((n) => ({
      slug: n.slug,
      name: n.name,
      overview: n.overview,
      highlights: n.highlights,
    })),
    properties: properties.map((p) => ({
      neighborhoodSlug: p.neighborhoodSlug,
      propertyType: p.propertyType,
      capacity: p.capacity,
    })),
    businesses: businesses.map((b) => ({
      name: b.name,
      category: b.category,
      services: b.services,
    })),
    serviceCategories: serviceCategories.map((c) => ({
      slug: c.slug,
      name: c.name,
    })),
  };
}
