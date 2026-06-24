import Image from "next/image";
import { WaitlistForm } from "@/components/forms/WaitlistForm";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Boulder Film Collective",
  description:
    "The essential guide to staying in Boulder during Festival Season. Curated lodging and trusted local services for visitors and hosts.",
  path: "/",
});

export default function Home() {
  return (
    <>
      {/* Hero Section with Waitlist */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600104146011-ad1a8571f161?w=2000&q=80"
          alt="The Boulder Flatirons rising above the Chautauqua meadow"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/50 to-charcoal/20" />

        <div className="relative mx-auto w-full max-w-7xl px-6 py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-copper">
              Boulder, Colorado
            </p>
            <h1 className="mt-4 font-heading text-4xl text-white md:text-6xl">
              Boulder Film Collective
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85">
              Your guide to staying in Boulder during Festival Season. Curated lodging, trusted
              local services, and insider access to everything you need for an unforgettable stay.
            </p>

            {/* Waitlist Form */}
            <div className="mt-12">
              <WaitlistForm />
            </div>

            <p className="mt-6 text-xs text-white/60">
              {SITE.disclaimer}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
