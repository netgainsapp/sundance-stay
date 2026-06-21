# Sundance Stay Collective Marketing Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the v1 public marketing site for Sundance Stay Collective: a premium Boulder lodging and local services destination guide with curated seed content and lead capture that persists to Neon and emails a notification.

**Architecture:** Next.js App Router site. Content (properties, businesses, neighborhoods, guides) lives in typed seed modules. The only live database is two tables (`Lead`, `PropertySubmission`) written through one hardened Server Action pipeline (zod validation, honeypot, rate limit, Prisma write, Resend notify). Visual pages are server components composed from a small set of reusable cards and a shared inquiry form.

**Tech Stack:** Next.js (App Router) + TypeScript, Tailwind CSS, shadcn/ui primitives, Prisma + Neon Postgres, Resend, zod, next/font (Playfair Display + Inter), next/image, Vitest for unit tests.

**Project root:** `C:\Users\sweis\sundance-stay` (off Google Drive so node_modules works).

**Spec:** `docs/superpowers/specs/2026-06-21-sundance-stay-marketing-site-design.md`

---

## File Structure

```
sundance-stay/
  prisma/
    schema.prisma                 # Lead + PropertySubmission models
  src/
    app/
      layout.tsx                  # root layout, fonts, Header, Footer
      page.tsx                    # Home
      globals.css                 # tokens + base styles
      stay/page.tsx               # property grid + filters
      stay/[slug]/page.tsx        # property detail
      services/page.tsx           # category grid
      services/[category]/page.tsx
      business/[slug]/page.tsx
      list-your-home/page.tsx
      guides/page.tsx
      guides/[slug]/page.tsx
      advertise/page.tsx
      contact/page.tsx
      sitemap.ts
      robots.ts
    components/
      layout/Header.tsx
      layout/Footer.tsx           # contains sitewide disclaimer
      cards/PropertyCard.tsx
      cards/BusinessCard.tsx
      cards/NeighborhoodCard.tsx
      cards/GuideCard.tsx
      ui/SectionHeader.tsx
      ui/Cta.tsx
      forms/InquiryForm.tsx       # property/business/contact/sponsor
      forms/PropertySubmissionForm.tsx
      forms/FormStatus.tsx
    content/
      types.ts                    # seed content interfaces
      neighborhoods.ts
      properties.ts
      businesses.ts
      guides.ts
      sponsors.ts
      services.ts                 # category metadata
    lib/
      prisma.ts                   # Prisma singleton
      validation.ts               # zod schemas
      rate-limit.ts               # coarse in-memory IP limiter
      email.ts                    # Resend wrapper
      seo.ts                      # pageMetadata helper + JSON-LD
      site.ts                     # site constants (name, url, nav, disclaimer)
    actions/
      submit-lead.ts              # server action for inquiry/contact/sponsor
      submit-property.ts          # server action for List Your Home
  tests/
    validation.test.ts
    rate-limit.test.ts
    content.test.ts
    submit-lead.test.ts
  .env.local                      # DATABASE_URL, RESEND_API_KEY, LEADS_EMAIL, NEXT_PUBLIC_SITE_URL
  .env.example
```

---

### Task 1: Scaffold the Next.js project

**Files:**
- Create: project at `C:\Users\sweis\sundance-stay` (git already initialized, spec already committed)

- [ ] **Step 1: Create the Next.js app in place**

Run from `C:\Users\sweis\sundance-stay`:

```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir --eslint --import-alias "@/*" --no-turbopack --use-npm
```

When prompted that the directory is not empty (docs/ and .git exist), choose to continue. Do not overwrite `docs/`.

- [ ] **Step 2: Install runtime and dev dependencies**

```bash
npm install @prisma/client zod resend
npm install -D prisma vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 3: Add Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
```

Add scripts to `package.json`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Verify the dev server boots**

Run: `npm run dev`
Expected: server starts on http://localhost:3000 with the default Next page. Stop it with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with Tailwind, Prisma, Vitest"
```

---

### Task 2: Design tokens, fonts, and site constants

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx` (fonts only here; Header/Footer in Task 3)
- Create: `src/lib/site.ts`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Create site constants**

Create `src/lib/site.ts`:

```ts
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
    { label: "List Your Home", href: "/list-your-home" },
    { label: "Services", href: "/services" },
    { label: "Guides", href: "/guides" },
    { label: "Advertise", href: "/advertise" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
```

- [ ] **Step 2: Define color and type tokens in globals.css**

Replace the top of `src/app/globals.css` (keep the Tailwind directives) with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-charcoal: #1f2933;
  --color-mountain: #1d4e89;
  --color-sand: #d9c4a1;
  --color-copper: #b87333;
  --color-white: #ffffff;

  --color-text: var(--color-charcoal);
  --color-bg: var(--color-white);

  --space-section: clamp(4rem, 3rem + 5vw, 8rem);
  --radius-card: 14px;
  --duration-normal: 300ms;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}

html { color-scheme: light; }

body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-inter), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 {
  font-family: var(--font-playfair), Georgia, serif;
  letter-spacing: -0.01em;
  line-height: 1.08;
}
```

- [ ] **Step 3: Wire Tailwind to the tokens**

In `tailwind.config.ts`, extend the theme:

```ts
theme: {
  extend: {
    colors: {
      charcoal: "var(--color-charcoal)",
      mountain: "var(--color-mountain)",
      sand: "var(--color-sand)",
      copper: "var(--color-copper)",
    },
    fontFamily: {
      heading: ["var(--font-playfair)", "Georgia", "serif"],
      body: ["var(--font-inter)", "system-ui", "sans-serif"],
    },
    borderRadius: { card: "var(--radius-card)" },
  },
},
```

- [ ] **Step 4: Load fonts in the root layout**

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: SITE.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 5: Verify build and commit**

Run: `npm run dev` and confirm the home page renders with Inter body font (no console errors). Stop the server.

```bash
git add -A
git commit -m "feat: design tokens, fonts, and site constants"
```

---

### Task 3: Root layout shell (Header, Footer with disclaimer)

**Files:**
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/Footer.tsx`
- Modify: `src/app/layout.tsx`
- Create: `src/components/ui/Cta.tsx`

- [ ] **Step 1: Create the CTA button component**

Create `src/components/ui/Cta.tsx`:

