import { prisma } from "@/lib/prisma";
import type { Lead } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

function formatSource(source: string): string {
  return source.replaceAll("_", " ");
}

export default async function AdminOverviewPage() {
  let newLeads = 0;
  let newSubmissions = 0;
  let activeSponsorships = 0;
  let totalLeads = 0;
  let recentLeads: Lead[] = [];
  let dbError = false;

  try {
    [newLeads, newSubmissions, activeSponsorships, totalLeads, recentLeads] =
      await Promise.all([
        prisma.lead.count({ where: { status: "new" } }),
        prisma.propertySubmission.count({ where: { status: "new" } }),
        prisma.sponsorship.count({ where: { status: "active" } }),
        prisma.lead.count(),
        prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
      ]);
  } catch {
    dbError = true;
    newLeads = 0;
    newSubmissions = 0;
    activeSponsorships = 0;
    totalLeads = 0;
    recentLeads = [];
  }

  const stats = [
    { label: "New leads", value: newLeads },
    { label: "New submissions", value: newSubmissions },
    { label: "Active sponsorships", value: activeSponsorships },
    { label: "Total leads", value: totalLeads },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl text-charcoal">Overview</h1>

      {dbError && (
        <p className="mt-4 rounded-card bg-sand/40 px-4 py-3 text-sm text-charcoal/70">
          No database connected yet. Live data appears here once DATABASE_URL is
          set.
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-card border border-charcoal/10 bg-white p-5"
          >
            <div className="font-heading text-3xl text-charcoal">
              {stat.value}
            </div>
            <div className="mt-1 text-sm text-charcoal/60">{stat.label}</div>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="font-heading text-lg text-charcoal">Recent leads</h2>
        {recentLeads.length === 0 ? (
          <p className="mt-3 rounded-card border border-charcoal/10 bg-white p-5 text-sm text-charcoal/60">
            No leads yet.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-card border border-charcoal/10 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-charcoal/10 text-charcoal/60">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-charcoal/5 last:border-0"
                  >
                    <td className="px-4 py-3 text-charcoal">
                      {lead.visitorName}
                    </td>
                    <td className="px-4 py-3 text-charcoal/70">
                      {lead.visitorEmail}
                    </td>
                    <td className="px-4 py-3 text-charcoal/70">
                      {formatSource(lead.sourceType)}
                    </td>
                    <td className="px-4 py-3 text-charcoal/70">{lead.status}</td>
                    <td className="px-4 py-3 text-charcoal/70">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
