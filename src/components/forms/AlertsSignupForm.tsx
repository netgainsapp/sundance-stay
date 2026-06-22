"use client";

import { useActionState } from "react";
import { submitAlertsSignup } from "@/actions/submit-alerts";
import type { FormState } from "@/actions/submit-lead";

const initial: FormState = { ok: false };

export function AlertsSignupForm({ dark = false }: { dark?: boolean }) {
  const [state, action, pending] = useActionState(submitAlertsSignup, initial);

  if (state.ok) {
    return (
      <p
        role="status"
        className={dark ? "text-sm text-white/90" : "text-sm text-mountain"}
      >
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px]"
        aria-hidden="true"
      />
      <label htmlFor="alerts-email" className="sr-only">
        Email
      </label>
      <input
        id="alerts-email"
        name="visitorEmail"
        type="email"
        required
        placeholder="you@email.com"
        className="flex-1 rounded-card border border-charcoal/20 bg-white px-4 py-3 text-sm text-charcoal focus:border-mountain focus:outline-none focus:ring-1 focus:ring-mountain"
      />
      <button
        type="submit"
        disabled={pending}
        className={`rounded-card px-6 py-3 text-sm font-medium transition-colors disabled:opacity-60 ${
          dark
            ? "bg-white text-charcoal hover:bg-sand"
            : "bg-mountain text-white hover:bg-charcoal"
        }`}
      >
        {pending ? "..." : "Notify me"}
      </button>
      {state.message && !state.ok && (
        <p className={`text-xs ${dark ? "text-sand" : "text-copper"}`}>{state.message}</p>
      )}
    </form>
  );
}
