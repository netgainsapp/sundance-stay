import { readFileSync } from "node:fs";
import pg from "pg";

const env = readFileSync(".env.local", "utf8");
const url = env.match(/^DATABASE_URL="?([^"\r\n]+)"?/m)?.[1];
if (!url) throw new Error("DATABASE_URL not found in .env.local");

const client = new pg.Client({ connectionString: url });
await client.connect();
const { rows } = await client.query(
  'SELECT email, "isPartner", "dripStage", "createdAt"::date::text AS created FROM "Waitlist" ORDER BY "createdAt"',
);
console.table(rows);
await client.end();
