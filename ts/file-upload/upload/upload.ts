import { api } from "encore.dev/api";
import log from "encore.dev/log";
import busboy from "busboy";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { APICallMeta, appMeta, currentRequest } from "encore.dev";

// Define a database named 'files', using the database migrations
// in the "./migrations" folder. Encore automatically provisions,
// migrates, and connects to the database.
export const DB = new SQLDatabase("files", {
  migrations: "./migrations",
});

type FileEntry = { data: any[]; filename: string };

/**
 * Raw endpoint for storing a single file to the database.
 * Setting bodyLimit to null allows for unlimited file size.
 */
export const save = api.raw(
  { expose: true, method: "POST", path: "/upload", bodyLimit: null },
  async (req, res) => {
    const bb = busboy({
      headers: req.headers,
      limits: { files: 1 },
    });
    const entry: FileEntry = { filename: "", data: [] };

    bb.on("file", (_, file, info) => {
      entry.filename = info.filename;
      file
        .on("data", (data) => {
          entry.data.push(data);
        })
        .on("close", () => {
          log.info(`File ${entry.filename} uploaded`);
        })
        .on("limit", () => {
          res.writeHead(413, { Connection: "close" });
          res.end("File size exceeds the limit");
        });
    });

    bb.on("close", async () => {
      try {
        const buf = Buffer.concat(entry.data);
        await saveToDb(entry.filename, buf);
        log.info(`File ${entry.filename} saved`);

        // Redirect to the root page
        res.writeHead(303, { Connection: "close", Location: "/" });
        res.end();
      } catch (err) {
        res.writeHead(500, { Connection: "close" });
        res.end(`Error: ${(err as Error).message}`);
      }
    });

    req.pipe(bb);
    return;
  },
);

/**
 * Raw endpoint for storing a multiple files to the database.
 * Setting bodyLimit to null allows for unlimited file size.
 */
export const saveMultiple = api.raw(
  { expose: true, method: "POST", path: "/upload-multiple", bodyLimit: null },
  async (req, res) => {
    const bb = busboy({ headers: req.headers });
    const entries: FileEntry[] = [];

    bb.on("file", (_, file, info) => {
      const entry: FileEntry = { filename: info.filename, data: [] };

      file
        .on("data", (data) => {
          entry.data.push(data);
        })
        .on("close", () => {
          entries.push(entry);
        })
        .on("limit", () => {
          res.writeHead(413, { Connection: "close" });
          res.end("File size exceeds the limit");
        });
    });

    bb.on("close", async () => {
      try {
        for (const entry of entries) {
          const buf = Buffer.concat(entry.data);
          await saveToDb(entry.filename, buf);
          log.info(`File ${entry.filename} saved`);
        }

        // Redirect to the root page
        res.writeHead(303, { Connection: "close", Location: "/" });
        res.end();
      } catch (err) {
        res.writeHead(500, { Connection: "close" });
        res.end(`Error: ${(err as Error).message}`);
      }
    });

    req.pipe(bb);
    return;
  },
);

// Helper function for saving a file to the database
const saveToDb = async (name: string, data: Buffer) => {
  return await DB.exec`
      INSERT INTO files (name, data)
      VALUES (${name}, ${data})
      ON CONFLICT (name) DO UPDATE
          SET data = ${data}
  `;
};

// Raw endpoint for serving a file from the database
export const get = api.raw(
  { expose: true, method: "GET", path: "/files/:name" },
  async (req, resp) => {
    try {
      const { name } = (currentRequest() as APICallMeta).pathParams;
      const row = await DB.queryRow`
          SELECT data
          FROM files
          WHERE name = ${name}`;
      if (!row) {
        resp.writeHead(404);
        resp.end("File not found");
        return;
      }

      const chunk = Buffer.from(row.data);
      resp.writeHead(200, { Connection: "close" });
      resp.end(chunk);
    } catch (err) {
      resp.writeHead(500);
      resp.end((err as Error).message);
    }
  },
);

interface ListResponse {
  files: { name: string; url: string }[];
}

// API endpoint for listing all files in the database
export const list = api(
  { expose: true, method: "GET", path: "/files" },
  async (): Promise<ListResponse> => {
    const rows = await DB.query`
        SELECT name
        FROM files
    `;
    if (!rows) {
      return { files: [] };
    }
    const resp: ListResponse = { files: [] };
    const { apiBaseUrl } = appMeta();
    for await (const row of rows) {
      resp.files.push({
        name: row.name,
        url: `${apiBaseUrl}/files/${row.name}`,
      });
    }
    return resp;
  },
);

// Serving some static HTML for demo purposes
export const frontend = api.raw(
  { expose: true, path: "/!path", method: "GET" },
  (req, resp) => {
    resp.writeHead(200, { "Content-Type": "text/html" });
    resp.end(`
      <html>
        <head></head>
        <body>          
          <form method="POST" enctype="multipart/form-data" action="/upload">
            <label for="filefield">Single file upload:</label><br>
            <input type="file" name="filefield">
            <input type="submit">
          </form>
          <br/> 
          <form method="POST" enctype="multipart/form-data" action="/upload-multiple">
            <label for="filefield">Multiple files upload:</label><br>
            <input type="file" name="filefield" multiple>
            <input type="submit">
          </form>
          <br/>
          <h2>Files:</h2>

         <script>
           async function getData() {
            try {
              const response = await fetch("/files");
              const json = await response.json();
              const list = document.createElement("ul");
              json.files.forEach((file) => {
                const item = document.createElement("li");
                const link = document.createElement("a");
                link.href = file.url;
                link.textContent = file.name;
                item.appendChild(link);
                list.appendChild(item);
              });
              document.body.appendChild(list);
            } catch (error) {
              console.error(error.message);
            }
          }
          getData();
        </script>
        </body>
      </html>
    `);
  },
);
