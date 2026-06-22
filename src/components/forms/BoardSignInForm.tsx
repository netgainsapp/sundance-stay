"use client";

import { useActionState } from "react";
import { requestMagicLink, type AuthState } from "@/actions/board-auth";
import { FormStatus } from "./FormStatus";

const initial: AuthState = { ok: false };

export function BoardSignInForm() {
  const [state, action, pending] = useActionState(requestMagicLink, initial);

  if (state.ok) {
    return (
      <div className="rounded-card border border-mountain/30 bg-mountain/5 p-6">
        <h3 className="font-heading text-lg text-charcoal">Check your email</h3>
        <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
          {state.message ?? "We sent you a sign in link. It expires in 30 minutes."}
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px]"
        aria-hidden="true"
      />
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-charcoal">
          Email<span className="text-copper"> *</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-card border border-charcoal/20 px-3 py-2 text-sm focus:border-mountain focus:outline-none focus:ring-1 focus:ring-mountain"
        />
        {state.errors?.email && (
          <p className="mt-1 text-xs text-copper">{state.errors.email}</p>
        )}
      </div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-charcoal">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="mt-1 w-full rounded-card border border-charcoal/20 px-3 py-2 text-sm focus:border-mountain focus:outline-none focus:ring-1 focus:ring-mountain"
        />
      </div>
      <FormStatus state={state} />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-card bg-mountain px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-charcoal disabled:opacity-60"
      >
        {pending ? "Sending..." : "Email me a sign in link"}
      </button>
      <p className="text-xs leading-relaxed text-charcoal/50">
        No password needed. We email you a one time link that expires in 30
        minutes.
      </p>
    </form>
  );
}
