// File uploads: the bytes go to an object storage bucket, and each file's
// metadata (content type, size, upload time) to a Postgres table.
//
//   GET    /{{name}}/              an HTML page to upload files and list them
//   POST   /{{name}}/upload        upload one or more files (multipart/form-data)
//   GET    /{{name}}/files         list the stored files
//   GET    /{{name}}/files/:name   download a file
//   DELETE /{{name}}/files/:name   delete a file
import log from "@encore.dev/sdk/log";
import { onShutdown } from "@encore.dev/sdk/shutdown";
import { Bucket, ObjectNotFound } from "@encore.dev/sdk/storage/objects";
import { Database } from "@encore.dev/sdk/storage/postgres";

const service = "{{name}}";
const prefix = `/${service}`;

// The bucket holding the files' contents, keyed by file name. Encore provisions
// it from this declaration.
const files = new Bucket("{{kebab}}-files", { versioned: false });

// The database holding the files' metadata, migrated from ./migrations before
// the service starts.
const db = new Database("{{ident}}", { migrations: "./migrations" });

interface FileInfo {
  name: string;
  contentType: string;
  size: number;
  uploadedAt: Date;
  url: string;
}

function toInfo(row: Record<string, any>): FileInfo {
  return {
    name: row.name,
    contentType: row.content_type,
    size: Number(row.size),
    uploadedAt: row.uploaded_at,
    url: `${prefix}/files/${encodeURIComponent(row.name)}`,
  };
}

async function listFiles(): Promise<FileInfo[]> {
  const rows = await db.queryAll`
    SELECT name, content_type, size, uploaded_at FROM files ORDER BY name`;
  return rows.map(toInfo);
}

// upload stores every file in a multipart/form-data body, whatever its field
// names. A file with the name of a stored one replaces it.
async function upload(req: Request): Promise<Response> {
  const form = await req.formData().catch(() => undefined);
  const uploads = [...(form?.values() ?? [])]
    .filter((value) => typeof value !== "string")
    .filter((file) => file.name !== "");
  if (uploads.length === 0) {
    return error("the form holds no files", 400);
  }

  const stored: FileInfo[] = [];
  for (const file of uploads) {
    const contentType = file.type || "application/octet-stream";
    const data = Buffer.from(await file.arrayBuffer());
    await files.upload(file.name, data, { contentType });
    const row = await db.queryRow`
      INSERT INTO files (name, content_type, size)
      VALUES (${file.name}, ${contentType}, ${data.length})
      ON CONFLICT (name) DO UPDATE
        SET content_type = EXCLUDED.content_type,
            size = EXCLUDED.size,
            uploaded_at = now()
      RETURNING name, content_type, size, uploaded_at`;
    stored.push(toInfo(row!));
    log.info("file uploaded", { name: file.name, size: data.length });
  }

  // A browser submitting the upload page's form goes back to the page.
  if (req.headers.get("accept")?.includes("text/html")) {
    return new Response(null, { status: 303, headers: { Location: `${prefix}/` } });
  }
  return Response.json({ files: stored }, { status: 201 });
}

async function download(name: string): Promise<Response> {
  const row = await db.queryRow`SELECT content_type FROM files WHERE name = ${name}`;
  if (!row) {
    return error("no such file", 404);
  }
  let data: Buffer;
  try {
    data = await files.download(name);
  } catch (err) {
    if (err instanceof ObjectNotFound) return error("no such file", 404);
    throw err;
  }
  return new Response(data, {
    headers: {
      "Content-Type": row.content_type,
      "Content-Disposition": `${disposition(row.content_type)}; filename*=UTF-8''${encodeURIComponent(name)}`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}

// disposition shows images in the browser and has it save anything else:
// uploaded HTML or SVG shown inline would run as this site's own page.
function disposition(contentType: string): "inline" | "attachment" {
  return contentType.startsWith("image/") && !contentType.startsWith("image/svg")
    ? "inline"
    : "attachment";
}

async function remove(name: string): Promise<Response> {
  const row = await db.queryRow`DELETE FROM files WHERE name = ${name} RETURNING name`;
  if (!row) {
    return error("no such file", 404);
  }
  try {
    await files.remove(name);
  } catch (err) {
    if (!(err instanceof ObjectNotFound)) throw err;
  }
  log.info("file deleted", { name });
  return new Response(null, { status: 204 });
}

async function page(): Promise<Response> {
  const items = (await listFiles())
    .map(
      (f) =>
        `<li><a href="${escape(f.url)}">${escape(f.name)}</a> (${escape(f.contentType)}, ${f.size} bytes)</li>`,
    )
    .join("\n");
  const html = `<!doctype html>
<html>
  <head><meta charset="utf-8"><title>${escape(service)} files</title></head>
  <body>
    <h1>Upload files</h1>
    <form method="POST" enctype="multipart/form-data" action="${escape(prefix)}/upload">
      <input type="file" name="files" multiple>
      <button type="submit">Upload</button>
    </form>
    <h2>Stored files</h2>
    <ul>
${items || "<li>None yet.</li>"}
    </ul>
  </body>
</html>
`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

function escape(text: string): string {
  return text.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

function error(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
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
  // Bun's default is 128 MiB; uploads are read into memory whole.
  maxRequestBodySize: 128 * 1024 * 1024,
  routes: {
    "/{{name}}": { GET: page },
    "/{{name}}/": { GET: page },
    "/{{name}}/upload": { POST: upload },
    "/{{name}}/files": { GET: async () => Response.json({ files: await listFiles() }) },
    "/{{name}}/files/:name": {
      GET: (req) => download(req.params.name),
      DELETE: (req) => remove(req.params.name),
    },
  },
  fetch: () => error("not found", 404),
  error(err) {
    log.error(err, "request failed");
    return error("internal error", 500);
  },
});

// On shutdown, finish the requests in flight.
onShutdown(() => server.stop());

console.log(`${service} listening on ${server.hostname}:${server.port}`);
