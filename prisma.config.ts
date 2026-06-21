import { config as loadEnv } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Next.js uses .env.local for local secrets; the Prisma CLI does not read it
// automatically, so load it (then .env as a fallback) before resolving env().
loadEnv({ path: ".env.local" });
loadEnv();

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
