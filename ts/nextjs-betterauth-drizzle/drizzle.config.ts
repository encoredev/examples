import type { Config } from "drizzle-kit";

export default {
  out: "./auth/migrations",
  schema: "./auth/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;

