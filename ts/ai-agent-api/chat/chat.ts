import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { ai } from "~encore/clients";
import crypto from "node:crypto";

const db = new SQLDatabase("chat", {
  migrations: "./migrations",
});

// -------------------------------------------------------------------
// POST /chat — Send a message and get an AI response
// -------------------------------------------------------------------

interface ChatRequest {
  message: string;
  session_id?: string;
}

interface ChatResponse {
  session_id: string;
  response: string;
}

export const send = api(
  { expose: true, auth: false, method: "POST", path: "/chat" },
  async ({ message, session_id }: ChatRequest): Promise<ChatResponse> => {
    // Create a new session if none provided.
    const sid = session_id ?? crypto.randomUUID();

    if (!session_id) {
      await db.exec`INSERT INTO sessions (id) VALUES (${sid})`;
    }

    // Store the user message.
    await db.exec`
      INSERT INTO messages (session_id, role, content)
      VALUES (${sid}, 'user', ${message})
    `;

    // Load conversation history for context.
    const rows = db.query<{ role: string; content: string }>`
      SELECT role, content FROM messages
      WHERE session_id = ${sid}
      ORDER BY created_at ASC
    `;
    const history: { role: "user" | "assistant"; content: string }[] = [];
    for await (const row of rows) {
      history.push({ role: row.role as "user" | "assistant", content: row.content });
    }

    // Call the AI service to generate a response.
    const { content } = await ai.complete({ messages: history });

    // Store the assistant response.
    await db.exec`
      INSERT INTO messages (session_id, role, content)
      VALUES (${sid}, 'assistant', ${content})
    `;

    return { session_id: sid, response: content };
  },
);

// -------------------------------------------------------------------
// GET /chat/:session_id — Get conversation history
// -------------------------------------------------------------------

interface MessageResponse {
  role: string;
  content: string;
  created_at: string;
}

export const history = api(
  { expose: true, auth: false, method: "GET", path: "/chat/:session_id" },
  async ({ session_id }: { session_id: string }): Promise<{ messages: MessageResponse[] }> => {
    const session = await db.queryRow`SELECT id FROM sessions WHERE id = ${session_id}`;
    if (!session) throw APIError.notFound("session not found");

    const rows = db.query<MessageResponse>`
      SELECT role, content, created_at
      FROM messages
      WHERE session_id = ${session_id}
      ORDER BY created_at ASC
    `;
    const messages: MessageResponse[] = [];
    for await (const row of rows) {
      messages.push(row);
    }
    return { messages };
  },
);

// -------------------------------------------------------------------
// GET /chat — List all sessions
// -------------------------------------------------------------------

interface Session {
  id: string;
  created_at: string;
}

export const listSessions = api(
  { expose: true, auth: false, method: "GET", path: "/chat" },
  async (): Promise<{ sessions: Session[] }> => {
    const rows = db.query<Session>`
      SELECT id, created_at FROM sessions
      ORDER BY created_at DESC
    `;
    const sessions: Session[] = [];
    for await (const row of rows) {
      sessions.push(row);
    }
    return { sessions };
  },
);
