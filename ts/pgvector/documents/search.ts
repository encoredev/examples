import { api, APIError } from "encore.dev/api";
import { db, toVectorLiteral } from "./db";
import { embed } from "./openai";

interface SearchRequest {
  query: string;
  limit?: number;
}

interface SearchResult {
  id: number;
  content: string;
  similarity: number;
}

interface SearchResponse {
  results: SearchResult[];
}

// Search documents by semantic similarity to the query.
// Uses cosine distance (the <=> operator from pgvector).
export const search = api(
  { expose: true, method: "POST", path: "/search" },
  async (req: SearchRequest): Promise<SearchResponse> => {
    const query = req.query.trim();
    if (!query) {
      throw APIError.invalidArgument("query cannot be empty");
    }
    const limit = Math.min(Math.max(req.limit ?? 5, 1), 50);

    const embedding = await embed(query);
    const literal = toVectorLiteral(embedding);

    const rows = db.query<SearchResult>`
      SELECT
        id,
        content,
        1 - (embedding <=> ${literal}::vector) AS similarity
      FROM documents
      ORDER BY embedding <=> ${literal}::vector
      LIMIT ${limit}
    `;

    const results: SearchResult[] = [];
    for await (const row of rows) {
      results.push(row);
    }
    return { results };
  }
);
