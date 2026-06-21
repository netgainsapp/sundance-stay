import { z } from "zod";

const honeypot = z.string().max(0, "spam detected");

export const leadSchema = z.object({
  sourceType: z.enum(["property_inquiry", "business_inquiry", "general_contact", "sponsor_inquiry"]),
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
  website: honeypot,
});
export type PropertySubmissionInput = z.infer<typeof propertySubmissionSchema>;
