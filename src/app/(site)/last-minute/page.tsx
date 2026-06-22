import { SectionHeader } from "@/components/ui/SectionHeader";
import { Cta } from "@/components/ui/Cta";
import { PropertyCard } from "@/components/cards/PropertyCard";
import { UrgentStayForm } from "@/components/forms/UrgentStayForm";
import { shortNoticeProperties } from "@/content/properties";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Last-Minute Stays in Boulder",
  description:
    "Everything booked for Festival Season? We keep a standby list of Boulder area homes for last-minute and just-in-case needs.",
  path: "/last-minute",
});

export default function LastMinutePage() {
  const homes = shortNoticeProperties();

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
        <SectionHeader
          eyebrow="Last-Minute"
          title="Everything booked? We keep a backup."
          intro="When Festival Season fills up, lodging gets scarce fast. We maintain a standby list of Boulder area homeowners who can open their homes on short notice, just in case you need a place at the last minute. Tell us what you need and we will move quickly."
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-2xl text-charcoal">
              Request a last-minute stay
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
              Plans fell through, or you decided to come at the last minute. Send
              us your dates and group size and we will reach out as fast as we can
              with whatever is open.
            </p>
            <div className="mt-8 rounded-card border border-charcoal/10 p-6 shadow-sm">
              <UrgentStayForm />
            </div>
          </div>

          <div>
            <h2 className="font-heading text-2xl text-charcoal">How it works</h2>
            <ol className="mt-6 space-y-5">
              {[
                "Send us your dates, party size, and budget.",
                "We check our standby list of homeowners who can host on short notice.",
                "We connect you directly. You book and settle with the host.",
              ].map((step, i) => (
                <li key={step} className="flex items-start gap-4">
                  <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full bg-copper font-heading text-sm text-white">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-charcoal/80">{step}</p>
                </li>
              ))}
            </ol>
            <p className="mt-8 rounded-card bg-sand/20 p-5 text-sm leading-relaxed text-charcoal/70">
              We are a connector, not a booking service. We never take a cut of
              your stay. The booking is arranged directly with the homeowner.
            </p>
          </div>
        </div>
      </section>

      {homes.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
          <SectionHeader
            eyebrow="Standby homes"
            title="Homes available on short notice"
          />
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {homes.map((property) => (
              <PropertyCard key={property.slug} property={property} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
        <div className="rounded-card bg-charcoal px-6 py-12 text-center text-white md:px-12">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-sand">
            For homeowners
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl font-heading text-3xl text-white md:text-4xl">
            Become a standby host
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/80">
            Festival Season draws strong demand and premium rates. List your home
            on our standby list, just in case overflow demand comes up. There is no
            commitment, you approve any match, and you keep what you charge.
          </p>
          <div className="mt-8 flex justify-center">
            <Cta
              href="/list-your-home#submit"
              className="!border-white !bg-white !text-charcoal hover:!bg-sand"
            >
              List your home
            </Cta>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-[var(--space-section)]">
        <div className="rounded-card bg-sand/20 p-8">
          <h3 className="font-heading text-xl text-charcoal">
            Licensing and compliance
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal/70">
            Boulder area short term rentals may require a license, and a one time
            rental of a home can carry the same obligations. Homeowners are
            responsible for their own licensing, taxes, and compliance. Please
            confirm the current requirements through the{" "}
            <a
              href="https://bouldercolorado.gov/services/short-term-rental-licensing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mountain underline"
            >
              City of Boulder short term rental licensing
            </a>{" "}
            resource before hosting.
          </p>
        </div>
      </section>
    </>
  );
}
