"use client";

import { useActionState } from "react";
import { submitStandbyHost } from "@/actions/submit-standby";
import type { FormState } from "@/actions/submit-lead";
import { FormStatus } from "./FormStatus";

const initial: FormState = { ok: false };

export function StandbyHostForm() {
  const [state, action, pending] = useActionState(submitStandbyHost, initial);
  if (state.ok) return <FormStatus state={state} />;

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
      <Field label="Name" name="visitorName" error={state.errors?.visitorName} required />
      <Field label="Email" name="visitorEmail" type="email" error={state.errors?.visitorEmail} required />
      <Field label="Phone" name="visitorPhone" type="tel" error={state.errors?.visitorPhone} />
      <Field label="Where is your home" name="area" error={state.errors?.area} required />
      <Field label="Sleeps how many" name="sleeps" error={state.errors?.sleeps} />
      <Field label="Dates you could host" name="datesAvailable" error={state.errors?.datesAvailable} required />
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-charcoal">
          Anything else
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          className="mt-1 w-full rounded-card border border-charcoal/20 px-3 py-2 text-sm focus:border-mountain focus:outline-none focus:ring-1 focus:ring-mountain"
        />
        {state.errors?.message && (
          <p className="mt-1 text-xs text-copper">{state.errors.message}</p>
        )}
      </div>
      <FormStatus state={state} />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-card bg-mountain px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-charcoal disabled:opacity-60"
      >
        {pending ? "Sending..." : "Join the standby list"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-charcoal">
        {label}
        {required && <span className="text-copper"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full rounded-card border border-charcoal/20 px-3 py-2 text-sm focus:border-mountain focus:outline-none focus:ring-1 focus:ring-mountain"
      />
      {error && <p className="mt-1 text-xs text-copper">{error}</p>}
    </div>
  );
}
