import Image from "next/image";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { businesses, getBusiness } from "@/content/businesses";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return businesses.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = getBusiness(slug);
  if (!business) {
    return pageMetadata({
      title: "Business",
      description: "A trusted Boulder area business partner.",
      path: `/business/${slug}`,
    });
  }
  return pageMetadata({
    title: business.name,
    description: business.description,
    path: `/business/${business.slug}`,
    image: business.coverImage,
  });
}

function domainLabel(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = getBusiness(slug);
  if (!business) notFound();

  const hasContact = Boolean(business.website || business.phone || business.email);

  return (
    <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
      <div className="relative aspect-[21/9] w-full overflow-hidden rounded-card">
        <Image
          src={business.coverImage}
          alt={business.name}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-10">
          {business.credentials && business.credentials.length > 0 && (
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-charcoal">
              <span aria-hidden="true" className="text-mountain">&#10003;</span>
              Vetted and credentialed
            </span>
          )}
          <h1 className="font-heading text-3xl text-white md:text-4xl">{business.name}</h1>
          <p className="mt-2 text-sm text-white/80">{business.serviceArea}</p>
        </div>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="text-base leading-relaxed text-charcoal/80">{business.description}</p>

          <h2 className="mt-10 font-heading text-2xl text-charcoal">Services</h2>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {business.services.map((service) => (
              <p key={service} className="text-sm text-charcoal/70">
                + {service}
              </p>
            ))}
          </div>

          {business.credentials && business.credentials.length > 0 && (
            <div className="mt-10 rounded-card bg-mountain/5 p-6">
              <h2 className="font-heading text-2xl text-charcoal">
                Credentials and vetting
              </h2>
              <ul className="mt-4 space-y-3">
                {business.credentials.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-charcoal/80"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-0.5 inline-flex h-4 w-4 flex-none items-center justify-center rounded-full bg-mountain/15 text-[10px] font-bold text-mountain"
                    >
                      &#10003;
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-charcoal/50">
                Credentials are provided by the business. Please confirm current
                licenses, certifications, and references directly before booking.
              </p>
            </div>
          )}

          {hasContact && (
            <div className="mt-10">
              <h2 className="font-heading text-2xl text-charcoal">Get in touch</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {business.website && (
                  <li>
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-mountain hover:text-copper"
                    >
                      {domainLabel(business.website)}
                    </a>
                  </li>
                )}
                {business.phone && (
                  <li>
                    <a
                      href={`tel:${business.phone.replace(/[^\d+]/g, "")}`}
                      className="text-mountain hover:text-copper"
                    >
                      {business.phone}
                    </a>
                  </li>
                )}
                {business.email && (
                  <li>
                    <a
                      href={`mailto:${business.email}`}
                      className="text-mountain hover:text-copper"
                    >
                      {business.email}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-card border border-charcoal/10 p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="font-heading text-xl text-charcoal">Contact this business</h2>
            <div className="mt-4">
              <InquiryForm
                sourceType="business_inquiry"
                businessSlug={business.slug}
                submitLabel="Contact This Business"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
