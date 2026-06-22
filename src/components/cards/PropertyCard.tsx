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
        <Image src={img.url} alt={img.alt} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        {property.featured && <span className="absolute left-4 top-4 rounded-full bg-copper px-3 py-1 text-xs font-medium text-white">Featured</span>}
        {property.shortNotice && <span className="absolute right-4 top-4 rounded-full bg-mountain px-3 py-1 text-xs font-medium text-white">Short notice</span>}
      </div>
      <div className="p-5">
        <h3 className="font-heading text-xl text-charcoal">{property.title}</h3>
        <p className="mt-1 text-sm text-charcoal/60">{hood?.name}, {property.city}</p>
        <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{property.summary}</p>
        <p className="mt-4 text-xs uppercase tracking-wide text-charcoal/50">Sleeps {property.capacity}, {property.bedrooms} bd, {property.bathrooms} ba</p>
      </div>
    </Link>
  );
}
