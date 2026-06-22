import { describe, it, expect } from "vitest";
import { neighborhoods } from "@/content/neighborhoods";
import { serviceCategories } from "@/content/services";
import { properties } from "@/content/properties";
import { businesses } from "@/content/businesses";
import { sponsors } from "@/content/sponsors";

describe("seed content integrity", () => {
  it("has twelve neighborhoods with unique slugs", () => {
    expect(neighborhoods).toHaveLength(12);
    expect(new Set(neighborhoods.map((n) => n.slug)).size).toBe(12);
  });
  it("has all eleven service categories", () => {
    expect(serviceCategories).toHaveLength(11);
  });
  it("every property references a real neighborhood", () => {
    const valid = new Set(neighborhoods.map((n) => n.slug));
    for (const p of properties) expect(valid.has(p.neighborhoodSlug)).toBe(true);
  });
  it("has at least three featured properties each with 3+ images", () => {
    const featured = properties.filter((p) => p.featured);
    expect(featured.length).toBeGreaterThanOrEqual(3);
    for (const p of featured) expect(p.images.length).toBeGreaterThanOrEqual(3);
  });
  it("every business category is a real service category", () => {
    const valid = new Set(serviceCategories.map((c) => c.slug));
    for (const b of businesses) expect(valid.has(b.category)).toBe(true);
  });
  it("every category has at least two businesses", () => {
    for (const c of serviceCategories) {
      const count = businesses.filter((b) => b.category === c.slug).length;
      expect(count, `category ${c.slug}`).toBeGreaterThanOrEqual(2);
    }
  });
  it("every sponsor references a real business", () => {
    const valid = new Set(businesses.map((b) => b.slug));
    for (const s of sponsors) expect(valid.has(s.businessSlug)).toBe(true);
  });
});
