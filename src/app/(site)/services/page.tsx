import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { serviceCategories } from "@/content/services";
import { businessesByCategory } from "@/content/businesses";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Local Services in Boulder",
  description:
    "Trusted Boulder area businesses for transportation, cleaning, private chefs, concierge, and more.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-[var(--space-section)]">
      <SectionHeader
        eyebrow="Services"
        title="Trusted local services for your stay"
        intro="Every partner is a vetted Boulder area business, hand selected to make your visit effortless. Browse a category to find the right team for transportation, cleaning, dining, and more."
      />

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {serviceCategories.map((category) => {
          const count = businessesByCategory(category.slug).length;
          return (
            <Link
              key={category.slug}
              href={`/services/${category.slug}`}
              className="group block overflow-hidden rounded-card bg-white shadow-sm ring-1 ring-charcoal/5 transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading text-xl text-charcoal">{category.name}</h3>
                <p className="mt-2 text-sm text-charcoal/70">{category.blurb}</p>
                <p className="mt-3 text-xs uppercase tracking-wide text-charcoal/50">
                  {count} local businesses
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
