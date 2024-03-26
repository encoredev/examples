import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = new SQLDatabase("note", { migrations: "./migrations" });

interface Note {
  id: string;
  text: string;
  coverURL: string;
}

export const saveNote = api(
  { expose: true, method: "POST", path: "/note" },
  async ({ text, id, coverURL }: Note): Promise<Note> => {
    await db.exec`
        INSERT INTO note (id, text, cover_url)
        VALUES (${id}, ${text}, ${coverURL})
        ON CONFLICT (id) DO UPDATE SET
          text      = excluded.text,
          cover_url = excluded.cover_url
    `;
    return { text, id, coverURL };
  }
);

export const getNote = api(
  { expose: true, method: "GET", path: "/note/:id" },
  async ({ id }: { id: string }): Promise<Note> => {
    const row = await db.queryRow`
      SELECT text, cover_url
      FROM note
      WHERE id = ${id}
    `;
    if (!row) throw APIError.notFound("note not found");
    return { id, text: row.text, coverURL: row.cover_url };
  }
);
