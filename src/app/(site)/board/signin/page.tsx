import { SectionHeader } from "@/components/ui/SectionHeader";
import { BoardSignInForm } from "@/components/forms/BoardSignInForm";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Sign in to the Last-Minute Board",
  description: "Passwordless sign in for the Boulder Last-Minute Board.",
  path: "/board/signin",
});

export default async function BoardSignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <section className="mx-auto max-w-md px-6 py-[var(--space-section)]">
      <SectionHeader
        eyebrow="Last-Minute Board"
        title="Sign in"
        intro="Enter your email and we send a one time sign in link. No password to remember."
      />
      {error && (
        <p className="mt-6 rounded-card bg-copper/10 p-4 text-sm text-charcoal/80">
          That sign in link was invalid or expired. Request a fresh one below.
        </p>
      )}
      <div className="mt-8 rounded-card border border-charcoal/10 p-6 shadow-sm md:p-8">
        <BoardSignInForm />
      </div>
    </section>
  );
}
