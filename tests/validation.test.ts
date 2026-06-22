import { describe, it, expect } from "vitest";
import {
  leadSchema,
  propertySubmissionSchema,
  urgentStaySchema,
} from "@/lib/validation";

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

  it("accepts an optional standby (shortNotice) flag", () => {
    const r = propertySubmissionSchema.safeParse({ name: "Host Helen", email: "helen@example.com", propertyAddress: "123 Pearl St", propertyType: "House", bedrooms: 3, bathrooms: 2, capacity: 6, description: "A lovely home near downtown with mountain views.", shortNotice: "on", website: "" });
    expect(r.success).toBe(true);
  });
});

describe("urgentStaySchema", () => {
  it("accepts a valid urgent request", () => {
    const r = urgentStaySchema.safeParse({ visitorName: "Late Larry", visitorEmail: "larry@example.com", visitorPhone: "303-555-0199", datesNeeded: "Jan 22 to Jan 25", partySize: "4 adults", budget: "$2000", message: "Our rental fell through.", website: "" });
    expect(r.success).toBe(true);
  });

  it("requires dates needed", () => {
    const r = urgentStaySchema.safeParse({ visitorName: "Larry", visitorEmail: "larry@example.com", datesNeeded: "", website: "" });
    expect(r.success).toBe(false);
  });

  it("rejects a filled honeypot", () => {
    const r = urgentStaySchema.safeParse({ visitorName: "Bot", visitorEmail: "bot@example.com", datesNeeded: "whenever", website: "http://spam.example" });
    expect(r.success).toBe(false);
  });
});
