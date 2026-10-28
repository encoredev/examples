import { SQLDatabase } from "encore.dev/storage/sqldb";

export const db = new SQLDatabase("agent", { migrations: "./migrations" });

// Writes cast through text (`$1::text::jsonb`) so Postgres parses the JSON
// instead of storing it as one string. Reads go through here so a value that
// still arrives as text is parsed either way.
export const json = <T>(v: T | string): T => (typeof v === "string" ? (JSON.parse(v) as T) : v);
