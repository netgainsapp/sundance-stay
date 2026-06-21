import { prisma } from "@/lib/prisma";
import type { PropertySubmission, Prisma } from "@/generated/prisma/client";
import { updateSubmissionStatus } from "@/actions/admin-data";

export const dynamic = "force-dynamic";

const STATUSES = ["new", "contacted", "closed"] as const;

type SearchParams = Promise<Record<string, string | undefined>>;

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;

  const status = STATUSES.includes(sp.status as (typeof STATUSES)[number])
    ? (sp.status as (typeof STATUSES)[number])
    : undefined;

  const where: Prisma.PropertySubmissionWhereInput = {};
  if (status) where.status = status;

  const cleanFilters: Record<string, string> = {};
  if (status) cleanFilters.status = status;

  let submissions: PropertySubmission[] = [];
  let dbError = false;

  try {
    submissions = await prisma.propertySubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
    });
  } catch {
    dbError = true;
    submissions = [];
  }

  const exportHref = `/api/admin/submissions/export?${new URLSearchParams(
    cleanFilters,
  ).toString()}`;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-2xl text-charcoal">Submissions</h1>
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

      {submissions.length === 0 && !dbError ? (
        <p className="mt-6 rounded-card border border-charcoal/10 bg-white p-5 text-sm text-charcoal/60">
          No submissions match these filters.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-card border border-charcoal/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-charcoal/10 text-charcoal/60">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Address</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Beds/Baths/Sleeps</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr
                  key={sub.id}
                  className="border-b border-charcoal/5 align-top last:border-0"
                >
                  <td className="px-4 py-3 text-charcoal">{sub.name}</td>
                  <td className="px-4 py-3 text-charcoal/70">{sub.email}</td>
                  <td className="px-4 py-3 text-charcoal/70">
                    {sub.phone || "n/a"}
                  </td>
                  <td className="px-4 py-3 text-charcoal/70">
                    {sub.propertyAddress}
                  </td>
                  <td className="px-4 py-3 text-charcoal/70">
                    {sub.propertyType}
                  </td>
                  <td className="px-4 py-3 text-charcoal/70">
                    {sub.bedrooms} bd / {sub.bathrooms} ba / {sub.capacity}
                  </td>
                  <td className="px-4 py-3">
                    <form
                      action={updateSubmissionStatus}
                      className="flex gap-2"
                    >
                      <input type="hidden" name="id" value={sub.id} />
                      <select
                        name="status"
                        defaultValue={sub.status}
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
                    {new Date(sub.createdAt).toLocaleDateString()}
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
