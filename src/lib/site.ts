export const SITE = {
  name: "Boulder Film Collective",
  shortName: "Boulder Film Collective",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Your guide to staying in Boulder during Festival Season. Curated lodging, trusted local services, and insider access to everything you need for an unforgettable stay.",
  disclaimer:
    "Boulder Film Collective is an independent guide to lodging and services in Boulder. Not affiliated with, endorsed by, or sponsored by Sundance Institute or the Sundance Film Festival.",
  nav: [
    { label: "Home", href: "/" },
    { label: "Stay", href: "/stay" },
    { label: "Last-Minute", href: "/last-minute" },
    { label: "Services", href: "/services" },
    { label: "Concierge", href: "/concierge" },
    { label: "Guides", href: "/guides" },
    { label: "Blog", href: "/blog" },
    { label: "News", href: "/news" },
    { label: "List Your Home", href: "/list-your-home" },
    { label: "Advertise", href: "/advertise" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
