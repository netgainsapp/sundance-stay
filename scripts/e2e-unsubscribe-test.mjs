import { readFileSync } from "node:fs";
import pg from "pg";

// E2E: insert a disposable subscriber, hit the live unsubscribe URL with its
// token, verify the flag flipped, then remove the row.
const env = readFileSync(".env.local", "utf8");
const url = env.match(/^DATABASE_URL="?([^"\r\n]+)"?/m)?.[1];
const client = new pg.Client({ connectionString: url });
await client.connect();

const email = "e2e-unsub-test@example.com";
await client.query('DELETE FROM "Waitlist" WHERE email = $1', [email]);
const { rows: [row] } = await client.query(
  `INSERT INTO "Waitlist" (id, email, "isPartner", "dripStage", "unsubscribed", "unsubscribeToken")
   VALUES ('e2etest' || substr(md5(random()::text),1,18), $1, false, 3, false, md5(random()::text || clock_timestamp()))
   RETURNING "unsubscribeToken"`, [email]);

const res = await fetch(
  `https://boulderfilmcollective.com/api/waitlist/unsubscribe?token=${row.unsubscribeToken}`,
);
const body = await res.text();
const { rows: [after] } = await client.query(
  'SELECT unsubscribed FROM "Waitlist" WHERE email = $1', [email]);

console.log("HTTP:", res.status);
console.log("Page says unsubscribed:", body.includes("You are unsubscribed"));
console.log("DB flag flipped:", after.unsubscribed === true);

// Bad token must 404
const bad = await fetch("https://boulderfilmcollective.com/api/waitlist/unsubscribe?token=not-a-real-token");
console.log("Bad token status:", bad.status);

await client.query('DELETE FROM "Waitlist" WHERE email = $1', [email]);
console.log("Test row cleaned up");
await client.end();
