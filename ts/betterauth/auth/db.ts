import { SQLDatabase } from "encore.dev/storage/sqldb";

// Encore provisions and manages the database automatically.
// Locally it starts a PostgreSQL instance when you run `encore run`.
export const db = new SQLDatabase("auth", {
  migrations: "./migrations",
});
