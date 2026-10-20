// Configures the Prisma CLI. `prisma generate` needs no database; the commands
// that do, such as `prisma migrate diff` and `prisma studio`, read its URL from
// DATABASE_URL (the README shows how to get it from Encore).
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
  // Encore applies ./migrations and records its progress in schema_migrations.
  // Prisma leaves that table alone rather than diffing it away.
  experimental: { externalTables: true },
  tables: { external: ["public.schema_migrations"] },
});
