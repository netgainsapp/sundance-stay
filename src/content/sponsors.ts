import type { Sponsor } from "@/content/types";

export const sponsors: Sponsor[] = [
  { businessSlug: "flatiron-car-service", level: "festival", active: true },
  { businessSlug: "sundance-concierge", level: "category", active: true },
  { businessSlug: "alpine-clean-boulder", level: "local", active: true },
];

export const activeSponsors = () => sponsors.filter((s) => s.active);
