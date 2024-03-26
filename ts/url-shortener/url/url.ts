import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { randomBytes } from "node:crypto";

const db = new SQLDatabase("url", { migrations: "./migrations" });

interface URL {
  id: string; // short-form URL id
  url: string; // complete URL, in long form
}

interface ShortenParams {
  url: string; // the URL to shorten
}

// shorten shortens a URL.
export const shorten = api(
  { expose: true, auth: false, method: "POST", path: "/url" },
  async ({ url }: ShortenParams): Promise<URL> => {
    const id = randomBytes(6).toString("base64url");
    await db.exec`
        INSERT INTO url (id, original_url)
        VALUES (${id}, ${url})
    `;
    return { id, url };
  }
);

// Get retrieves the original URL for the id.
export const get = api(
  { expose: true, auth: false, method: "GET", path: "/url/:id" },
  async ({ id }: { id: string }): Promise<URL> => {
    const row = await db.queryRow`
        SELECT original_url FROM url WHERE id = ${id}
    `;
    if (!row) throw APIError.notFound("url not found");
    return { id, url: row.original_url };
  }
);

interface ListResponse {
  urls: URL[];
}

// List retrieves all URLs.
export const list = api(
  { expose: false, method: "GET", path: "/url" },
  async (): Promise<ListResponse> => {
    const rows = db.query`
        SELECT id, original_url
        FROM url
    `;
    const urls: URL[] = [];
    for await (const row of rows) {
      urls.push({ id: row.id, url: row.original_url });
    }
    return { urls };
  }
);
