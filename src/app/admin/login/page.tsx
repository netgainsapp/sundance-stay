import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { isAdminAuthed } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAdminAuthed()) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand/20 px-6">
      <div className="w-full max-w-sm rounded-card border border-charcoal/10 bg-white p-8 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-copper">
          Boulder Film Collective
        </p>
        <h1 className="mt-2 font-heading text-2xl text-charcoal">Operator sign in</h1>
        <p className="mt-2 mb-6 text-sm text-charcoal/60">
          Access the operations console.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
