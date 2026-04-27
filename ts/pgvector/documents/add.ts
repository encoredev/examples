import { api, APIError } from "encore.dev/api";
import { db, toVectorLiteral } from "./db";
import { embed } from "./openai";

interface AddRequest {
  content: string;
}

interface AddResponse {
  id: number;
  message: string;
}

// Add a document. The content is embedded with OpenAI and stored in pgvector.
export const add = api(
  { expose: true, method: "POST", path: "/documents" },
  async (req: AddRequest): Promise<AddResponse> => {
    const content = req.content.trim();
    if (!content) {
      throw APIError.invalidArgument("content cannot be empty");
    }

    const embedding = await embed(content);
    const literal = toVectorLiteral(embedding);

    const row = await db.queryRow<{ id: number }>`
      INSERT INTO documents (content, embedding)
      VALUES (${content}, ${literal}::vector)
      RETURNING id
    `;

    return { id: row!.id, message: `Document #${row!.id} stored` };
  }
);