```tsx
import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

const styles = {
  primary:
    "bg-mountain text-white hover:bg-charcoal focus-visible:ring-mountain",
  secondary:
    "bg-transparent text-charcoal border border-charcoal hover:bg-charcoal hover:text-white focus-visible:ring-charcoal",
} as const;

export function Cta({ href, children, variant = "primary", className = "" }: Props) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-card px-7 py-3 text-sm font-medium tracking-wide transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
```

- [ ] **Step 2: Create the Header**

Create `src/components/layout/Header.tsx`:

```tsx
import Link from "next/link";
import { SITE } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-heading text-xl text-charcoal">
          Sundance Stay Collective
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-7 md:flex">
          {SITE.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-charcoal/80 transition-colors hover:text-mountain"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/stay"
          className="rounded-card bg-mountain px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-charcoal md:hidden"
        >
          Find Lodging
        </Link>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Create the Footer with sitewide disclaimer**

Create `src/components/layout/Footer.tsx`:

```tsx
import Link from "next/link";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-[var(--space-section)] border-t border-charcoal/10 bg-charcoal text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-heading text-lg text-white">Sundance Stay Collective</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed">{SITE.description}</p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-col gap-2 text-sm">
          {SITE.nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-sand">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="text-sm">
          <p className="text-white">Boulder, Colorado</p>
          <p className="mt-2">Festival Season and year round.</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-6 py-6 text-xs leading-relaxed text-white/60">
          {SITE.disclaimer}
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Compose Header and Footer in the layout**

In `src/app/layout.tsx`, import and wrap children:

```tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
```

Change the body to:

```tsx
<body className="flex min-h-screen flex-col">
  <Header />
  <main className="flex-1">{children}</main>
  <Footer />
</body>
```

- [ ] **Step 5: Verify and commit**

Run: `npm run dev`, confirm header nav and footer disclaimer render on the home page. Stop server.

```bash
git add -A
git commit -m "feat: header nav and footer with sitewide disclaimer"
```

---

### Task 4: Content types and curated seed data

**Files:**
- Create: `src/content/types.ts`
- Create: `src/content/neighborhoods.ts`
- Create: `src/content/services.ts`
- Create: `src/content/properties.ts`
- Create: `src/content/businesses.ts`
- Create: `src/content/guides.ts`
- Create: `src/content/sponsors.ts`
- Test: `tests/content.test.ts`

- [ ] **Step 1: Define content interfaces**

Create `src/content/types.ts`:

```ts
export type Tier = "basic" | "featured" | "premier";

export interface PropertyImage {
  url: string;
  alt: string;
  sortOrder: number;
}

export interface Property {
  slug: string;
  title: string;
  description: string;
  summary: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  capacity: number;
  city: string;
  state: string;
  neighborhoodSlug: string;
  amenities: string[];
  images: PropertyImage[];
  featured: boolean;
  tier: Tier;
}

export interface Business {
  slug: string;
  name: string;
  description: string;
  category: string; // matches ServiceCategory.slug
  website?: string;
  phone?: string;
  email?: string;
  logo: string;
  coverImage: string;
  serviceArea: string;
  services: string[];
  featured: boolean;
  tier: Tier;
}

export interface Neighborhood {
  slug: string;
  name: string;
  description: string;
  image: string;
}

export interface ServiceCategory {
  slug: string;
  name: string;
  blurb: string;
  image: string;
}

export interface Guide {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  featuredImage: string;
  content: string; // markdown-ish paragraphs separated by blank lines
  relatedSlugs: string[];
}

export interface Sponsor {
  businessSlug: string;
  level: "local" | "category" | "festival";
  active: boolean;
}
```

- [ ] **Step 2: Create neighborhoods**

Create `src/content/neighborhoods.ts` with all nine areas. Use Unsplash source URLs with fixed dimensions.

```ts
import type { Neighborhood } from "./types";

export const neighborhoods: Neighborhood[] = [
  { slug: "downtown-boulder", name: "Downtown Boulder", description: "Pearl Street walkability, dining, and the heart of Festival energy.", image: "https://images.unsplash.com/photo-1508599589920-14cfa1c1fe4d?w=1200&q=80" },
  { slug: "university-hill", name: "University Hill", description: "Lively, walkable, and steps from campus and the Flatirons.", image: "https://images.unsplash.com/photo-1524813686514-a57563d77965?w=1200&q=80" },
  { slug: "north-boulder", name: "North Boulder", description: "Quiet residential streets with quick mountain access.", image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200&q=80" },
  { slug: "south-boulder", name: "South Boulder", description: "Trailheads, open space, and easy reach to Denver.", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80" },
  { slug: "louisville", name: "Louisville", description: "Charming small town feel between Boulder and the airport.", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80" },
  { slug: "lafayette", name: "Lafayette", description: "Relaxed, affordable, and a short drive to the venues.", image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1200&q=80" },
  { slug: "longmont", name: "Longmont", description: "Space and value with a growing food and arts scene.", image: "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=1200&q=80" },
  { slug: "broomfield", name: "Broomfield", description: "Central to both Boulder and Denver, ideal for groups.", image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&q=80" },
  { slug: "denver", name: "Denver", description: "Big city base with a quick drive up to the Festival.", image: "https://images.unsplash.com/photo-1546156929-a4c0ac411f47?w=1200&q=80" },
];

export const getNeighborhood = (slug: string) =>
  neighborhoods.find((n) => n.slug === slug);
```

- [ ] **Step 3: Create service categories**

Create `src/content/services.ts` with all eleven categories from the spec.

```ts
import type { ServiceCategory } from "./types";

export const serviceCategories: ServiceCategory[] = [
  { slug: "transportation", name: "Transportation", blurb: "Airport transfers, private drivers, and shuttles.", image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80" },
  { slug: "cleaning", name: "Cleaning", blurb: "Turnover and deep cleaning for hosts and guests.", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80" },
  { slug: "photography", name: "Photography", blurb: "Listing photography and event coverage.", image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&q=80" },
  { slug: "private-chef", name: "Private Chef", blurb: "In home dining and meal prep.", image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&q=80" },
  { slug: "catering", name: "Catering", blurb: "Group meals and event catering.", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80" },
  { slug: "child-care", name: "Child Care", blurb: "Vetted local sitters and nannies.", image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&q=80" },
  { slug: "pet-care", name: "Pet Care", blurb: "Sitting, walking, and boarding.", image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&q=80" },
  { slug: "concierge", name: "Concierge", blurb: "Reservations, planning, and local know how.", image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80" },
  { slug: "home-preparation", name: "Home Preparation", blurb: "Get a property guest ready fast.", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80" },
  { slug: "snow-removal", name: "Snow Removal", blurb: "Driveways and walkways cleared on schedule.", image: "https://images.unsplash.com/photo-1457269449834-928af64c684d?w=1200&q=80" },
  { slug: "property-maintenance", name: "Property Maintenance", blurb: "Repairs and upkeep for hosts.", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80" },
];

export const getServiceCategory = (slug: string) =>
  serviceCategories.find((c) => c.slug === slug);
```

- [ ] **Step 4: Create properties (6 to 9 sample listings)**

Create `src/content/properties.ts`. Provide nine properties spread across neighborhoods, at least three `featured: true`. Each needs 3+ images. Example shape (repeat for all nine with varied data):

```ts
import type { Property } from "./types";

export const properties: Property[] = [
  {
    slug: "flatiron-view-retreat",
    title: "Flatiron View Retreat",
    summary: "Light filled modern home with unobstructed Flatiron views.",
    description:
      "A serene four bedroom retreat minutes from Pearl Street. Floor to ceiling windows frame the Flatirons, with a chef kitchen, fireplace, and a heated deck built for cold mountain evenings.",
    propertyType: "House",
    bedrooms: 4,
    bathrooms: 3,
    capacity: 8,
    city: "Boulder",
    state: "CO",
    neighborhoodSlug: "north-boulder",
    amenities: ["Mountain views", "Chef kitchen", "Fireplace", "Heated deck", "Fast wifi", "Parking for 3"],
    images: [
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80", alt: "Modern living room with mountain views", sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1400&q=80", alt: "Bright bedroom", sortOrder: 1 },
      { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=80", alt: "Chef kitchen", sortOrder: 2 },
    ],
    featured: true,
    tier: "premier",
  },
  // ... eight more properties with varied neighborhoods, types (House, Condo, Cabin, Loft), bedroom counts, and at least two more featured: true
];

export const getProperty = (slug: string) => properties.find((p) => p.slug === slug);
export const featuredProperties = () => properties.filter((p) => p.featured).slice(0, 3);
export const propertiesByNeighborhood = (slug: string) =>
  properties.filter((p) => p.neighborhoodSlug === slug);
```

When implementing, write out all nine properties fully. Do not leave the comment placeholder.

- [ ] **Step 5: Create businesses (2 to 3 per category)**

Create `src/content/businesses.ts`. Provide at least two businesses per service category (so each `/services/[category]` page is populated). Each business: name, slug, description, category matching a `serviceCategories` slug, serviceArea, 3 to 5 services, logo, coverImage, and contact fields. Mark a handful `featured: true`. Provide helpers:

```ts
import type { Business } from "./types";

export const businesses: Business[] = [
  /* at least 2 per category, fully written out */
];

export const getBusiness = (slug: string) => businesses.find((b) => b.slug === slug);
export const businessesByCategory = (category: string) =>
  businesses.filter((b) => b.category === category);
export const featuredBusinesses = () => businesses.filter((b) => b.featured);
```

- [ ] **Step 6: Create guides and sponsors**

Create `src/content/guides.ts` with the four homepage guides plus two more (Festival Housing Guide, Transportation Guide, Neighborhood Guide, Host Preparation Guide, plus one Dining and one Local Experiences guide). Each guide `content` is several real paragraphs. Provide `getGuide` and `latestGuides(n)` helpers.

Create `src/content/sponsors.ts`:

```ts
import type { Sponsor } from "./types";

export const sponsors: Sponsor[] = [
  { businessSlug: "summit-car-service", level: "festival", active: true },
  { businessSlug: "alpine-turnover-co", level: "category", active: true },
  { businessSlug: "bluebird-private-chef", level: "local", active: true },
];

export const activeSponsors = () => sponsors.filter((s) => s.active);
```

(Use sponsor businessSlugs that actually exist in `businesses.ts`.)

- [ ] **Step 7: Write seed integrity tests**

Create `tests/content.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { neighborhoods } from "@/content/neighborhoods";
import { serviceCategories } from "@/content/services";
import { properties } from "@/content/properties";
import { businesses } from "@/content/businesses";
import { sponsors } from "@/content/sponsors";

describe("seed content integrity", () => {
  it("has all nine neighborhoods with unique slugs", () => {
    expect(neighborhoods).toHaveLength(9);
    const slugs = new Set(neighborhoods.map((n) => n.slug));
    expect(slugs.size).toBe(9);
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
```

- [ ] **Step 8: Run tests**

Run: `npm test`
Expected: all content tests PASS. If a category lacks two businesses or a sponsor points at a missing slug, fix the seed data until green.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: typed seed content for properties, businesses, neighborhoods, guides"
```

---

### Task 5: Prisma schema, Neon, and client

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/lib/prisma.ts`
- Create: `.env.example`
- Modify: `.env.local` (local only, not committed)

- [ ] **Step 1: Define the Prisma schema**

Create `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum LeadSource {
  property_inquiry
  business_inquiry
  general_contact
  sponsor_inquiry
}

enum LeadStatus {
  new
  contacted
  closed
}

model Lead {
  id           String     @id @default(cuid())
  sourceType   LeadSource
  propertySlug String?
  businessSlug String?
  visitorName  String
  visitorEmail String
  visitorPhone String?
  message      String
  status       LeadStatus @default(new)
  createdAt    DateTime   @default(now())
}

model PropertySubmission {
  id               String     @id @default(cuid())
  name             String
  email            String
  phone            String?
  propertyAddress  String
  propertyType     String
  bedrooms         Int
  bathrooms        Int
  capacity         Int
  availabilityDates String?
  description      String
  status           LeadStatus @default(new)
  createdAt        DateTime   @default(now())
}
```

- [ ] **Step 2: Create the Prisma client singleton**

Create `src/lib/prisma.ts`:

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 3: Create .env.example and set local env**

Create `.env.example`:

```
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
RESEND_API_KEY="re_xxx"
LEADS_EMAIL="sdwbouldah55@gmail.com"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

In `.env.local` (create if missing, never commit), set the same keys with the real Neon `DATABASE_URL`. NOTE FOR OPERATOR: provision a Neon database (Vercel Neon integration or neon.tech) and paste the pooled connection string. Until then, the app builds but lead submission will error at runtime.

Confirm `.env*` is gitignored (create-next-app adds this by default; verify `.gitignore` contains `.env*`).

- [ ] **Step 4: Generate the client and push the schema**

```bash
npx prisma generate
npx prisma db push
```

Expected: `prisma generate` succeeds. `prisma db push` succeeds once `DATABASE_URL` points at a live Neon database. If Neon is not yet provisioned, skip `db push` and note it as a blocker for Task 6 runtime testing (the unit tests in Task 6 mock Prisma and do not need a live DB).

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma src/lib/prisma.ts .env.example
git commit -m "feat: Prisma schema for Lead and PropertySubmission with Neon"
```

---

### Task 6: Shared lead pipeline (validation, rate limit, email, server actions)

**Files:**
- Create: `src/lib/validation.ts`
- Create: `src/lib/rate-limit.ts`
- Create: `src/lib/email.ts`
- Create: `src/actions/submit-lead.ts`
- Create: `src/actions/submit-property.ts`
- Test: `tests/validation.test.ts`, `tests/rate-limit.test.ts`, `tests/submit-lead.test.ts`

- [ ] **Step 1: Write the validation test (failing)**

Create `tests/validation.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { leadSchema, propertySubmissionSchema } from "@/lib/validation";

describe("leadSchema", () => {
  it("accepts a valid property inquiry", () => {
    const result = leadSchema.safeParse({
      sourceType: "property_inquiry",
      propertySlug: "flatiron-view-retreat",
      visitorName: "Jane Guest",
      visitorEmail: "jane@example.com",
      visitorPhone: "303-555-0142",
      message: "Is this available the last week of January?",
      website: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = leadSchema.safeParse({
      sourceType: "general_contact",
      visitorName: "Jane",
      visitorEmail: "not-an-email",
      message: "Hello there friends",
      website: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects when honeypot is filled", () => {
    const result = leadSchema.safeParse({
      sourceType: "general_contact",
      visitorName: "Bot",
      visitorEmail: "bot@example.com",
      message: "spammy message here",
      website: "http://spam.example",
    });
    expect(result.success).toBe(false);
  });
});

describe("propertySubmissionSchema", () => {
  it("accepts a valid submission", () => {
    const result = propertySubmissionSchema.safeParse({
      name: "Host Helen",
      email: "helen@example.com",
      phone: "303-555-0190",
      propertyAddress: "123 Pearl St, Boulder, CO",
      propertyType: "House",
      bedrooms: 3,
      bathrooms: 2,
      capacity: 6,
      availabilityDates: "Jan 15 to Feb 1",
      description: "A lovely home near downtown with mountain views.",
      website: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects zero bedrooms", () => {
    const result = propertySubmissionSchema.safeParse({
      name: "Host", email: "h@example.com", propertyAddress: "x",
      propertyType: "House", bedrooms: 0, bathrooms: 1, capacity: 2,
      description: "short enough description text here", website: "",
    });
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run it to confirm failure**

Run: `npm test -- validation`
Expected: FAIL (`@/lib/validation` not found).

- [ ] **Step 3: Implement the zod schemas**

Create `src/lib/validation.ts`:

```ts
import { z } from "zod";

// Honeypot: must be empty. Bots fill hidden fields.
const honeypot = z.string().max(0, "spam detected");

export const leadSchema = z.object({
  sourceType: z.enum([
    "property_inquiry",
    "business_inquiry",
    "general_contact",
    "sponsor_inquiry",
  ]),
  propertySlug: z.string().optional(),
  businessSlug: z.string().optional(),
  visitorName: z.string().min(2, "Please enter your name").max(120),
  visitorEmail: z.string().email("Please enter a valid email"),
  visitorPhone: z.string().max(40).optional().or(z.literal("")),
  message: z.string().min(10, "Please add a little more detail").max(2000),
  website: honeypot, // honeypot field
});

export type LeadInput = z.infer<typeof leadSchema>;

export const propertySubmissionSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().max(40).optional().or(z.literal("")),
  propertyAddress: z.string().min(4, "Please enter the property address").max(240),
  propertyType: z.string().min(2).max(60),
  bedrooms: z.coerce.number().int().min(1).max(30),
  bathrooms: z.coerce.number().int().min(1).max(30),
  capacity: z.coerce.number().int().min(1).max(60),
  availabilityDates: z.string().max(240).optional().or(z.literal("")),
  description: z.string().min(20, "Please describe the property").max(4000),
  website: honeypot,
});

