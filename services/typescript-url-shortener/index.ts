// A URL shortener: it gives each URL a random short id and stores both in a
// Postgres database.
//
//   POST /{{name}}/url       shorten {"url": "https://..."}, returning {"id": "...", "url": "..."}
//   GET  /{{name}}/url/:id   get the URL a short id stands for
//   GET  /{{name}}/url       list every shortened URL
import log from "@encore.dev/sdk/log";
import { onShutdown } from "@encore.dev/sdk/shutdown";
import { Database } from "@encore.dev/sdk/storage/postgres";
import { randomBytes } from "node:crypto";

const service = "{{name}}";

// db stores the shortened URLs. Encore provisions it and applies the
// migrations in ./migrations before the service starts.
const db = new Database("{{ident}}", { migrations: "./migrations" });

/** A shortened URL. */
interface ShortURL {
  /** The short id. */
  id: string;
  /** The complete URL, in long form. */
  url: string;
}

function error(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}

/** Whether s is an absolute http or https URL. */
function isWebURL(s: unknown): s is string {
  if (typeof s !== "string") return false;
  try {
    const u = new URL(s);
    return (u.protocol === "http:" || u.protocol === "https:") && u.host !== "";
  } catch {
    return false;
  }
}

/** Stores a URL under a new random short id. */
async function shorten(req: Request): Promise<Response> {
  const body: unknown = await req.json().catch(() => undefined);
  const url = (body as { url?: unknown } | null | undefined)?.url;
  if (!isWebURL(url)) {
    return error('the body must be JSON like {"url": "https://..."} with an absolute http or https URL', 400);
  }
  // 6 random bytes, base64url-encoded into 8 characters.
  const id = randomBytes(6).toString("base64url");
  await db.exec`
    INSERT INTO url (id, original_url)
    VALUES (${id}, ${url})
  `;
  return Response.json({ id, url } satisfies ShortURL, { status: 201 });
}

/** Returns the URL a short id stands for. */
async function get(id: string): Promise<Response> {
  const row = await db.queryRow<{ original_url: string }>`
    SELECT original_url FROM url
    WHERE id = ${id}
  `;
  if (!row) return error("no url with that id", 404);
  return Response.json({ id, url: row.original_url } satisfies ShortURL);
}

/** Returns every shortened URL. */
async function list(): Promise<Response> {
  const rows = await db.queryAll<{ id: string; original_url: string }>`
    SELECT id, original_url FROM url
    ORDER BY id
  `;
  const urls: ShortURL[] = rows.map((r) => ({ id: r.id, url: r.original_url }));
  return Response.json({ urls });
}

// Encore's local run supplies ENCORE_LISTEN_ADDR as host:port. Run on its own,
// this falls back to PORT and then to 8080.
function listenAddr(): { hostname?: string; port: number } {
  const addr = process.env.ENCORE_LISTEN_ADDR;
  if (addr) {
    const at = addr.lastIndexOf(":");
    return { hostname: addr.slice(0, at) || undefined, port: Number(addr.slice(at + 1)) };
  }
  return { port: Number(process.env.PORT ?? 8080) };
}

const server = Bun.serve({
  ...listenAddr(),
  routes: {
    "/{{name}}/url": { GET: list, POST: shorten },
    "/{{name}}/url/:id": { GET: (req) => get(req.params.id) },
  },
  fetch: () => error("not found", 404),
  error(err) {
    log.error(err, "handling a request");
    return error("internal error", 500);
  },
});

log.info("listening", { service, addr: `${server.hostname}:${server.port}` });

// On shutdown, finish the requests in flight before Encore closes the database.
onShutdown(() => server.stop());
