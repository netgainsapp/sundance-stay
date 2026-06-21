import type { ServiceCategory } from "@/content/types";

export const serviceCategories: ServiceCategory[] = [
  {
    slug: "transportation",
    name: "Transportation",
    blurb:
      "Airport transfers, private drivers, and shuttle services that move guests around Boulder in comfort.",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80",
  },
  {
    slug: "cleaning",
    name: "Cleaning",
    blurb:
      "Professional housekeeping and turnover teams that keep every stay spotless and ready.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80",
  },
  {
    slug: "photography",
    name: "Photography",
    blurb:
      "Editorial photographers who capture properties, events, and Front Range scenery beautifully.",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&q=80",
  },
  {
    slug: "private-chef",
    name: "Private Chef",
    blurb:
      "In home chefs crafting tasting menus and intimate dinners with local Colorado ingredients.",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80",
  },
  {
    slug: "catering",
    name: "Catering",
    blurb:
      "Full service caterers for weddings, festivals, and gatherings of every size.",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&q=80",
  },
  {
    slug: "child-care",
    name: "Child Care",
    blurb:
      "Trusted, vetted sitters and nannies so families can explore Boulder with peace of mind.",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&q=80",
  },
  {
    slug: "pet-care",
    name: "Pet Care",
    blurb:
      "Walkers, sitters, and groomers who treat traveling pets like family.",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1200&q=80",
  },
  {
    slug: "concierge",
    name: "Concierge",
    blurb:
      "Personal concierges who arrange reservations, tickets, and bespoke Boulder experiences.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
  },
  {
    slug: "home-preparation",
    name: "Home Preparation",
    blurb:
      "Stocking, staging, and welcome setups that have a home guest ready on arrival.",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80",
  },
  {
    slug: "snow-removal",
    name: "Snow Removal",
    blurb:
      "Reliable plowing and shoveling crews that keep driveways and walkways clear all winter.",
    image: "https://images.unsplash.com/photo-1547754980-3df97fed72a8?w=1200&q=80",
  },
  {
    slug: "property-maintenance",
    name: "Property Maintenance",
    blurb:
      "Handymen and repair specialists who keep homes in pristine, guest ready condition.",
    image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=1200&q=80",
  },
];

export const getServiceCategory = (slug: string) =>
  serviceCategories.find((c) => c.slug === slug);
