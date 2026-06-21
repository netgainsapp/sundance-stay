import { prisma } from "@/lib/prisma";
import type { Sponsorship } from "@/generated/prisma/client";
import {
  createSponsorship,
  updateSponsorshipStatus,
} from "@/actions/admin-data";

export const dynamic = "force-dynamic";

const LEVELS = ["local", "category", "festival"] as const;
const STATUSES = ["pending", "active", "expired"] as const;

const inputClass =
  "rounded-card border border-charcoal/20 px-3 py-2 text-sm text-charcoal";

function formatAmount(amountCents: number | null): string {
  if (amountCents === null || amountCents === undefined) return "n/a";
  return `$${(amountCents / 100).toFixed(2)}`;
}

function formatDate(d: Date | null): string {
  return d ? new Date(d).toLocaleDateString() : "n/a";
}

export default async function SponsorshipsPage() {
  let sponsorships: Sponsorship[] = [];
  let dbError = false;

  try {
    sponsorships = await prisma.sponsorship.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    dbError = true;
    sponsorships = [];
  }

  return (
    <div>
      <h1 className="font-heading text-2xl text-charcoal">Sponsorships</h1>

      <section className="mt-6 rounded-card border border-charcoal/10 bg-white p-6">
        <h2 className="font-heading text-lg text-charcoal">Add sponsorship</h2>
        <form
          action={createSponsorship}
          className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <label className="flex flex-col gap-1 text-sm text-charcoal/70">
            Business name
            <input
              type="text"
              name="businessName"
              required
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-charcoal/70">
            Contact email
            <input
              type="email"
              name="contactEmail"
              required
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-charcoal/70">
            Contact name
            <input type="text" name="contactName" className={inputClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm text-charcoal/70">
            Contact phone
            <input type="text" name="contactPhone" className={inputClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm text-charcoal/70">
            Level
            <select name="level" defaultValue="local" className={inputClass}>
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-charcoal/70">
            Placement
            <input
              type="text"
              name="placement"
              required
              placeholder="homepage"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-charcoal/70">
            Amount (dollars)
            <input
              type="number"
              name="amountDollars"
              step="0.01"
              min="0"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-charcoal/70">
            Status
            <select name="status" defaultValue="pending" className={inputClass}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-charcoal/70">
            Start date
            <input type="date" name="startDate" className={inputClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm text-charcoal/70">
            End date
            <input type="date" name="endDate" className={inputClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm text-charcoal/70 md:col-span-2">
            Notes
            <textarea name="notes" rows={3} className={inputClass} />
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-card bg-charcoal px-5 py-2 text-sm text-white transition-colors hover:bg-charcoal/90"
            >
              Add sponsorship
            </button>
          </div>
        </form>
      </section>

      {dbError && (
        <p className="mt-4 rounded-card bg-sand/40 px-4 py-3 text-sm text-charcoal/70">
          No database connected yet. Live data appears here once DATABASE_URL is
          set.
        </p>
      )}

      {sponsorships.length === 0 && !dbError ? (
        <p className="mt-6 rounded-card border border-charcoal/10 bg-white p-5 text-sm text-charcoal/60">
          No sponsorships yet.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-card border border-charcoal/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-charcoal/10 text-charcoal/60">
              <tr>
                <th className="px-4 py-3 font-medium">Business</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Level</th>
                <th className="px-4 py-3 font-medium">Placement</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Dates</th>
                <th className="px-4 py-3 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {sponsorships.map((sp) => (
                <tr
                  key={sp.id}
                  className="border-b border-charcoal/5 align-top last:border-0"
                >
                  <td className="px-4 py-3 text-charcoal">{sp.businessName}</td>
                  <td className="px-4 py-3 text-charcoal/70">
                    <div>{sp.contactName || "n/a"}</div>
                    <div className="text-xs">{sp.contactEmail}</div>
                    {sp.contactPhone && (
                      <div className="text-xs">{sp.contactPhone}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-charcoal/70">{sp.level}</td>
                  <td className="px-4 py-3 text-charcoal/70">{sp.placement}</td>
                  <td className="px-4 py-3 text-charcoal/70">
                    {formatAmount(sp.amountCents)}
                  </td>
                  <td className="px-4 py-3">
                    <form
                      action={updateSponsorshipStatus}
                      className="flex gap-2"
                    >
                      <input type="hidden" name="id" value={sp.id} />
                      <select
                        name="status"
                        defaultValue={sp.status}
                        className="rounded-card border border-charcoal/20 px-2 py-1 text-xs text-charcoal"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="rounded-card bg-charcoal px-3 py-1 text-xs text-white transition-colors hover:bg-charcoal/90"
                      >
                        Save
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3 text-charcoal/70">
                    <div className="text-xs">
                      Start: {formatDate(sp.startDate)}
                    </div>
                    <div className="text-xs">End: {formatDate(sp.endDate)}</div>
                  </td>
                  <td className="px-4 py-3 text-charcoal/70">
                    {sp.notes || "n/a"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
