import { PrismaPg } from "@prisma/adapter-pg";
import { Database } from "@encore.dev/sdk/storage/postgres";
import { PrismaClient } from "./generated/prisma/client";

// db is the service's Postgres database. Encore provisions it and applies the
// migrations in ./migrations before the service starts.
const db = new Database("{{ident}}", { migrations: "./migrations" });

// prisma queries the database through Prisma's Postgres driver adapter,
// connected with the connection string Encore gives the database.
export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: db.connectionString }),
});
