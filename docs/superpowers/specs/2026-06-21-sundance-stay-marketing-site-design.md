# Sundance Stay Collective — v1 Design Spec

Date: 2026-06-21
Status: Approved for planning
Scope: v1 public marketing site with lead capture. First slice of a larger 3 phase platform.

## Context

Sundance Film Festival officially relocates to Boulder, Colorado starting January 2027.
Sundance Stay Collective is a trusted local lodging and services resource for visitors,
hosts, and local businesses during Festival Season and future Boulder area events.

The product is positioned as 70 percent tourism website, 20 percent luxury travel, and
10 percent marketplace. It must read as a premium, trustworthy, local, curated, editorial,
hospitality first destination guide. It is NOT an Airbnb clone, NOT a classifieds site,
NOT a generic marketplace.

The platform serves three user journeys, and every page must support one of them:
1. I need a place to stay.
2. I want to list my property.
3. I need local services.

### Brand and legal positioning

Trusted local resource. Not official. Not affiliated. Community driven. Hospitality focused.

A sitewide disclaimer appears in the footer on every page:

> Not affiliated with, endorsed by, or sponsored by Sundance Institute or the Sundance Film Festival.

## Scope decisions

The full platform spec spans three phases. This document covers v1 only.

| Decision | Choice | Rationale |
|----------|--------|-----------|
| First deliverable | Public marketing site | The tourism site is the foundation. There is no real property or business inventory to manage yet, so a DB backed admin is premature. Mirrors the radius-reach-site vs radius-reach-platform split. |
| Project location | `C:\Users\sweis\sundance-stay` (off Google Drive) | Google Drive blocks node_modules in the Instructors working directory. |
| Lead persistence | Neon Postgres via Prisma, plus Resend notification | Leads persist so none are lost, and a notification email fires on each submission. |
| Seed content | Curated realistic seed data | Site is demo ready and sellable immediately. Typed against the future DB models for a clean later migration. |
| Lead inbox | `sdwbouldah55@gmail.com` (env `LEADS_EMAIL`) | Temporary. Never displayed or identified on the site. Server side only. All public forms use CTA buttons, never an exposed email address. |

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Prisma + Neon Postgres (v1 uses two tables only: `Lead`, `PropertySubmission`)
- Resend for transactional notification email
- `next/font` for Playfair Display (headings) and Inter (body)
- `next/image` for optimized, photo forward layouts
- Vercel for hosting
- zod for input validation

Content for properties, businesses, neighborhoods, and guides lives in typed seed modules
under `src/content/*.ts`. These are version controlled, fast, and swappable for a CMS later.
The seed types mirror the eventual DB models 1:1 so migration is a lift, not a rewrite.

## Information architecture (routes, all public)

- `/` Home
- `/stay` Property search (grid + filters; map view is a styled placeholder in v1)
- `/stay/[slug]` Property detail with inquiry form
- `/services` Service category grid
- `/services/[category]` Businesses within a category
- `/business/[slug]` Business profile with inquiry form
- `/list-your-home` Host overview, benefits, pricing, how it works, licensing resources, property submission form
- `/guides` Guide index
- `/guides/[slug]` Guide article with related guides
- `/advertise` Three sponsor tiers (Local, Category, Festival)
- `/contact` General contact form

Primary navigation: Home, Stay, List Your Home, Services, Guides, Advertise, Contact.

### Page contents

**Home**
- Hero: large Boulder mountain image, headline "Your Guide to Staying in Boulder During Festival Season", subheadline, primary CTA "Find Lodging", secondary CTA "List Your Home"
- Featured Properties: 3 large image cards
- Featured Services: Transportation, Cleaning, Private Chefs, Photography, Concierge
- Neighborhood Explorer: interactive cards for Downtown Boulder, University Hill, North Boulder, South Boulder, Louisville, Lafayette, Longmont, Broomfield, Denver
- Latest Guides: Festival Housing Guide, Transportation Guide, Neighborhood Guide, Host Preparation Guide
- Sponsor strip: tasteful, small, not intrusive
- Footer with sitewide disclaimer

**Stay**
- Grid view and map view toggle (map is a styled placeholder in v1)
- Filters: guests, bedrooms, bathrooms, neighborhood, property type
- Property cards: large image, title, location, guests, bedrooms, short summary, View Listing

**Property detail**
- Hero gallery, property information, amenities, location, neighborhood blurb
- Availability inquiry and host contact form (single inquiry form), related properties, Submit Inquiry CTA

