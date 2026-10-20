// The guestbook's database, used from server-side code only: Server
// Components, Server Actions and route handlers. Never import it from a
// "use client" module.
//
// Load it with `await import("@/db")` where it is needed, not with a static
// import: loading it starts Encore's runtime, which `next build` (loading every
// route to read its config) has none of.
import { Database } from "@encore.dev/sdk/storage/postgres";

// db stores the guestbook entries. Encore provisions it and applies the
// migrations in ./migrations before the service starts.
const db = new Database("{{ident}}", { migrations: "./migrations" });

/** One guestbook entry. */
export interface Entry {
  id: number;
  name: string;
  message: string;
  createdAt: string;
}

/** The limit on a name's and a message's length, in characters. */
export const MAX_NAME = 80;
export const MAX_MESSAGE = 500;

/** Returns the newest entries, newest first. */
export async function listEntries(limit = 50): Promise<Entry[]> {
  const rows = await db.queryAll<{ id: string; name: string; message: string; created_at: Date }>`
    SELECT id, name, message, created_at FROM entry
    ORDER BY id DESC
    LIMIT ${limit}
  `;
  return rows.map((r) => ({
    id: Number(r.id),
    name: r.name,
    message: r.message,
    createdAt: r.created_at.toISOString(),
  }));
}

/**
 * Checks and stores a new entry, returning it, or an error message if the
 * name or message is empty or too long.
 */
export async function addEntry(name: string, message: string): Promise<Entry | string> {
  name = name.trim();
  message = message.trim();
  if (name === "" || message === "") return "Both a name and a message are needed.";
  if (name.length > MAX_NAME) return `The name can be at most ${MAX_NAME} characters.`;
  if (message.length > MAX_MESSAGE) return `The message can be at most ${MAX_MESSAGE} characters.`;
  const row = await db.queryRow<{ id: string; created_at: Date }>`
    INSERT INTO entry (name, message)
    VALUES (${name}, ${message})
    RETURNING id, created_at
  `;
  return { id: Number(row!.id), name, message, createdAt: row!.created_at.toISOString() };
}
