import { SQLDatabase } from "encore.dev/storage/sqldb";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.js";

// Initialize Encore database
export const database = new SQLDatabase("auth", {
  migrations: {
    path: "migrations",
    source: "drizzle",
  },
});

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: database.connectionString,
});

// Initialize Drizzle ORM
export const db = drizzle(pool, { schema });

