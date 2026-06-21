import Image from "next/image";
import Link from "next/link";
import type { Neighborhood } from "@/content/types";

export function NeighborhoodCard({ neighborhood }: { neighborhood: Neighborhood }) {
  return (
    <Link href={`/stay?neighborhood=${neighborhood.slug}`} className="group relative block overflow-hidden rounded-card">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image src={neighborhood.image} alt={neighborhood.name} fill sizes="(max-width:768px) 100vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
      </div>
      <h3 className="absolute bottom-4 left-4 font-heading text-xl text-white">{neighborhood.name}</h3>
    </Link>
  );
}
