// auth/db.ts
import { SQLDatabase } from "encore.dev/storage/sqldb"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

export const DB = new SQLDatabase("auth", {
  migrations: {
    path: "./migrations",
  },
})

// Create Drizzle instance
const pool = new Pool({
  connectionString: DB.connectionString,
})

export const db = drizzle(pool, { schema })
