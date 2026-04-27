import { api } from "encore.dev/api";
import { db } from "./db";

interface DocumentSummary {
  id: number;
  content: string;
  createdAt: string;
}

interface ListResponse {
  documents: DocumentSummary[];
}

// List the most recently added documents.
export const list = api(
  { expose: true, method: "GET", path: "/documents" },
  async (): Promise<ListResponse> => {
    const rows = db.query<{ id: number; content: string; created_at: Date }>`
      SELECT id, content, created_at
      FROM documents
      ORDER BY created_at DESC
      LIMIT 50
    `;

    const documents: DocumentSummary[] = [];
    for await (const row of rows) {
      documents.push({
        id: row.id,
        content: row.content,
        createdAt: row.created_at.toISOString(),
      });
    }
    return { documents };
  }
);
