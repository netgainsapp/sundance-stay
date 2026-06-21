import { requireAdmin } from "./admin-auth";
import { rateLimit } from "./rate-limit-durable";
import { clientIp } from "./request";

/**
 * Shared guard for admin CSV export routes. Returns a Response to short-circuit
 * the request, or null when the caller may proceed.
 *
 * Layers: admin session check, cross-site request rejection (blocks GET-based
 * CSRF that would trigger a download in the operator's browser), and per-IP
 * rate limiting.
 */
export async function guardCsvExport(request: Request): Promise<Response | null> {
  try {
    await requireAdmin();
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }

  // Allow our own export link (same-origin) and direct navigation/typed URL
  // ("none"); reject cross-site and same-site (sibling subdomain) requests.
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
    return new Response("Forbidden", { status: 403 });
  }

  const ip = clientIp(request.headers);
  if (!(await rateLimit("admin-export", ip, 30, 600)).ok) {
    return new Response("Too many requests", { status: 429 });
  }

  return null;
}

export function csvResponse(csv: string, filename: string): Response {
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
