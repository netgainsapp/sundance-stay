import Link from "next/link";
import { SITE } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-heading text-xl text-charcoal">
          Sundance Stay Collective
        </Link>
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-7 md:flex"
        >
          {SITE.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-charcoal/80 transition-colors hover:text-mountain"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/stay"
          className="rounded-card bg-mountain px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-charcoal md:hidden"
        >
          Find Lodging
        </Link>
      </div>
    </header>
  );
}
