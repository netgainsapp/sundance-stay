import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AreaMap } from "@/components/neighborhoods/AreaMap";
import { NeighborhoodQuiz } from "@/components/neighborhoods/NeighborhoodQuiz";
import { neighborhoods } from "@/content/neighborhoods";
import { propertiesByNeighborhood } from "@/content/properties";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Boulder Area Neighborhoods",
  description:
    "A guide to where to stay during Festival Season, from downtown Boulder and the foothills to Louisville, Lafayette, Longmont, Broomfield, and Denver.",
  path: "/neighborhoods",
});

export default function NeighborhoodsPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
        <SectionHeader
          eyebrow="Where to stay"
          title="Explore Boulder area neighborhoods"
          intro="From the walkable downtown core and the foothills to the surrounding towns and Denver, each area sets a different tone for your trip. Here is how they sit on the map and what each one is known for."
        />
        <div className="mt-12 grid items-start gap-10 lg:grid-cols-2">
          <AreaMap neighborhoods={neighborhoods} />
          <div className="grid grid-cols-2 gap-3">
            {neighborhoods.map((n) => (
              <a
                key={n.slug}
                href={`#${n.slug}`}
                className="rounded-card border border-charcoal/10 px-4 py-3 text-sm text-charcoal/80 transition-colors hover:border-mountain hover:text-mountain"
              >
                {n.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-[var(--space-section)]">
        <SectionHeader
          eyebrow="Not sure where to stay"
          title="Find your neighborhood"
          intro="Answer three quick questions and we will point you to the area that fits your trip."
        />
        <div className="mt-10 max-w-3xl">
          <NeighborhoodQuiz
            neighborhoods={neighborhoods.map((n) => ({ slug: n.slug, name: n.name }))}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-[var(--space-section)]">
        <div className="space-y-12">
          {neighborhoods.map((n) => {
            const count = propertiesByNeighborhood(n.slug).length;
            return (
              <article
                key={n.slug}
                id={n.slug}
                className="grid scroll-mt-24 gap-8 rounded-card border border-charcoal/10 p-6 md:grid-cols-5 md:p-8"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-card md:col-span-2">
                  <Image
                    src={n.image}
                    alt={n.name}
                    fill
                    sizes="(max-width:768px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
                <div className="md:col-span-3">
                  <h2 className="font-heading text-2xl text-charcoal">{n.name}</h2>
                  <p className="mt-3 text-base leading-relaxed text-charcoal/80">
                    {n.overview}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {n.highlights.map((h) => (
                      <li
                        key={h}
                        className="rounded-full bg-sand/30 px-3 py-1 text-xs font-medium text-charcoal/70"
                      >
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Link
                      href={`/stay?neighborhood=${n.slug}`}
                      className="text-sm font-medium text-mountain hover:text-copper"
                    >
                      View {count > 0 ? `${count} ` : ""}homes in {n.name}
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
