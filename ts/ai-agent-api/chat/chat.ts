import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { ai } from "~encore/clients";
import crypto from "node:crypto";

// -------------------------------------------------------------------
// GET / — Landing page with usage instructions
// -------------------------------------------------------------------

export const index = api.raw(
  { expose: true, method: "GET", path: "/" },
  async (req, resp) => {
    resp.setHeader("Content-Type", "text/html");
    resp.end(landingPage);
  },
);

const landingPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Agent API</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #0a0a0a; color: #e5e5e5; padding: 2rem; max-width: 720px; margin: 0 auto; line-height: 1.6; }
    h1 { font-size: 1.75rem; margin-bottom: 0.5rem; color: #fff; }
    h2 { font-size: 1.1rem; margin-top: 2rem; margin-bottom: 0.75rem; color: #fff; }
    p { margin-bottom: 1rem; color: #a3a3a3; }
    code { background: #1a1a1a; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.9em; color: #e5e5e5; }
    pre { background: #1a1a1a; border: 1px solid #262626; border-radius: 8px; padding: 1rem; overflow-x: auto; margin-bottom: 1rem; }
    pre code { background: none; padding: 0; }
    .endpoint { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
    .method { font-size: 0.75rem; font-weight: 600; padding: 0.2rem 0.5rem; border-radius: 4px; font-family: monospace; }
    .post { background: #1d4ed8; color: #fff; }
    .get { background: #15803d; color: #fff; }
    .path { font-family: monospace; color: #e5e5e5; }
    .desc { color: #737373; font-size: 0.9rem; margin-bottom: 1.25rem; }
    a { color: #60a5fa; }
    .badge { display: inline-block; background: #1d4ed8; color: #fff; font-size: 0.7rem; padding: 0.15rem 0.5rem; border-radius: 999px; margin-left: 0.5rem; font-weight: 600; }
  </style>
</head>
<body>
  <h1>AI Agent API <span class="badge">Encore.ts</span></h1>
  <p>A conversational AI backend powered by Claude. Messages are persisted in Postgres so you can continue conversations across requests.</p>

  <h2>Endpoints</h2>

  <div class="endpoint">
    <span class="method post">POST</span>
    <span class="path">/chat</span>
  </div>
  <p class="desc">Send a message. Returns an AI response and a session ID for follow-ups.</p>
  <pre><code>curl -X POST http://localhost:4000/chat \\
  -H "Content-Type: application/json" \\
  -d '{"message": "What is Encore?"}'</code></pre>

  <pre><code># Continue the conversation
curl -X POST http://localhost:4000/chat \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Tell me more", "session_id": "&lt;session_id&gt;"}'</code></pre>

  <div class="endpoint">
    <span class="method get">GET</span>
    <span class="path">/chat/:session_id</span>
  </div>
  <p class="desc">Get the full conversation history for a session.</p>
  <pre><code>curl http://localhost:4000/chat/&lt;session_id&gt;</code></pre>

  <div class="endpoint">
    <span class="method get">GET</span>
    <span class="path">/chat</span>
  </div>
  <p class="desc">List all sessions.</p>
  <pre><code>curl http://localhost:4000/chat</code></pre>

  <h2>Setup</h2>
  <p>Set your Anthropic API key:</p>
  <pre><code>encore secret set --type dev,local,pr,prod AnthropicAPIKey</code></pre>

  <p>Open the <a href="/frontend">Encore Local Dashboard</a> to explore and test all endpoints interactively.</p>
</body>
</html>`;

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