export type PropertySubmissionInput = z.infer<typeof propertySubmissionSchema>;
```

- [ ] **Step 4: Run validation tests**

Run: `npm test -- validation`
Expected: PASS.

- [ ] **Step 5: Write the rate-limit test (failing)**

Create `tests/rate-limit.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, __resetRateLimit } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => __resetRateLimit());

  it("allows up to the limit then blocks", () => {
    const ip = "1.2.3.4";
    for (let i = 0; i < 5; i++) expect(checkRateLimit(ip).ok).toBe(true);
    expect(checkRateLimit(ip).ok).toBe(false);
  });

  it("tracks different IPs independently", () => {
    expect(checkRateLimit("a").ok).toBe(true);
    expect(checkRateLimit("b").ok).toBe(true);
  });
});
```

- [ ] **Step 6: Run to confirm failure**

Run: `npm test -- rate-limit`
Expected: FAIL.

- [ ] **Step 7: Implement the rate limiter**

Create `src/lib/rate-limit.ts`:

```ts
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_WINDOW = 5;

type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

export function checkRateLimit(ip: string): { ok: boolean } {
  const now = Date.now();
  const entry = store.get(ip);
  if (!entry || entry.resetAt < now) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (entry.count >= MAX_PER_WINDOW) return { ok: false };
  entry.count += 1;
  return { ok: true };
}

