import { SectionHeader } from "@/components/ui/SectionHeader";
import { Cta } from "@/components/ui/Cta";
import { PropertyCard } from "@/components/cards/PropertyCard";
import { UrgentStayForm } from "@/components/forms/UrgentStayForm";
import { StandbyHostForm } from "@/components/forms/StandbyHostForm";
import { shortNoticeProperties } from "@/content/properties";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Last-Minute Stays in Boulder",
  description:
    "We match last-minute Festival Season guests with Boulder area homeowners on standby. Tell us what you need, or offer your home, and we connect the two.",
  path: "/last-minute",
});

const steps = [
  "Guests tell us the dates and group they need.",
  "Homeowners tell us they can host on short notice.",
  "We make the match and connect you directly. You book with the host.",
];

export default function LastMinutePage() {
  const homes = shortNoticeProperties();

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
        <SectionHeader
          eyebrow="Last-Minute"
          title="We match last-minute guests with standby homes."
          intro="When Festival Season fills up, lodging gets scarce fast. We keep two lists, travelers who need a place at the last minute and Boulder area homeowners ready to host on short notice, and we match them. Join the side you are on and we will make the connection."
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-[var(--space-section)]">
        <div className="grid gap-5 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step}
              className="rounded-card border border-charcoal/10 p-6"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-copper font-heading text-sm text-white">
                {i + 1}
              </span>
              <p className="mt-4 text-sm leading-relaxed text-charcoal/80">
                {step}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 rounded-card bg-sand/20 p-5 text-sm leading-relaxed text-charcoal/70">
          We are a matchmaker, not a booking service. We never take a cut of the
          stay. Once we connect you, the booking is arranged directly with the
          homeowner.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-[var(--space-section)]">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-card border border-charcoal/10 p-6 shadow-sm md:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-copper">
              For guests
            </p>
            <h2 className="mt-2 font-heading text-2xl text-charcoal">
              Need a place last minute
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
              Plans fell through, or you decided to come at the last minute. Send
              your dates and group size and we will match you with whatever is open.
            </p>
            <div className="mt-6">
              <UrgentStayForm />
            </div>
          </div>

          <div className="rounded-card border border-mountain bg-mountain/5 p-6 shadow-sm md:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-mountain">
              For homeowners
            </p>
            <h2 className="mt-2 font-heading text-2xl text-charcoal">
              Offer your home on standby
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
              Festival Season draws strong demand and premium rates. Join the
              standby list, just in case overflow demand comes up. No commitment,
              you approve any match, and you keep what you charge.
            </p>
            <div className="mt-6">
              <StandbyHostForm />
            </div>
          </div>
        </div>
        <p className="mt-6 text-sm text-charcoal/60">
          Want a full public listing instead of a standby spot? List your home on
          the{" "}
          <a href="/list-your-home" className="text-mountain underline">
            List Your Home
          </a>{" "}
          page.
        </p>
      </section>

      {homes.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-[var(--space-section)]">
          <SectionHeader
            eyebrow="Standby homes"
            title="Homes already on the standby list"
          />
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {homes.map((property) => (
              <PropertyCard key={property.slug} property={property} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 pb-[var(--space-section)]">
        <div className="rounded-card bg-sand/20 p-8">
          <h3 className="font-heading text-xl text-charcoal">
            Licensing and compliance
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal/70">
            The City of Boulder created a Festival Lodging Rental License for
            renting a home during approved festival events, including the 2027
            Sundance Film Festival. It does not require the home to be your primary
            residence. Homeowners are responsible for their own licensing, taxes,
            and compliance. Please confirm the current requirements through the{" "}
            <a
              href="https://bouldercolorado.gov/services/rental-licensing-festival-lodging-rental-license"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mountain underline"
            >
              City of Boulder Festival Lodging Rental License
            </a>{" "}
            resource before hosting. Homes outside the City of Boulder follow their
            own town or county rules.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-[var(--space-section)]">
        <div className="flex flex-col items-center gap-4 text-center">
          <Cta href="/stay">Browse all stays</Cta>
        </div>
      </section>
    </>
  );
}
