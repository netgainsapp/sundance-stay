"use client";

import { useActionState } from "react";
import { submitConciergeRequest } from "@/actions/submit-concierge";
import type { FormState } from "@/actions/submit-lead";
import { CONCIERGE_TIERS, formatPrice } from "@/lib/pricing";
import { FormStatus } from "./FormStatus";

const initial: FormState = { ok: false };

export function ConciergeRequestForm() {
  const [state, action, pending] = useActionState(submitConciergeRequest, initial);
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
      <Field label="Festival dates" name="datesNeeded" error={state.errors?.datesNeeded} required />
      <Field label="Party size" name="partySize" error={state.errors?.partySize} />
      <div>
        <label htmlFor="tier" className="block text-sm font-medium text-charcoal">
          Package interest
        </label>
        <select
          id="tier"
          name="tier"
          defaultValue=""
          className="mt-1 w-full rounded-card border border-charcoal/20 px-3 py-2 text-sm focus:border-mountain focus:outline-none focus:ring-1 focus:ring-mountain"
        >
          <option value="">Not sure yet</option>
          {CONCIERGE_TIERS.map((t) => (
            <option key={t.key} value={`${t.label} (${formatPrice(t.price)})`}>
              {t.label} ({formatPrice(t.price)})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-charcoal">
          What can we arrange
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
        {pending ? "Sending..." : "Request concierge"}
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
