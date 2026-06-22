import { z } from "zod";

const honeypot = z.string().max(0, "spam detected");

export const leadSchema = z.object({
  sourceType: z.enum(["property_inquiry", "business_inquiry", "general_contact", "sponsor_inquiry", "urgent_stay", "standby_host", "concierge_request", "alerts_signup"]),
  propertySlug: z.string().optional(),
  businessSlug: z.string().optional(),
  visitorName: z.string().min(2, "Please enter your name").max(120),
  visitorEmail: z.email("Please enter a valid email"),
  visitorPhone: z.string().max(40).optional().or(z.literal("")),
  message: z.string().min(10, "Please add a little more detail").max(2000),
  website: honeypot,
});
export type LeadInput = z.infer<typeof leadSchema>;

export const propertySubmissionSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.email("Please enter a valid email"),
  phone: z.string().max(40).optional().or(z.literal("")),
  propertyAddress: z.string().min(4, "Please enter the property address").max(240),
  propertyType: z.string().min(2).max(60),
  bedrooms: z.coerce.number().int().min(1).max(30),
  bathrooms: z.coerce.number().int().min(1).max(30),
  capacity: z.coerce.number().int().min(1).max(60),
  availabilityDates: z.string().max(240).optional().or(z.literal("")),
  description: z.string().min(20, "Please describe the property").max(4000),
  bookingUrl: z
    .union([z.literal(""), z.url("Enter a valid link, including https")])
    .optional(),
  // Checkbox: present as "on" when checked, absent otherwise.
  shortNotice: z.string().optional(),
  website: honeypot,
});
export type PropertySubmissionInput = z.infer<typeof propertySubmissionSchema>;

export const urgentStaySchema = z.object({
  visitorName: z.string().min(2, "Please enter your name").max(120),
  visitorEmail: z.email("Please enter a valid email"),
  visitorPhone: z.string().max(40).optional().or(z.literal("")),
  datesNeeded: z.string().min(2, "Let us know the dates you need").max(120),
  partySize: z.string().max(40).optional().or(z.literal("")),
  budget: z.string().max(60).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
  website: honeypot,
});
export type UrgentStayInput = z.infer<typeof urgentStaySchema>;

export const standbyHostSchema = z.object({
  visitorName: z.string().min(2, "Please enter your name").max(120),
  visitorEmail: z.email("Please enter a valid email"),
  visitorPhone: z.string().max(40).optional().or(z.literal("")),
  area: z.string().min(2, "Where is your home?").max(120),
  sleeps: z.string().max(40).optional().or(z.literal("")),
  datesAvailable: z.string().min(2, "When could you host?").max(120),
  message: z.string().max(2000).optional().or(z.literal("")),
  website: honeypot,
});
export type StandbyHostInput = z.infer<typeof standbyHostSchema>;

export const conciergeRequestSchema = z.object({
  visitorName: z.string().min(2, "Please enter your name").max(120),
  visitorEmail: z.email("Please enter a valid email"),
  visitorPhone: z.string().max(40).optional().or(z.literal("")),
  datesNeeded: z.string().min(2, "Let us know your festival dates").max(120),
  partySize: z.string().max(40).optional().or(z.literal("")),
  tier: z.string().max(80).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
  website: honeypot,
});
export type ConciergeRequestInput = z.infer<typeof conciergeRequestSchema>;

export const alertsSignupSchema = z.object({
  visitorEmail: z.email("Please enter a valid email"),
  website: honeypot,
});
export type AlertsSignupInput = z.infer<typeof alertsSignupSchema>;

// Last-Minute Board: passwordless sign in request.
export const magicLinkSchema = z.object({
  email: z.email("Please enter a valid email"),
  name: z.string().max(120).optional().or(z.literal("")),
  website: honeypot,
});
export type MagicLinkInput = z.infer<typeof magicLinkSchema>;

// Last-Minute Board: a free post, either a traveler need or host availability.
export const boardPostSchema = z.object({
  type: z.enum(["need", "availability"]),
  area: z.string().min(2, "Where in the Boulder area?").max(120),
  dates: z.string().min(2, "Which dates?").max(120),
  partySize: z.string().max(60).optional().or(z.literal("")),
  budget: z.string().max(80).optional().or(z.literal("")),
  notes: z.string().min(10, "Please add a little more detail").max(2000),
  website: honeypot,
});
export type BoardPostInput = z.infer<typeof boardPostSchema>;
