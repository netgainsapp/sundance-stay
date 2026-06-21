import { prisma } from "@/lib/prisma";
import { toCsv } from "@/lib/csv";
import { guardCsvExport, csvResponse } from "@/lib/admin-export";
import type { PropertySubmission, Prisma } from "@/generated/prisma/client";

const STATUSES = ["new", "contacted", "closed"] as const;

export async function GET(request: Request) {
  const blocked = await guardCsvExport(request);
  if (blocked) return blocked;

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status") ?? undefined;

  const where: Prisma.PropertySubmissionWhereInput = {};
  if (STATUSES.includes(statusParam as (typeof STATUSES)[number])) {
    where.status = statusParam as (typeof STATUSES)[number];
  }

  let rows: PropertySubmission[];
  try {
    rows = await prisma.propertySubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return new Response("Database unavailable", { status: 503 });
  }

  const csv = toCsv<PropertySubmission>(rows, [
    { header: "Created", value: (r) => r.createdAt.toISOString() },
    { header: "Status", value: (r) => r.status },
    { header: "Name", value: (r) => r.name },
    { header: "Email", value: (r) => r.email },
    { header: "Phone", value: (r) => r.phone },
    { header: "Address", value: (r) => r.propertyAddress },
    { header: "Type", value: (r) => r.propertyType },
    { header: "Bedrooms", value: (r) => r.bedrooms },
    { header: "Bathrooms", value: (r) => r.bathrooms },
    { header: "Capacity", value: (r) => r.capacity },
    { header: "Availability", value: (r) => r.availabilityDates },
    { header: "Description", value: (r) => r.description },
  ]);

  return csvResponse(csv, "submissions.csv");
}
