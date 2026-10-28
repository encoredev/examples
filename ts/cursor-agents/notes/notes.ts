import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = new SQLDatabase("notes", { migrations: "./migrations" });

export interface Note {
  id: number;
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NoteRow {
  id: number;
  title: string;
  body: string;
  created_at: Date;
  updated_at: Date;
}

const toNote = (r: NoteRow): Note => ({
  id: Number(r.id),
  title: r.title,
  body: r.body,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

// Lists notes, most recently changed first. The UI shows these beside the chat.
export const list = api(
  { expose: true, method: "GET", path: "/notes" },
  async (): Promise<{ notes: Note[] }> => {
    const rows = await db.queryAll<NoteRow>`SELECT * FROM notes ORDER BY updated_at DESC LIMIT 100`;
    return { notes: rows.map(toNote) };
  },
);

// Finds notes whose title or body contains the query. Not exposed: only the
// agent's tools call it, from inside the app.
export const search = api(
  { expose: false },
  async ({ query }: { query: string }): Promise<{ notes: Note[] }> => {
    const like = `%${query.replace(/[%_\\]/g, "\\$&")}%`;
    const rows = await db.queryAll<NoteRow>`
      SELECT * FROM notes WHERE title ILIKE ${like} OR body ILIKE ${like}
      ORDER BY updated_at DESC LIMIT 20`;
    return { notes: rows.map(toNote) };
  },
);

// Saves a new note, or replaces an existing one when `id` is given. Not
// exposed, like search.
export const save = api(
  { expose: false },
  async (p: { id?: number; title: string; body: string }): Promise<Note> => {
    const row = p.id
      ? await db.queryRow<NoteRow>`
          UPDATE notes SET title = ${p.title}, body = ${p.body}, updated_at = now()
          WHERE id = ${p.id} RETURNING *`
      : await db.queryRow<NoteRow>`
          INSERT INTO notes (title, body) VALUES (${p.title}, ${p.body}) RETURNING *`;
    if (!row) throw APIError.notFound("note not found");
    return toNote(row);
  },
);