// test helper
export function __resetRateLimit() {
  store.clear();
}
```

- [ ] **Step 8: Run rate-limit tests**

Run: `npm test -- rate-limit`
Expected: PASS.

- [ ] **Step 9: Implement the email wrapper**

Create `src/lib/email.ts`:

```ts
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const TO = process.env.LEADS_EMAIL ?? "sdwbouldah55@gmail.com";
const FROM = "Sundance Stay Collective <noreply@netgains.app>";

export async function sendLeadNotification(subject: string, lines: string[]) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set; skipping email send");
    return;
  }
  await resend.emails.send({
    from: FROM,
    to: TO,
    subject,
    text: lines.join("\n"),
  });
}
```

- [ ] **Step 10: Write the submit-lead action test (failing)**

Create `tests/submit-lead.test.ts`. Mock Prisma and email so no live services are needed:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const create = vi.fn();
vi.mock("@/lib/prisma", () => ({ prisma: { lead: { create: (...a: unknown[]) => create(...a) } } }));
const sendLeadNotification = vi.fn();
vi.mock("@/lib/email", () => ({ sendLeadNotification: (...a: unknown[]) => sendLeadNotification(...a) }));
vi.mock("@/lib/rate-limit", () => ({ checkRateLimit: () => ({ ok: true }) }));

import { submitLead } from "@/actions/submit-lead";

function form(data: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(data)) fd.set(k, v);
  return fd;
}

describe("submitLead", () => {
  beforeEach(() => { create.mockReset(); sendLeadNotification.mockReset(); });

  it("persists a valid lead and sends a notification", async () => {
    const result = await submitLead(
      { ok: false },
      form({
        sourceType: "general_contact",
        visitorName: "Jane Guest",
        visitorEmail: "jane@example.com",
        message: "I would love more information please.",
        website: "",
      }),
    );
    expect(result.ok).toBe(true);
    expect(create).toHaveBeenCalledOnce();
    expect(sendLeadNotification).toHaveBeenCalledOnce();
  });

  it("returns field errors and does not persist on invalid input", async () => {
    const result = await submitLead(
      { ok: false },
      form({ sourceType: "general_contact", visitorName: "x", visitorEmail: "bad", message: "short", website: "" }),
    );
    expect(result.ok).toBe(false);
    expect(create).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 11: Run to confirm failure**

Run: `npm test -- submit-lead`
Expected: FAIL (`submitLead` not found).

- [ ] **Step 12: Implement the submit-lead server action**

Create `src/actions/submit-lead.ts`:

```ts
"use server";

