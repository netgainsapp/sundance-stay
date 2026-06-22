import { describe, it, expect } from "vitest";
import {
  leadSchema,
  propertySubmissionSchema,
  urgentStaySchema,
  standbyHostSchema,
  conciergeRequestSchema,
  alertsSignupSchema,
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

describe("standbyHostSchema", () => {
  it("accepts a valid standby host", () => {
    const r = standbyHostSchema.safeParse({ visitorName: "Host Helen", visitorEmail: "helen@example.com", visitorPhone: "303-555-0190", area: "North Boulder", sleeps: "6", datesAvailable: "Jan 21 to Jan 31", message: "Happy to vacate for the festival.", website: "" });
    expect(r.success).toBe(true);
  });

  it("requires area and dates available", () => {
    const r = standbyHostSchema.safeParse({ visitorName: "Helen", visitorEmail: "helen@example.com", area: "", datesAvailable: "", website: "" });
    expect(r.success).toBe(false);
  });
});

describe("conciergeRequestSchema", () => {
  it("accepts a valid concierge request", () => {
    const r = conciergeRequestSchema.safeParse({ visitorName: "VIP Vera", visitorEmail: "vera@example.com", visitorPhone: "303-555-0150", datesNeeded: "Jan 21 to Jan 31", partySize: "6", tier: "Dedicated 24/7 ($10,000)", message: "Production team, need full coverage.", website: "" });
    expect(r.success).toBe(true);
  });

  it("requires festival dates", () => {
    const r = conciergeRequestSchema.safeParse({ visitorName: "Vera", visitorEmail: "vera@example.com", datesNeeded: "", website: "" });
    expect(r.success).toBe(false);
  });
});

describe("alertsSignupSchema", () => {
  it("accepts a valid email", () => {
    expect(alertsSignupSchema.safeParse({ visitorEmail: "fan@example.com", website: "" }).success).toBe(true);
  });
  it("rejects an invalid email", () => {
    expect(alertsSignupSchema.safeParse({ visitorEmail: "nope", website: "" }).success).toBe(false);
  });
  it("rejects a filled honeypot", () => {
    expect(alertsSignupSchema.safeParse({ visitorEmail: "fan@example.com", website: "x" }).success).toBe(false);
  });
});
