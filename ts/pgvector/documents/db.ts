import { SQLDatabase } from "encore.dev/storage/sqldb";

// Postgres database with the pgvector extension enabled in the migration.
export const db = new SQLDatabase("documents", {
  migrations: "./migrations",
});

// pgvector accepts a literal like '[0.1, 0.2, ...]' cast to ::vector.
export function toVectorLiteral(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}