import { headers } from "next/headers";
import { leadSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { sendLeadNotification } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

export type FormState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string>;
};

export async function submitLead(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = leadSchema.safeParse(raw);

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (key !== "website") errors[key] = issue.message;
    }
    // Honeypot or validation failure both land here. Honeypot fails silently as success-looking.
    if (parsed.error.issues.some((i) => i.path[0] === "website")) {
      return { ok: true, message: "Thank you. We will be in touch soon." };
    }
    return { ok: false, errors, message: "Please fix the highlighted fields." };
  }

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip).ok) {
    return { ok: false, message: "Too many requests. Please try again shortly." };
  }

  const data = parsed.data;
  await prisma.lead.create({
    data: {
      sourceType: data.sourceType,
      propertySlug: data.propertySlug || null,
      businessSlug: data.businessSlug || null,
      visitorName: data.visitorName,
      visitorEmail: data.visitorEmail,
      visitorPhone: data.visitorPhone || null,
      message: data.message,
    },
  });

  await sendLeadNotification(`New ${data.sourceType.replace("_", " ")}`, [
    `Name: ${data.visitorName}`,
    `Email: ${data.visitorEmail}`,
    `Phone: ${data.visitorPhone || "n/a"}`,
    `Property: ${data.propertySlug || "n/a"}`,
    `Business: ${data.businessSlug || "n/a"}`,
    "",
    data.message,
  ]);

  return { ok: true, message: "Thank you. Your inquiry is on its way." };
}
```

- [ ] **Step 13: Implement the submit-property server action**

Create `src/actions/submit-property.ts`:

```ts
"use server";

import { headers } from "next/headers";
import { propertySubmissionSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { sendLeadNotification } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import type { FormState } from "./submit-lead";

export async function submitProperty(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = propertySubmissionSchema.safeParse(raw);

  if (!parsed.success) {
    if (parsed.error.issues.some((i) => i.path[0] === "website")) {
      return { ok: true, message: "Thank you. We will review your property." };
    }
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (key !== "website") errors[key] = issue.message;
    }
    return { ok: false, errors, message: "Please fix the highlighted fields." };
  }

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip).ok) {
    return { ok: false, message: "Too many requests. Please try again shortly." };
  }

  const d = parsed.data;
  await prisma.propertySubmission.create({
    data: {
      name: d.name, email: d.email, phone: d.phone || null,
      propertyAddress: d.propertyAddress, propertyType: d.propertyType,
      bedrooms: d.bedrooms, bathrooms: d.bathrooms, capacity: d.capacity,
      availabilityDates: d.availabilityDates || null, description: d.description,
    },
  });

  await sendLeadNotification("New property submission", [
    `Name: ${d.name}`, `Email: ${d.email}`, `Phone: ${d.phone || "n/a"}`,
    `Address: ${d.propertyAddress}`, `Type: ${d.propertyType}`,
    `Bedrooms: ${d.bedrooms}  Bathrooms: ${d.bathrooms}  Sleeps: ${d.capacity}`,
    `Availability: ${d.availabilityDates || "n/a"}`, "", d.description,
  ]);

  return { ok: true, message: "Thank you. We will review your property and reach out." };
}
```

- [ ] **Step 14: Run all unit tests**

Run: `npm test`
Expected: validation, rate-limit, submit-lead, and content tests all PASS.

- [ ] **Step 15: Commit**

```bash
git add -A
git commit -m "feat: hardened lead pipeline with validation, rate limit, email, server actions"
```

---

### Task 7: Reusable cards, section header, and form components

**Files:**
- Create: `src/components/ui/SectionHeader.tsx`
- Create: `src/components/cards/PropertyCard.tsx`
- Create: `src/components/cards/BusinessCard.tsx`
- Create: `src/components/cards/NeighborhoodCard.tsx`
- Create: `src/components/cards/GuideCard.tsx`
- Create: `src/components/forms/FormStatus.tsx`
- Create: `src/components/forms/InquiryForm.tsx`
- Create: `src/components/forms/PropertySubmissionForm.tsx`
- Modify: `next.config.ts` (allow Unsplash images)

- [ ] **Step 1: Allow remote images**

In `next.config.ts`, add:

```ts
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};
export default nextConfig;
```

- [ ] **Step 2: SectionHeader**

Create `src/components/ui/SectionHeader.tsx`:

```tsx
export function SectionHeader({
  eyebrow, title, intro, align = "left",
}: { eyebrow?: string; title: string; intro?: string; align?: "left" | "center" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-copper">{eyebrow}</p>
      )}
      <h2 className="font-heading text-3xl text-charcoal md:text-4xl">{title}</h2>
      {intro && <p className="mt-4 text-base leading-relaxed text-charcoal/70">{intro}</p>}
    </div>
  );
}
```

- [ ] **Step 3: PropertyCard**

Create `src/components/cards/PropertyCard.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/content/types";
import { getNeighborhood } from "@/content/neighborhoods";

