import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
import { logout } from "@/actions/admin-auth";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/submissions", label: "Submissions" },
  { href: "/admin/board", label: "Board" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/blog", label: "Blog engine" },
  { href: "/admin/sponsorships", label: "Sponsorships" },
];

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!(await isAdminAuthed())) redirect("/admin/login");

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col justify-between border-r border-charcoal/10 bg-charcoal text-white/80">
        <div>
          <div className="px-6 py-5 font-heading text-lg text-white">
            Sundance Admin
          </div>
          <nav aria-label="Admin navigation" className="flex flex-col px-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-card px-3 py-2 text-sm transition-colors hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <form action={logout} className="p-3">
          <button
            type="submit"
            className="w-full rounded-card border border-white/20 px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            Sign out
          </button>
        </form>
      </aside>
      <div className="flex-1 bg-sand/10">
        <main className="mx-auto max-w-6xl p-8">{children}</main>
      </div>
    </div>
  );
}
