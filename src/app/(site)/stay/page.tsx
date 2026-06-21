import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PropertyCard } from "@/components/cards/PropertyCard";
import { StayFilters } from "@/components/stay/StayFilters";
import { properties } from "@/content/properties";
import { neighborhoods } from "@/content/neighborhoods";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Find a Place to Stay in Boulder",
  description:
    "Browse curated Boulder area homes for Festival Season. Filter by neighborhood, size, and guests.",
  path: "/stay",
});

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function StayPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;

  const neighborhood = first(searchParams.neighborhood);
  const type = first(searchParams.type);
  const guests = first(searchParams.guests);
  const bedrooms = first(searchParams.bedrooms);
  const bathrooms = first(searchParams.bathrooms);
  const view = first(searchParams.view);

  const filtered = properties.filter((p) => {
    if (neighborhood && p.neighborhoodSlug !== neighborhood) return false;
    if (type && p.propertyType !== type) return false;
    if (guests && p.capacity < Number(guests)) return false;
    if (bedrooms && p.bedrooms < Number(bedrooms)) return false;
    if (bathrooms && p.bathrooms < Number(bathrooms)) return false;
    return true;
  });

  const isMap = view === "map";

  const gridParams = new URLSearchParams();
  const mapParams = new URLSearchParams();
  for (const [key, value] of Object.entries({
    neighborhood,
    type,
    guests,
    bedrooms,
    bathrooms,
  })) {
    if (value) {
      gridParams.set(key, value);
      mapParams.set(key, value);
    }
  }
  mapParams.set("view", "map");
  const gridHref = gridParams.toString() ? `/stay?${gridParams}` : "/stay";
  const mapHref = `/stay?${mapParams}`;

  const toggleBase =
    "rounded-card px-5 py-2 text-sm font-medium transition-colors";
  const activeClass = "bg-mountain text-white";
  const inactiveClass =
    "border border-charcoal/20 text-charcoal hover:bg-charcoal/5";

  return (
    <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
      <SectionHeader
        eyebrow="Stay"
        title="Boulder area homes for your visit"
        intro="Curated homes across Boulder and the surrounding towns. Filter to find the right fit for your group and your Festival Season plans."
      />

      <div className="mt-10 flex items-center gap-3">
        <Link
          href={gridHref}
          className={`${toggleBase} ${isMap ? inactiveClass : activeClass}`}
        >
          Grid
        </Link>
        <Link
          href={mapHref}
          className={`${toggleBase} ${isMap ? activeClass : inactiveClass}`}
        >
          Map
        </Link>
      </div>

      {isMap ? (
        <div className="mt-10 flex min-h-[420px] items-center justify-center rounded-card border border-charcoal/10 bg-sand/20 px-6 text-center">
          <p className="max-w-md text-base text-charcoal/70">
            Map view is coming for Festival Season. Browse the grid for now.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-10">
            <StayFilters
              neighborhoods={neighborhoods.map((n) => ({
                slug: n.slug,
                name: n.name,
              }))}
              current={{
                neighborhood,
                type,
                guests,
                bedrooms,
                bathrooms,
              }}
            />
          </div>

          {filtered.length > 0 ? (
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((property) => (
                <PropertyCard key={property.slug} property={property} />
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-card border border-charcoal/10 bg-sand/20 px-6 py-16 text-center">
              <p className="text-base text-charcoal/70">
                No stays match these filters yet. Try widening your search.
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
