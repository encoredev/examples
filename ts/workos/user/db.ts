import { SQLDatabase } from "encore.dev/storage/sqldb";

// Encore provisions and manages the database automatically.
// Locally it uses Docker, in the cloud it provisions the appropriate
// managed database (e.g. Cloud SQL on GCP, RDS on AWS).
export const db = new SQLDatabase("user", {
  migrations: "./migrations",
});
