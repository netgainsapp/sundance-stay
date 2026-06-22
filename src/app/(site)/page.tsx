import Image from "next/image";
import Link from "next/link";
import { Cta } from "@/components/ui/Cta";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PropertyCard } from "@/components/cards/PropertyCard";
import { NeighborhoodCard } from "@/components/cards/NeighborhoodCard";
import { GuideCard } from "@/components/cards/GuideCard";
import { featuredProperties } from "@/content/properties";
import { neighborhoods } from "@/content/neighborhoods";
import { getServiceCategory } from "@/content/services";
import { latestGuides } from "@/content/guides";
import { activeSponsors } from "@/content/sponsors";
import { getBusiness } from "@/content/businesses";
import { pageMetadata, organizationJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Boulder Lodging and Local Services for Festival Season",
  description: SITE.description,
  path: "/",
});

const FEATURED_SERVICE_SLUGS = [
  "transportation",
  "cleaning",
  "private-chef",
  "photography",
  "concierge",
];

export default function Home() {
  const featured = featuredProperties();
  const services = FEATURED_SERVICE_SLUGS.map((slug) =>
    getServiceCategory(slug)
  ).filter((c): c is NonNullable<typeof c> => Boolean(c));
  const sponsors = activeSponsors();

  return (
    <>
      <section className="relative flex min-h-[80vh] items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600104146011-ad1a8571f161?w=2000&q=80"
          alt="The Boulder Flatirons rising above the Chautauqua meadow"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-charcoal/10" />
        <div className="relative mx-auto w-full max-w-7xl px-6 py-24">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-copper">
            Boulder, Colorado
          </p>
          <h1 className="mt-4 max-w-3xl font-heading text-4xl text-white md:text-6xl">
            Your Guide to Staying in Boulder During Festival Season
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85">
            Discover lodging, local services, and trusted Boulder area
            resources.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Cta href="/stay">Find Lodging</Cta>
            <Cta
              href="/list-your-home"
              variant="secondary"
              className="!border-white !text-white hover:!bg-white hover:!text-charcoal"
            >
              List Your Home
            </Cta>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
        <SectionHeader
          eyebrow="Featured Stays"
          title="Handpicked homes for your visit"
          intro="A curated set of Boulder area homes chosen for comfort, character, and an easy reach to the festivals and the foothills."
        />
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {featured.map((property) => (
            <PropertyCard key={property.slug} property={property} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
        <SectionHeader
          eyebrow="Local Services"
          title="Everything you need on the ground"
          intro="Trusted Boulder partners for transportation, cleaning, dining, and the details that make a stay feel effortless."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-5">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group block"
            >
              <div className="relative aspect-square overflow-hidden rounded-card">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="(max-width:768px) 50vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-3 font-heading text-base text-charcoal">
                {service.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
        <SectionHeader
          eyebrow="Where to Stay"
          title="Explore Boulder area neighborhoods"
          intro="From the walkable downtown core to the quieter foothills and the surrounding towns, each neighborhood sets a different tone for your trip."
        />
        <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {neighborhoods.map((neighborhood) => (
            <NeighborhoodCard
              key={neighborhood.slug}
              neighborhood={neighborhood}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
        <div className="flex flex-col items-start justify-between gap-6 rounded-card bg-mountain px-8 py-10 text-white md:flex-row md:items-center md:px-12">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-sand">
              Just in case
            </p>
            <h2 className="mt-2 font-heading text-2xl text-white md:text-3xl">
              Everything booked? We make the match.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/85">
              When Festival Season fills up, we match last-minute guests with
              Boulder homeowners on standby. Tell us what you need and we connect you.
            </p>
          </div>
          <Link
            href="/last-minute"
            className="inline-flex flex-none items-center justify-center rounded-card bg-white px-7 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-sand"
          >
            Last-minute stays
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
        <SectionHeader
          eyebrow="Guides"
          title="Plan your Festival Season trip"
          intro="Practical guidance on lodging, transportation, dining, and the neighborhoods that shape a Boulder stay."
        />
        <div className="mt-12 grid gap-8 md:grid-cols-4">
          {latestGuides(4).map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      </section>

      <section className="bg-sand/20 py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-xs uppercase tracking-widest text-charcoal/50">
            Festival Season partners
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {sponsors.map((sponsor) => {
              const business = getBusiness(sponsor.businessSlug);
              return (
                <span
                  key={sponsor.businessSlug}
                  className="font-heading text-lg text-charcoal/70"
                >
                  {business?.name ?? sponsor.businessSlug}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd()),
        }}
      />
    </>
  );
}
