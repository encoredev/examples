import { api } from "encore.dev/api";
import { db } from "./db";

interface ListFilesRequest {
  customerId: string;
}

interface FileInfo {
  id: string;
  filename: string;
  sizeBytes: number;
  downloadUrl: string;
  expiresAt: Date;
  createdAt: Date;
}

interface ListFilesResponse {
  files: FileInfo[];
}

export const listFiles = api(
  { expose: true, method: "GET", path: "/files/:customerId" },
  async ({ customerId }: ListFilesRequest): Promise<ListFilesResponse> => {
    const rows = db.query<{
      id: string;
      filename: string;
      size_bytes: number;
      expires_at: Date;
      created_at: Date;
    }>`
      SELECT id, filename, size_bytes, expires_at, created_at
      FROM files
      WHERE uploaded_by = ${customerId}
        AND expires_at > NOW()
      ORDER BY created_at DESC
    `;

    const files: FileInfo[] = [];
    const baseUrl = process.env.ENCORE_API_URL || "http://localhost:4000";
    
    for await (const row of rows) {
      files.push({
        id: row.id,
        filename: row.filename,
        sizeBytes: row.size_bytes,
        downloadUrl: `${baseUrl}/download/${row.id}`,
        expiresAt: row.expires_at,
        createdAt: row.created_at,
      });
    }

    return { files };
  }
);

