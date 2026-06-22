import { prisma } from "@/lib/prisma";
import type { Lead, Prisma } from "@/generated/prisma/client";
import { updateLeadStatus } from "@/actions/admin-data";

export const dynamic = "force-dynamic";

const SOURCE_TYPES = [
  "property_inquiry",
  "business_inquiry",
  "general_contact",
  "sponsor_inquiry",
  "urgent_stay",
  "standby_host",
  "concierge_request",
] as const;

const STATUSES = ["new", "contacted", "closed"] as const;

type SearchParams = Promise<Record<string, string | undefined>>;

function formatSource(source: string): string {
  return source.replaceAll("_", " ");
}

function truncate(text: string, max = 60): string {
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;

  const source = SOURCE_TYPES.includes(sp.source as (typeof SOURCE_TYPES)[number])
    ? (sp.source as (typeof SOURCE_TYPES)[number])
    : undefined;
  const status = STATUSES.includes(sp.status as (typeof STATUSES)[number])
    ? (sp.status as (typeof STATUSES)[number])
    : undefined;

  const where: Prisma.LeadWhereInput = {};
  if (source) where.sourceType = source;
  if (status) where.status = status;

  const cleanFilters: Record<string, string> = {};
  if (source) cleanFilters.source = source;
  if (status) cleanFilters.status = status;

  let leads: Lead[] = [];
  let dbError = false;

  try {
    leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
    });
  } catch {
    dbError = true;
    leads = [];
  }

  const exportHref = `/api/admin/leads/export?${new URLSearchParams(
    cleanFilters,
  ).toString()}`;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-2xl text-charcoal">Leads</h1>
        <a
          href={exportHref}
          className="rounded-card border border-charcoal/20 bg-white px-4 py-2 text-sm text-charcoal transition-colors hover:bg-sand/30"
        >
          Export CSV
        </a>
      </div>

      <form
        method="get"
        className="mt-6 flex flex-wrap items-end gap-3 rounded-card border border-charcoal/10 bg-white p-4"
      >
        <label className="flex flex-col gap-1 text-sm text-charcoal/70">
          Source
          <select
            name="source"
            defaultValue={sp.source ?? ""}
            className="rounded-card border border-charcoal/20 px-3 py-2 text-sm text-charcoal"
          >
            <option value="">All</option>
            {SOURCE_TYPES.map((s) => (
              <option key={s} value={s}>
                {formatSource(s)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-charcoal/70">
          Status
          <select
            name="status"
            defaultValue={sp.status ?? ""}
            className="rounded-card border border-charcoal/20 px-3 py-2 text-sm text-charcoal"
          >
            <option value="">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-card bg-charcoal px-4 py-2 text-sm text-white transition-colors hover:bg-charcoal/90"
        >
          Filter
        </button>
      </form>

      {dbError && (
        <p className="mt-4 rounded-card bg-sand/40 px-4 py-3 text-sm text-charcoal/70">
          No database connected yet. Live data appears here once DATABASE_URL is
          set.
        </p>
      )}

      {leads.length === 0 && !dbError ? (
        <p className="mt-6 rounded-card border border-charcoal/10 bg-white p-5 text-sm text-charcoal/60">
          No leads match these filters.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-card border border-charcoal/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-charcoal/10 text-charcoal/60">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Message</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-charcoal/5 align-top last:border-0"
                >
                  <td className="px-4 py-3 text-charcoal">{lead.visitorName}</td>
                  <td className="px-4 py-3 text-charcoal/70">
                    {lead.visitorEmail}
                  </td>
                  <td className="px-4 py-3 text-charcoal/70">
                    {lead.visitorPhone || "n/a"}
                  </td>
                  <td className="px-4 py-3 text-charcoal/70">
                    {formatSource(lead.sourceType)}
                  </td>
                  <td className="px-4 py-3 text-charcoal/70">
                    {truncate(lead.message)}
                  </td>
                  <td className="px-4 py-3 text-charcoal/70">{lead.status}</td>
                  <td className="px-4 py-3 text-charcoal/70">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <form action={updateLeadStatus} className="flex gap-2">
                      <input type="hidden" name="id" value={lead.id} />
                      <select
                        name="status"
                        defaultValue={lead.status}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
