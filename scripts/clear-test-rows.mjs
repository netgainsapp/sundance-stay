import { readFileSync } from "node:fs";
import pg from "pg";

const env = readFileSync(".env.local", "utf8");
const url = env.match(/^DATABASE_URL="?([^"\r\n]+)"?/m)?.[1];
if (!url) throw new Error("DATABASE_URL not found in .env.local");

const client = new pg.Client({ connectionString: url });
await client.connect();
// One-time cleanup of build-day test signups (all created 2026-06-24).
const { rows } = await client.query(
  `DELETE FROM "Waitlist" WHERE "createdAt" < '2026-06-25' RETURNING email`,
);
console.log("Deleted:", rows.map((r) => r.email).join(", "));
const { rows: remaining } = await client.query('SELECT count(*)::int AS n FROM "Waitlist"');
console.log("Rows remaining:", remaining[0].n);
await client.end();
