import { api } from "encore.dev/api";
import { uploads } from "./bucket";
import { db } from "./db";

interface DownloadRequest {
  fileId: string;
}

export const download = api.raw(
  { expose: true, path: "/download/:fileId", method: "GET" },
  async (req, res) => {
    // Extract fileId from URL
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const fileId = url.pathname.split("/")[2];

    // Get file metadata
    const file = await db.queryRow<{
      filename: string;
      content_type: string;
      storage_key: string;
      expires_at: Date;
      size_bytes: number;
    }>`
      SELECT filename, content_type, storage_key, expires_at, size_bytes
      FROM files
      WHERE id = ${fileId}
    `;

    if (!file) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "file not found" }));
      return;
    }

    // Check expiration
    if (new Date() > file.expires_at) {
      res.writeHead(410, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "file expired" }));
      return;
    }

    // Download from bucket
    const fileData = await uploads.download(file.storage_key);

    // Serve file
    res.writeHead(200, {
      "Content-Type": file.content_type,
      "Content-Disposition": `attachment; filename="${file.filename}"`,
      "Content-Length": file.size_bytes,
    });
    res.end(fileData);
  }
);

