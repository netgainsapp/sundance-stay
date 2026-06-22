import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PropertyCard } from "@/components/cards/PropertyCard";
import { InquiryForm } from "@/components/forms/InquiryForm";
import {
  properties,
  getProperty,
  featuredProperties,
  propertiesByNeighborhood,
} from "@/content/properties";
import { getNeighborhood } from "@/content/neighborhoods";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export async function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) {
    return pageMetadata({
      title: "Stay not found",
      description: SITE.description,
      path: `/stay/${slug}`,
    });
  }
  return pageMetadata({
    title: property.title,
    description: property.summary,
    path: `/stay/${property.slug}`,
    image: property.images[0]?.url,
  });
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) notFound();

  const hood = getNeighborhood(property.neighborhoodSlug);
  const primary = property.images[0];
  const rest = property.images.slice(1);

  const sameHood = propertiesByNeighborhood(property.neighborhoodSlug).filter(
    (p) => p.slug !== property.slug
  );
  const related = (
    sameHood.length > 0
      ? sameHood
      : featuredProperties().filter((p) => p.slug !== property.slug)
  ).slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-card">
        <Image
          src={primary.url}
          alt={primary.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      {rest.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {rest.map((img) => (
            <div
              key={img.sortOrder}
              className="relative aspect-square overflow-hidden rounded-card"
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="(max-width:768px) 25vw, 20vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="font-heading text-3xl text-charcoal">
            {property.title}
          </h1>
          <p className="mt-2 text-sm text-charcoal/60">
            {hood?.name}, {property.city}, {property.state}
          </p>
          <p className="mt-4 text-xs uppercase tracking-wide text-charcoal/50">
            Sleeps {property.capacity}, {property.bedrooms} bedrooms,{" "}
            {property.bathrooms} bathrooms, {property.propertyType}
          </p>
          {property.shortNotice && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-card bg-mountain/10 px-3 py-2 text-xs font-medium text-mountain">
              Available on short notice for last-minute festival stays
            </p>
          )}

          <p className="mt-8 text-base leading-relaxed text-charcoal/80">
            {property.description}
          </p>

          <h2 className="mt-10 font-heading text-2xl text-charcoal">
            Amenities
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-2">
            {property.amenities.map((amenity) => (
              <li
                key={amenity}
                className="flex items-center gap-2 text-sm text-charcoal/80"
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-copper"
                />
                {amenity}
              </li>
            ))}
          </ul>

          {hood && (
            <>
              <h2 className="mt-10 font-heading text-2xl text-charcoal">
                The neighborhood
              </h2>
              <p className="mt-4 text-base leading-relaxed text-charcoal/80">
                {hood.description}
              </p>
            </>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-card border border-charcoal/10 p-6 shadow-sm lg:sticky lg:top-24">
            {property.bookingUrl ? (
              <>
                <h2 className="font-heading text-xl text-charcoal">
                  Book this home
                </h2>
                <a
                  href={property.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-card bg-mountain px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-charcoal"
                >
                  Book this home
                </a>
                <p className="mt-2 text-xs text-charcoal/50">
                  Booking is handled on the host&#39;s own site.
                </p>
                <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-charcoal/40">
                  <span className="h-px flex-1 bg-charcoal/10" />
                  or message the host
                  <span className="h-px flex-1 bg-charcoal/10" />
                </div>
              </>
            ) : (
              <h2 className="font-heading text-xl text-charcoal">
                Inquire about this home
              </h2>
            )}
            <div className={property.bookingUrl ? "" : "mt-5"}>
              <InquiryForm
                sourceType="property_inquiry"
                propertySlug={property.slug}
                submitLabel="Submit Inquiry"
              />
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-[var(--space-section)]">
          <SectionHeader eyebrow="More homes" title="Related stays" />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {related.map((p) => (
              <PropertyCard key={p.slug} property={p} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
