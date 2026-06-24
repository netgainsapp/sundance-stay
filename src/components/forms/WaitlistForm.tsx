"use client";

import { useState } from "react";
import { submitWaitlistSignup } from "@/actions/submit-waitlist";

export function WaitlistForm() {
  const [isPartner, setIsPartner] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      isPartner: isPartner,
      companyName: isPartner ? (formData.get("company_name") as string) : null,
      partnerCategory: isPartner ? (formData.get("partner_category") as string) : null,
      proposalDetails: isPartner ? (formData.get("proposal_details") as string) : null,
    };

    try {
      const result = await submitWaitlistSignup(data);

      if (!result.ok) {
        setStatus("error");
        setErrorMessage(result.error || "Something went wrong. Please try again.");
        return;
      }

      // Set cookie to unlock full site
      document.cookie = "waitlist_joined=true; path=/; max-age=31536000";
      setStatus("success");

      // Redirect to /stay after 2 seconds
      setTimeout(() => {
        window.location.href = "/stay";
      }, 2000);
    } catch (error) {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="p-8 text-center bg-mountain/10 border-2 border-mountain rounded-xl">
        <div className="inline-block mb-4">
          <svg className="w-12 h-12 text-mountain" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-mountain">You're on the list.</h3>
        <p className="mt-3 text-base text-charcoal/80">
          {isPartner
            ? "Thanks for reaching out. We'll be in touch about partnership opportunities."
            : "We'll notify you when Boulder Film Collective goes live."}
        </p>
        <p className="mt-4 text-sm text-charcoal/60 animate-pulse">Redirecting in a moment...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md p-6 mx-auto bg-white border shadow-sm rounded-xl border-charcoal/10">
      <div className="space-y-4">
        {/* Base Field: Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-charcoal">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            disabled={status === "loading"}
            className="w-full px-4 py-2 mt-1 border rounded-lg border-charcoal/20 focus:ring-2 focus:ring-mountain focus:border-mountain outline-none transition-all disabled:bg-charcoal/5 disabled:cursor-not-allowed"
            placeholder="you@example.com"
          />
        </div>

        {/* The Toggle */}
        <div className="flex items-start gap-2 pt-2">
          <input
            type="checkbox"
            id="is_partner"
            name="is_partner"
            checked={isPartner}
            onChange={(e) => setIsPartner(e.target.checked)}
            disabled={status === "loading"}
            className="w-4 h-4 mt-1 text-mountain border-charcoal/20 rounded focus:ring-mountain cursor-pointer disabled:cursor-not-allowed"
          />
          <label htmlFor="is_partner" className="text-sm text-charcoal/70 cursor-pointer">
            I am a local property owner or business interested in joining the Collective.
          </label>
        </div>

        {/* Progressive Disclosure: Partner Fields */}
        {isPartner && (
          <div className="pt-4 space-y-4 border-t border-charcoal/10 animate-in fade-in slide-in-from-top-2 duration-300">
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-charcoal">
                Name / Company Name
              </label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                required={isPartner}
                disabled={status === "loading"}
                className="w-full px-4 py-2 mt-1 border rounded-lg border-charcoal/20 focus:ring-2 focus:ring-mountain focus:border-mountain outline-none transition-all disabled:bg-charcoal/5 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="partner_category" className="block text-sm font-medium text-charcoal">
                Service Category
              </label>
              <select
                id="partner_category"
                name="partner_category"
                required={isPartner}
                disabled={status === "loading"}
                className="w-full px-4 py-2 mt-1 bg-white border rounded-lg border-charcoal/20 focus:ring-2 focus:ring-mountain focus:border-mountain outline-none transition-all disabled:bg-charcoal/5 disabled:cursor-not-allowed"
              >
                <option value="">Select an option...</option>
                <option value="property">Property Owner / Host</option>
                <option value="transportation">Transportation</option>
                <option value="food">Private Chef / Catering</option>
                <option value="other">Other Service</option>
              </select>
            </div>

            <div>
              <label htmlFor="proposal_details" className="block text-sm font-medium text-charcoal">
                What are you offering?
              </label>
              <textarea
                id="proposal_details"
                name="proposal_details"
                rows={3}
                required={isPartner}
                disabled={status === "loading"}
                className="w-full px-4 py-2 mt-1 border rounded-lg resize-none border-charcoal/20 focus:ring-2 focus:ring-mountain focus:border-mountain outline-none transition-all disabled:bg-charcoal/5 disabled:cursor-not-allowed"
                placeholder="Briefly describe your property or service..."
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full px-4 py-3 mt-4 text-white transition-colors bg-mountain rounded-lg hover:bg-charcoal disabled:bg-charcoal/40 disabled:cursor-not-allowed font-medium"
        >
          {status === "loading" ? "Joining..." : "Join the Waitlist"}
        </button>

        {status === "error" && (
          <p className="text-sm text-center text-copper">
            {errorMessage}
          </p>
        )}
      </div>
    </form>
  );
}
