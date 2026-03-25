import { SQLDatabase } from "encore.dev/storage/sqldb";

// Encore provisions this database automatically.
// Docker locally, RDS or Cloud SQL in production.
export const db = new SQLDatabase("orders", {
  migrations: "./migrations",
});
