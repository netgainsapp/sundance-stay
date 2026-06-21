import { describe, it, expect } from "vitest";
import { leadSchema, propertySubmissionSchema } from "@/lib/validation";

describe("leadSchema", () => {
  it("accepts a valid property inquiry", () => {
    const r = leadSchema.safeParse({ sourceType: "property_inquiry", propertySlug: "x", visitorName: "Jane Guest", visitorEmail: "jane@example.com", visitorPhone: "303-555-0142", message: "Is this available the last week of January?", website: "" });
    expect(r.success).toBe(true);
  });
  it("rejects an invalid email", () => {
    const r = leadSchema.safeParse({ sourceType: "general_contact", visitorName: "Jane", visitorEmail: "not-an-email", message: "Hello there friends", website: "" });
    expect(r.success).toBe(false);
  });
  it("rejects when honeypot is filled", () => {
    const r = leadSchema.safeParse({ sourceType: "general_contact", visitorName: "Bot", visitorEmail: "bot@example.com", message: "spammy message here", website: "http://spam.example" });
    expect(r.success).toBe(false);
  });
});

describe("propertySubmissionSchema", () => {
  it("accepts a valid submission", () => {
    const r = propertySubmissionSchema.safeParse({ name: "Host Helen", email: "helen@example.com", phone: "303-555-0190", propertyAddress: "123 Pearl St, Boulder, CO", propertyType: "House", bedrooms: 3, bathrooms: 2, capacity: 6, availabilityDates: "Jan 15 to Feb 1", description: "A lovely home near downtown with mountain views.", website: "" });
    expect(r.success).toBe(true);
  });
  it("rejects zero bedrooms", () => {
    const r = propertySubmissionSchema.safeParse({ name: "Host", email: "h@example.com", propertyAddress: "x", propertyType: "House", bedrooms: 0, bathrooms: 1, capacity: 2, description: "short enough description text here", website: "" });
    expect(r.success).toBe(false);
  });
});