export function PropertyCard({ property }: { property: Property }) {
  const hood = getNeighborhood(property.neighborhoodSlug);
  const img = property.images[0];
  return (
    <Link href={`/stay/${property.slug}`} className="group block overflow-hidden rounded-card bg-white shadow-sm ring-1 ring-charcoal/5 transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={img.url} alt={img.alt} fill sizes="(max-width:768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105" />
        {property.featured && (
          <span className="absolute left-4 top-4 rounded-full bg-copper px-3 py-1 text-xs font-medium text-white">Featured</span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-heading text-xl text-charcoal">{property.title}</h3>
        <p className="mt-1 text-sm text-charcoal/60">{hood?.name}, {property.city}</p>
        <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{property.summary}</p>
        <p className="mt-4 text-xs uppercase tracking-wide text-charcoal/50">
          Sleeps {property.capacity} · {property.bedrooms} bd · {property.bathrooms} ba
        </p>
      </div>
    </Link>
  );
}
```

- [ ] **Step 4: BusinessCard, NeighborhoodCard, GuideCard**

Create the three remaining cards following the same pattern (Image + Link + title + blurb). 

`BusinessCard.tsx` links to `/business/[slug]`, shows logo or coverImage, name, serviceArea, and first two services.

`NeighborhoodCard.tsx` links to `/stay?neighborhood=[slug]`, shows the neighborhood image with the name overlaid on a charcoal gradient.

`GuideCard.tsx` links to `/guides/[slug]`, shows featuredImage, category eyebrow, title, and excerpt.

Each uses `next/image` with `fill`, explicit `sizes`, and `object-cover`. Write each out fully when implementing.

- [ ] **Step 5: FormStatus**

Create `src/components/forms/FormStatus.tsx`:

```tsx
import type { FormState } from "@/actions/submit-lead";

export function FormStatus({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <p
      role="status"
      className={`rounded-card px-4 py-3 text-sm ${
        state.ok ? "bg-mountain/10 text-mountain" : "bg-copper/10 text-copper"
      }`}
    >
      {state.message}
    </p>
  );
}
```

- [ ] **Step 6: InquiryForm (client component)**

Create `src/components/forms/InquiryForm.tsx`:

```tsx
"use client";

import { useActionState } from "react";
import { submitLead, type FormState } from "@/actions/submit-lead";
import { FormStatus } from "./FormStatus";

type Props = {
  sourceType: "property_inquiry" | "business_inquiry" | "general_contact" | "sponsor_inquiry";
  propertySlug?: string;
  businessSlug?: string;
  submitLabel?: string;
};

const initial: FormState = { ok: false };

export function InquiryForm({ sourceType, propertySlug, businessSlug, submitLabel = "Submit Inquiry" }: Props) {
  const [state, action, pending] = useActionState(submitLead, initial);

  if (state.ok) return <FormStatus state={state} />;

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="sourceType" value={sourceType} />
      {propertySlug && <input type="hidden" name="propertySlug" value={propertySlug} />}
      {businessSlug && <input type="hidden" name="businessSlug" value={businessSlug} />}
      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off"
        className="absolute left-[-9999px]" aria-hidden="true" />

      <Field label="Name" name="visitorName" error={state.errors?.visitorName} required />
      <Field label="Email" name="visitorEmail" type="email" error={state.errors?.visitorEmail} required />
      <Field label="Phone" name="visitorPhone" type="tel" error={state.errors?.visitorPhone} />
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-charcoal">Message</label>
        <textarea id="message" name="message" rows={4} required
          className="mt-1 w-full rounded-card border border-charcoal/20 px-3 py-2 text-sm focus:border-mountain focus:outline-none focus:ring-1 focus:ring-mountain" />
        {state.errors?.message && <p className="mt-1 text-xs text-copper">{state.errors.message}</p>}
      </div>
      <FormStatus state={state} />
      <button type="submit" disabled={pending}
        className="w-full rounded-card bg-mountain px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-charcoal disabled:opacity-60">
        {pending ? "Sending..." : submitLabel}
      </button>
    </form>
  );
}

function Field({ label, name, type = "text", error, required }: {
  label: string; name: string; type?: string; error?: string; required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-charcoal">
        {label}{required && <span className="text-copper"> *</span>}
      </label>
      <input id={name} name={name} type={type} required={required}
        className="mt-1 w-full rounded-card border border-charcoal/20 px-3 py-2 text-sm focus:border-mountain focus:outline-none focus:ring-1 focus:ring-mountain" />
      {error && <p className="mt-1 text-xs text-copper">{error}</p>}
    </div>
  );
}
```

- [ ] **Step 7: PropertySubmissionForm (client component)**

Create `src/components/forms/PropertySubmissionForm.tsx` using `useActionState(submitProperty, initial)`. Fields: name, email, phone, propertyAddress, propertyType (select: House, Condo, Cabin, Loft, Townhome), bedrooms, bathrooms, capacity (number inputs), availabilityDates (text), description (textarea), plus the same hidden honeypot `website` field. Reuse the same input styling. Show `FormStatus` and a disabled-while-pending submit button labeled "Submit Property". On `state.ok`, render only the success `FormStatus`.

- [ ] **Step 8: Verify build and commit**

Run: `npm run build`
Expected: build succeeds (type check passes). Fix any type errors.

```bash
git add -A
git commit -m "feat: reusable cards, section header, inquiry and property forms"
```

---

### Task 8: Home page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Build the home page**

Replace `src/app/page.tsx` with a server component composing these sections in order, using the seed helpers and components from Tasks 4 and 7:

1. **Hero** — full-bleed `next/image` Boulder mountain photo (`priority`, explicit sizes), charcoal gradient overlay, `h1` "Your Guide to Staying in Boulder During Festival Season", subheadline, and two CTAs: `<Cta href="/stay">Find Lodging</Cta>` and `<Cta href="/list-your-home" variant="secondary">List Your Home</Cta>`.
2. **Featured Properties** — `SectionHeader` + grid of `featuredProperties()` mapped to `PropertyCard`.
3. **Featured Services** — `SectionHeader` + the five highlighted categories (transportation, cleaning, private-chef, photography, concierge) as linked cards to `/services/[slug]`.
4. **Neighborhood Explorer** — `SectionHeader` + responsive grid of all nine `neighborhoods` as `NeighborhoodCard`.
5. **Latest Guides** — `SectionHeader` + `latestGuides(4)` as `GuideCard`.
6. **Sponsor strip** — small, muted row reading "Festival Season partners" with `activeSponsors()` business names (tasteful, not intrusive).

Wrap sections in `<section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">` with appropriate `aria-labelledby`.

- [ ] **Step 2: Verify visually**

Run: `npm run dev`, open http://localhost:3000. Confirm hero, all six sections, and footer disclaimer render with images loading. Check mobile width (375px) in dev tools for no overflow.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: home page with hero, featured properties, services, neighborhoods, guides"
```

---

### Task 9: Stay page (grid + filters)

**Files:**
- Create: `src/app/stay/page.tsx`
- Create: `src/components/stay/StayFilters.tsx`

- [ ] **Step 1: Build the filter + grid experience**

`src/app/stay/page.tsx` is a server component reading `searchParams` (`neighborhood`, `type`, `guests`, `bedrooms`, `bathrooms`). It filters `properties` accordingly and renders:
- A page header with a grid/map toggle. Map view renders a styled placeholder panel ("Map view is coming for Festival Season") so the toggle exists without a live map.
- `StayFilters` (a client component) that updates the URL query string (URL as state) with selects for neighborhood (from `neighborhoods`), property type, guests, bedrooms, bathrooms.
- A responsive grid of filtered `PropertyCard`s, with an empty state ("No stays match these filters yet. Try widening your search.") when none match.

`StayFilters.tsx` uses `useRouter` and `useSearchParams` to push query updates on change. Each select includes an "Any" option.

- [ ] **Step 2: Verify filtering**

Run dev, visit `/stay`, change filters, confirm the URL updates and the grid reflects filters. Visit `/stay?neighborhood=north-boulder` directly and confirm it pre-filters (this is the link target from NeighborhoodCard).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: stay page with URL-driven filters and grid"
```

---

### Task 10: Property detail page

**Files:**
- Create: `src/app/stay/[slug]/page.tsx`

- [ ] **Step 1: Build the detail page**

Server component. `generateStaticParams` from `properties`. Use `getProperty(slug)`; call `notFound()` if missing. Layout:
- Hero gallery: large primary image plus a thumbnail strip of the rest.
- Two column below: left = description, amenities grid (checkmark list), neighborhood blurb from `getNeighborhood`. Right = a sticky card containing `<InquiryForm sourceType="property_inquiry" propertySlug={property.slug} submitLabel="Submit Inquiry" />`.
- Related properties: up to three other properties in the same neighborhood (fallback to other featured), as `PropertyCard`s.
- `generateMetadata` produces a per property title and description (Task 17 helper).

- [ ] **Step 2: Verify**

Run dev, open a property from the home or stay grid. Confirm gallery, amenities, inquiry form, and related properties render. Submit the form with invalid data to confirm inline errors; with valid data confirm the success state (will error on DB write if Neon is not provisioned, which is expected until then).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: property detail page with gallery and inquiry form"
```

---

### Task 11: Services index and category pages

**Files:**
- Create: `src/app/services/page.tsx`
- Create: `src/app/services/[category]/page.tsx`

- [ ] **Step 1: Services index**

`/services` server component: hero/intro, then a grid of all eleven `serviceCategories` as cards linking to `/services/[slug]`, each showing image, name, blurb, and a count of businesses in that category.

- [ ] **Step 2: Category page**

`/services/[category]` server component: `generateStaticParams` from `serviceCategories`. Use `getServiceCategory`; `notFound()` if missing. Render the category header and a grid of `businessesByCategory(slug)` as `BusinessCard`s, with an empty state if none. `generateMetadata` per category.

- [ ] **Step 3: Verify and commit**

Run dev, visit `/services` and click into two categories. Confirm businesses render.

```bash
git add -A
git commit -m "feat: services index and category listing pages"
```

---

### Task 12: Business detail page

**Files:**
- Create: `src/app/business/[slug]/page.tsx`

- [ ] **Step 1: Build the business page**

Server component. `generateStaticParams` from `businesses`. `getBusiness(slug)`; `notFound()` if missing. Layout: cover image banner with logo, business name, service area; description; services list; the business's own website/phone/email shown as its public contact details (this is the business's info, NOT the lead inbox); and an `<InquiryForm sourceType="business_inquiry" businessSlug={business.slug} submitLabel="Contact This Business" />`. `generateMetadata` per business.

- [ ] **Step 2: Verify and commit**

Run dev, open a business from a category page. Confirm details and the inquiry form render.

```bash
git add -A
git commit -m "feat: business detail page with inquiry form"
```

---

### Task 13: List Your Home page

**Files:**
- Create: `src/app/list-your-home/page.tsx`

- [ ] **Step 1: Build the page**

Server component. Sections: overview hero; benefits (three to four value props); pricing (three tiers Basic / Featured / Premier shown as cards with feature lists and a "Contact for pricing" CTA, no dollar figures); how it works (numbered steps); licensing resources (a short, clearly framed note linking to City of Boulder short term rental licensing as an external resource, with a disclaimer that hosts are responsible for their own licensing and compliance); then the `PropertySubmissionForm` in a prominent card. `generateMetadata` for the page.

- [ ] **Step 2: Verify and commit**

Run dev, visit `/list-your-home`. Submit the property form with invalid then valid data; confirm inline errors and success state behavior.

```bash
git add -A
git commit -m "feat: list your home page with submission form"
```

---

### Task 14: Guides index and detail

**Files:**
- Create: `src/app/guides/page.tsx`
- Create: `src/app/guides/[slug]/page.tsx`

- [ ] **Step 1: Guides index**

`/guides` server component: header, then a grid of all guides as `GuideCard`s, optionally grouped by category.

- [ ] **Step 2: Guide detail**

`/guides/[slug]`: `generateStaticParams` from guides. `getGuide`; `notFound()` if missing. Render hero image, title, category eyebrow, the `content` paragraphs (split on blank lines into `<p>` elements within a readable `max-w-prose` column), a tasteful sponsor placement slot, and related guides (`relatedSlugs`) as `GuideCard`s. `generateMetadata` per guide.

- [ ] **Step 3: Verify and commit**

Run dev, open `/guides` and read two guides. Confirm content and related guides render.

```bash
git add -A
git commit -m "feat: guides index and article pages"
```

---

### Task 15: Advertise page

**Files:**
- Create: `src/app/advertise/page.tsx`

- [ ] **Step 1: Build the page**

Server component. Intro on reaching Festival Season visitors, then three tier cards:
- **Local Sponsor**: business listing, category placement, full profile.
- **Category Sponsor**: one per category, featured placement, premium exposure.
- **Festival Sponsor**: maximum three, homepage exposure, premium positioning, sitewide visibility.
Each card lists its benefits and a CTA that scrolls to or reveals an `<InquiryForm sourceType="sponsor_inquiry" submitLabel="Request Sponsor Info" />` at the bottom. No dollar figures; "Contact for pricing". `generateMetadata` for the page.

- [ ] **Step 2: Verify and commit**

Run dev, visit `/advertise`. Confirm three tiers and the sponsor inquiry form render.

```bash
git add -A
git commit -m "feat: advertise page with three sponsor tiers"
```

---

### Task 16: Contact page

**Files:**
- Create: `src/app/contact/page.tsx`

- [ ] **Step 1: Build the page**

Server component. Brief intro, the three journeys as quick links (Stay, List Your Home, Services), and a prominent `<InquiryForm sourceType="general_contact" submitLabel="Send Message" />`. No email address shown anywhere. `generateMetadata` for the page.

- [ ] **Step 2: Verify and commit**

Run dev, visit `/contact`. Confirm the form renders and no email address is visible.

```bash
git add -A
git commit -m "feat: contact page with general inquiry form"
```

---

### Task 17: SEO (metadata helper, sitemap, robots, JSON-LD)

**Files:**
- Create: `src/lib/seo.ts`
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Modify: page files to use `pageMetadata` in their `generateMetadata`

- [ ] **Step 1: Metadata helper and Organization JSON-LD**

Create `src/lib/seo.ts`:

```ts
import type { Metadata } from "next";
import { SITE } from "./site";

export function pageMetadata({
  title, description, path = "/", image,
}: { title: string; description: string; path?: string; image?: string }): Metadata {
  const url = `${SITE.url}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description, url, siteName: SITE.name, type: "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image", title: `${title} | ${SITE.name}`, description,
      images: image ? [image] : undefined,
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    areaServed: "Boulder, Colorado",
  };
}
```

- [ ] **Step 2: Apply pageMetadata across pages**

In each page from Tasks 8 to 16, export `generateMetadata` (or static `metadata`) using `pageMetadata(...)` with a tailored title/description/path, and for detail pages pass the primary image. Add a `<script type="application/ld+json">` with `organizationJsonLd()` to the home page.

- [ ] **Step 3: Sitemap**

Create `src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { properties } from "@/content/properties";
import { businesses } from "@/content/businesses";
import { guides } from "@/content/guides";
import { serviceCategories } from "@/content/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const staticRoutes = ["", "/stay", "/services", "/list-your-home", "/guides", "/advertise", "/contact"];
  const urls: MetadataRoute.Sitemap = staticRoutes.map((r) => ({ url: `${base}${r}` }));
  for (const p of properties) urls.push({ url: `${base}/stay/${p.slug}` });
  for (const b of businesses) urls.push({ url: `${base}/business/${b.slug}` });
  for (const g of guides) urls.push({ url: `${base}/guides/${g.slug}` });
  for (const c of serviceCategories) urls.push({ url: `${base}/services/${c.slug}` });
  return urls;
}
```

- [ ] **Step 4: Robots**

Create `src/app/robots.ts`:

```ts
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
```

- [ ] **Step 5: Verify and commit**

Run: `npm run build`, then `npm run dev` and visit `/sitemap.xml` and `/robots.txt`. Confirm both render with the seeded URLs.

```bash
git add -A
git commit -m "feat: SEO metadata helper, sitemap, robots, and JSON-LD"
```

---

### Task 18: Final verification and polish

**Files:**
- Various (fixes as needed)

- [ ] **Step 1: Full test suite**

Run: `npm test`
Expected: all unit tests PASS.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: build succeeds with no type errors. Note any pages that should be static vs dynamic.

- [ ] **Step 3: Manual journey walk-through**

With `npm run dev`, verify each of the three core journeys end to end:
1. Home to Stay to Property detail to Submit Inquiry (success state).
2. Home to List Your Home to Submit Property (success state).
3. Home to Services to a category to a Business to Contact This Business.
Confirm the footer disclaimer appears on every page and no email address is ever shown.

- [ ] **Step 4: Accessibility and responsive pass**

At 375px, 768px, and 1440px confirm no horizontal overflow, readable contrast (charcoal on white, white on charcoal/mountain), focus rings on links/buttons/inputs, and that all images have meaningful `alt`. Verify nav is reachable and the mobile CTA shows under `md`.

- [ ] **Step 5: Commit final state**

```bash
git add -A
git commit -m "chore: final verification pass for v1 marketing site"
```

---

## Operator notes (out of band, not code tasks)

These require Scott or external provisioning and are NOT blockers for building the UI:

1. **Neon database** — provision and set `DATABASE_URL` in `.env.local` and Vercel. Until set, lead form submissions error at runtime (UI, validation, and unit tests all work without it).
2. **Resend** — set `RESEND_API_KEY`. The `from` address uses `noreply@netgains.app` (already verified for your other projects); confirm or change. Until set, the app logs a warning and skips the email but still persists the lead.
3. **`NEXT_PUBLIC_SITE_URL`** — set to the production domain before deploy so canonical/OG/sitemap URLs are absolute.
4. **Domain** — choose and connect (e.g. sundancestaycollective.com) at deploy time.
5. **Photography** — Unsplash seed images are placeholders cleared for development. Swap for licensed or owned imagery before any paid promotion.

## Spec coverage check

- Home, Stay, Property detail, List Your Home, Services, Business detail, Guides, Advertise, Contact: Tasks 8 to 16. Covered.
- Three sponsor tiers and revenue model framing: Task 15. Covered (pricing deferred per decision).
- DB models Lead and PropertySubmission: Task 5. Other models exist as seed interfaces (Task 4) per the marketing-first decision.
- Lead management (capture, email, status default): Task 6. Admin UI deferred per spec.
- Design system, fonts, tokens, disclaimer: Tasks 2, 3.
- SEO, sitemap, schema, OG: Task 17. Covered.
- Mobile, performance, accessibility: Tasks 8 to 18 verification steps. Covered.
- Deferred (admin UI, Stripe, real map, automation, reviews/favorites/messaging): documented, not built. Matches spec Phase 2/3.
