import { readFileSync } from "node:fs";
import pg from "pg";

const env = readFileSync(".env.local", "utf8");
const url = env.match(/^DATABASE_URL="?([^"\r\n]+)"?/m)?.[1];
if (!url) throw new Error("DATABASE_URL not found in .env.local");

const client = new pg.Client({ connectionString: url });
await client.connect();
await client.query(
  `INSERT INTO "FeatureFlag" (key, enabled, "updatedAt") VALUES ('blog_autopublish', true, now())
   ON CONFLICT (key) DO UPDATE SET enabled = true, "updatedAt" = now()`,
);
const { rows } = await client.query('SELECT key, enabled FROM "FeatureFlag"');
console.table(rows);
await client.end();
