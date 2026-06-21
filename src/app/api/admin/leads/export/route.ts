import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { toCsv } from "@/lib/csv";
import type { Lead, Prisma } from "@/generated/prisma/client";

const SOURCE_TYPES = [
  "property_inquiry",
  "business_inquiry",
  "general_contact",
  "sponsor_inquiry",
] as const;

const STATUSES = ["new", "contacted", "closed"] as const;

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const sourceParam = searchParams.get("source") ?? undefined;
  const statusParam = searchParams.get("status") ?? undefined;

  const where: Prisma.LeadWhereInput = {};
  if (SOURCE_TYPES.includes(sourceParam as (typeof SOURCE_TYPES)[number])) {
    where.sourceType = sourceParam as (typeof SOURCE_TYPES)[number];
  }
  if (STATUSES.includes(statusParam as (typeof STATUSES)[number])) {
    where.status = statusParam as (typeof STATUSES)[number];
  }

  let rows: Lead[];
  try {
    rows = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return new Response("Database unavailable", { status: 503 });
  }

  const csv = toCsv<Lead>(rows, [
    { header: "Created", value: (r) => r.createdAt.toISOString() },
    { header: "Source", value: (r) => r.sourceType },
    { header: "Status", value: (r) => r.status },
    { header: "Name", value: (r) => r.visitorName },
    { header: "Email", value: (r) => r.visitorEmail },
    { header: "Phone", value: (r) => r.visitorPhone },
    { header: "Property", value: (r) => r.propertySlug },
    { header: "Business", value: (r) => r.businessSlug },
    { header: "Message", value: (r) => r.message },
  ]);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads.csv"`,
    },
  });
}