**List Your Home**
- Overview, benefits, pricing, how it works, licensing resources
- Submit Property form: name, email, phone, property address, property type, bedrooms, bathrooms, guest capacity, availability dates, photos (URL or upload deferred to Phase 2; v1 collects description and details), description

**Services**
- Categories: Transportation, Cleaning, Photography, Private Chef, Catering, Child Care, Pet Care, Concierge, Home Preparation, Snow Removal, Property Maintenance
- Each category: grid of business listings

**Business detail**
- Logo, cover image, description, services, service area, contact form, website, phone, email (the business's own contact details are shown; the lead inbox is not), Inquiry CTA

**Guides**
- Categories: Festival Lodging, Transportation, Neighborhoods, Host Resources, Local Experiences, Dining
- Each guide: hero image, article content, related guides, sponsor placement slot

**Advertise**
- Local Sponsor: business listing, category placement, full profile
- Category Sponsor: one per category, featured placement, premium exposure
- Festival Sponsor: maximum three, homepage exposure, premium positioning, sitewide visibility

## Data model

### Seed content interfaces (not in DB for v1)

Typed to mirror the future DB models so a later migration is 1:1.

- `Property`: id, title, slug, description, propertyType, bedrooms, bathrooms, capacity, address, city, state, zip, neighborhoodSlug, featured, tier, summary, amenities[], images[]
- `PropertyImage`: url, sortOrder, alt
- `Business`: id, name, slug, description, category, website, phone, email, logo, coverImage, serviceArea, services[], featured, tier
- `Neighborhood`: id, name, slug, description, image
- `Guide`: id, title, slug, content, featuredImage, category, excerpt, relatedSlugs[]
- `Sponsor`: id, businessSlug, level, active

### Live DB tables (Prisma + Neon)

- `Lead`: id, sourceType (property_inquiry | business_inquiry | general_contact | sponsor_inquiry), propertySlug?, businessSlug?, visitorName, visitorEmail, visitorPhone?, message, status (new | contacted | closed, default new), createdAt
- `PropertySubmission`: id, name, email, phone, propertyAddress, propertyType, bedrooms, bathrooms, capacity, availabilityDates, description, status (default new), createdAt

## Lead and inquiry flow

One hardened submission pipeline shared by all forms:

1. Client form submits to a Server Action
2. zod validation of all fields
3. Honeypot field check and coarse per IP rate limiting (anti spam)
4. Persist a row to Neon via Prisma (`Lead` or `PropertySubmission`)
5. Fire a Resend notification email to `LEADS_EMAIL` (server side only, never exposed)
6. Return a friendly success state to the user

Forms covered: property inquiry, business inquiry, property submission, general contact.
The advertise page sponsor inquiry routes through the general contact pipeline with
`sourceType = sponsor_inquiry`.

## Design system

Colors (CSS variable tokens):
- Charcoal `#1F2933`
- Mountain Blue `#1D4E89`
- Warm Sand `#D9C4A1`
- Copper `#B87333`
- White `#FFFFFF`

Typography: Playfair Display for headings, Inter for body.

Rules: large photography, generous whitespace, minimal clutter, large cards, editorial
layouts, limited animation, fast performance, mobile first, WCAG AA accessibility.

Photography: license safe Boulder and Colorado mountain imagery for seed (Unsplash),
clearly swappable. Explicit width and height on all images, lazy loading below the fold,
eager plus high fetch priority on hero media only.

## SEO

Per page titles, meta descriptions, canonical URLs, OpenGraph and Twitter cards.
Schema markup (Organization, WebSite, and per type where relevant). XML sitemap and
robots. Neighborhood, guide, property, and business pages are the primary SEO surfaces.
`NEXT_PUBLIC_SITE_URL` drives absolute URLs and must be set in production.

## Performance targets

Lighthouse 90+, Core Web Vitals within target (LCP < 2.5s, INP < 200ms, CLS < 0.1).
Image optimization, lazy loading, SSR, two font families max with `font-display: swap`.

## Explicitly deferred (Phase 2 and later)

Admin dashboard UI, Stripe payments, featured and premier paid tiers as live billing,
real interactive map, sponsor self serve, email automation, lead status management UI,
reviews, favorites, messaging, concierge requests, advanced analytics, photo upload.

The schema and content interfaces are designed so these slot in without rework.

## Success criteria

- All ten route groups render with curated seed content and read as a premium hospitality guide
- All four form types validate, persist to Neon, and trigger a Resend notification
- No email address is ever displayed or identified on the public site
- Sitewide disclaimer present in the footer on every page
- WCAG AA, mobile first, Lighthouse 90+ on key pages
- Every page supports one of the three core journeys
