import { api } from "encore.dev/api";
import { randomBytes } from "node:crypto";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const DB = new SQLDatabase("url", { migrations: "./migrations" });

interface URL {
  id: string; // short-form URL id
  url: string; // complete URL, in long form
}

interface ShortenParams {
  url: string; // the URL to shorten
}

// Shorten shortens a URL.
export const shorten = api(
  { method: "POST", path: "/url" },
  async ({ url }: ShortenParams): Promise<URL> => {
    const id = randomBytes(6).toString("base64url");
    await DB.exec`
      INSERT INTO url (id, original_url)
      VALUES (${id}, ${url})
    `;
    return { id, url };
  },
);

// Get retrieves the original URL for the id.
export const get = api(
  { method: "GET", path: "/url/:id" },
  async ({ id }: { id: string }): Promise<URL> => {
    const row = await DB.queryRow`
      SELECT original_url FROM url WHERE id = ${id}
    `;
    if (!row) throw new Error("url not found");
    return { id, url: row.original_url };
  },
);

interface ListResponse {
  urls: URL[];
}

// List retrieves all URLs.
export const list = api(
  { method: "GET", path: "/url" },
  async (): Promise<ListResponse> => {
    const rows = DB.query`
      SELECT id, original_url FROM url
    `;
    const urls: URL[] = [];
    for await (const row of rows) {
      urls.push({ id: row.id, url: row.original_url });
    }
    return { urls };
  },
);
