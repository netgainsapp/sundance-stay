"use client";

import { useActionState } from "react";
import { submitProperty } from "@/actions/submit-property";
import type { FormState } from "@/actions/submit-lead";
import { FormStatus } from "./FormStatus";

const initial: FormState = { ok: false };

export function PropertySubmissionForm() {
  const [state, action, pending] = useActionState(submitProperty, initial);
  if (state.ok) return <FormStatus state={state} />;
  return (
    <form action={action} className="space-y-4">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="absolute left-[-9999px]" aria-hidden="true" />
      <Field label="Name" name="name" error={state.errors?.name} required />
      <Field label="Email" name="email" type="email" error={state.errors?.email} required />
      <Field label="Phone" name="phone" type="tel" error={state.errors?.phone} />
      <Field label="Property Address" name="propertyAddress" error={state.errors?.propertyAddress} required />
      <div>
        <label htmlFor="propertyType" className="block text-sm font-medium text-charcoal">Property Type<span className="text-copper"> *</span></label>
        <select id="propertyType" name="propertyType" required defaultValue="" className="mt-1 w-full rounded-card border border-charcoal/20 px-3 py-2 text-sm focus:border-mountain focus:outline-none focus:ring-1 focus:ring-mountain">
          <option value="" disabled>Select property type</option>
          <option value="House">House</option>
          <option value="Condo">Condo</option>
          <option value="Cabin">Cabin</option>
          <option value="Loft">Loft</option>
          <option value="Townhome">Townhome</option>
        </select>
        {state.errors?.propertyType && <p className="mt-1 text-xs text-copper">{state.errors.propertyType}</p>}
      </div>
      <Field label="Bedrooms" name="bedrooms" type="number" min={1} error={state.errors?.bedrooms} required />
      <Field label="Bathrooms" name="bathrooms" type="number" min={1} error={state.errors?.bathrooms} required />
      <Field label="Sleeps" name="capacity" type="number" min={1} error={state.errors?.capacity} required />
      <Field label="Availability Dates" name="availabilityDates" error={state.errors?.availabilityDates} />
      <Field label="Booking link (Airbnb, Vrbo, or your site)" name="bookingUrl" type="url" error={state.errors?.bookingUrl} />
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-charcoal">Description<span className="text-copper"> *</span></label>
        <textarea id="description" name="description" rows={4} required className="mt-1 w-full rounded-card border border-charcoal/20 px-3 py-2 text-sm focus:border-mountain focus:outline-none focus:ring-1 focus:ring-mountain" />
        {state.errors?.description && <p className="mt-1 text-xs text-copper">{state.errors.description}</p>}
      </div>
      <FormStatus state={state} />
      <button type="submit" disabled={pending} className="w-full rounded-card bg-mountain px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-charcoal disabled:opacity-60">
        {pending ? "Sending..." : "Submit Property"}
      </button>
    </form>
  );
}

function Field({ label, name, type = "text", error, required, min }: { label: string; name: string; type?: string; error?: string; required?: boolean; min?: number }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-charcoal">{label}{required && <span className="text-copper"> *</span>}</label>
      <input id={name} name={name} type={type} required={required} min={min} className="mt-1 w-full rounded-card border border-charcoal/20 px-3 py-2 text-sm focus:border-mountain focus:outline-none focus:ring-1 focus:ring-mountain" />
      {error && <p className="mt-1 text-xs text-copper">{error}</p>}
    </div>
  );
}
