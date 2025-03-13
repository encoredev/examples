import { SQLDatabase } from "encore.dev/storage/sqldb";

/**
 * Configure a SQL database connection for the subscription service.
 * See https://encore.dev/docs/ts/primitives/databases for more information.
 */
export const db = new SQLDatabase("subscription", {
	migrations: "./migrations",
});
