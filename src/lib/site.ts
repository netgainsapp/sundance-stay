export const SITE = {
  name: "Sundance Stay Collective",
  shortName: "Sundance Stay",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Your guide to staying in Boulder during Festival Season. Discover lodging, local services, and trusted Boulder area resources.",
  disclaimer:
    "Not affiliated with, endorsed by, or sponsored by Sundance Institute or the Sundance Film Festival.",
  nav: [
    { label: "Home", href: "/" },
    { label: "Stay", href: "/stay" },
    { label: "Last-Minute", href: "/last-minute" },
    { label: "List Your Home", href: "/list-your-home" },
    { label: "Services", href: "/services" },
    { label: "Concierge", href: "/concierge" },
    { label: "Guides", href: "/guides" },
    { label: "Advertise", href: "/advertise" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
