import { api, APIError } from "encore.dev/api";
import { uploads } from "./bucket";
import { db } from "./db";
import { checkSubscriptionByUserId } from "../payments/subscriptions";
import { db as authDb } from "../auth/db";
import { session, user } from "../auth/schema";
import { eq } from "drizzle-orm";
import log from "encore.dev/log";

const MAX_FREE_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_PREMIUM_SIZE = 5 * 1024 * 1024 * 1024; // 5GB
const FREE_RETENTION_DAYS = 7;
const PREMIUM_RETENTION_DAYS = 30;

interface UploadResponse {
  fileId: string;
  downloadUrl: string;
  expiresAt: Date;
  tier: "free" | "premium";
}

// Helper function to validate auth token (returns null if no auth)
async function validateToken(authHeader: string | undefined): Promise<{ userId: string; email: string } | null> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null; // No auth provided
  }

  const token = authHeader.replace("Bearer ", "");

  // Query session
  const sessionRows = await authDb
    .select({
      userId: session.userId,
      expiresAt: session.expiresAt,
    })
    .from(session)
    .where(eq(session.token, token))
    .limit(1);

  const sessionRow = sessionRows[0];
  if (!sessionRow) {
    throw APIError.unauthenticated("invalid session");
  }

  if (new Date(sessionRow.expiresAt) < new Date()) {
    throw APIError.unauthenticated("session expired");
  }

  // Get user
  const userRows = await authDb
    .select({ id: user.id, email: user.email })
    .from(user)
    .where(eq(user.id, sessionRow.userId))
    .limit(1);

  const userRow = userRows[0];
  if (!userRow) {
    throw APIError.unauthenticated("user not found");
  }

  return { userId: userRow.id, email: userRow.email };
}

export const upload = api.raw(
  {
    expose: true,
    path: "/upload",
    method: "POST",
    bodyLimit: 6 * 1024 * 1024 * 1024, // 6GB to accommodate premium tier
  },
  async (req, res) => {
    try {
      // Validate authentication (optional)
      const authHeader = Array.isArray(req.headers.authorization)
        ? req.headers.authorization[0]
        : req.headers.authorization;
      const auth = await validateToken(authHeader);

      const userId = auth?.userId || `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const userEmail = auth?.email || "anonymous";

      log.info("File upload started", { userId, email: userEmail, isAuthenticated: !!auth });

      // Check subscription status for authenticated users
      let isPremium = false;
      if (auth) {
        const subscription = await checkSubscriptionByUserId(auth.userId);
        isPremium = subscription.hasActiveSubscription;
      }

      // Read file from request
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const fileBuffer = Buffer.concat(chunks);
      const fileSize = fileBuffer.length;

      // Check size limits
      const maxSize = isPremium ? MAX_PREMIUM_SIZE : MAX_FREE_SIZE;
      const tier: "free" | "premium" = isPremium ? "premium" : "free";

      if (fileSize > maxSize) {
        res.writeHead(413, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "file_too_large",
            maxSize: maxSize,
            tier: tier,
            upgradeUrl: "https://sandbox.polar.sh/4cbe308e-b875-4e30-92e7-4b9e0b2a6cae",
          })
        );
        return;
      }

      // Generate file ID and storage key
      const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const filename =
        (Array.isArray(req.headers["x-filename"])
          ? req.headers["x-filename"][0]
          : req.headers["x-filename"]) || "upload";
      const contentType =
        (Array.isArray(req.headers["content-type"])
          ? req.headers["content-type"][0]
          : req.headers["content-type"]) || "application/octet-stream";
      const storageKey = `${userId}/${fileId}`;

      // Upload to bucket
      await uploads.upload(storageKey, fileBuffer, {
        contentType,
      });

      // Calculate expiration
      const retentionDays = isPremium ? PREMIUM_RETENTION_DAYS : FREE_RETENTION_DAYS;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + retentionDays);

      // Save metadata
      await db.exec`
        INSERT INTO files (id, filename, size_bytes, content_type, uploaded_by, storage_key, expires_at)
        VALUES (${fileId}, ${filename}, ${fileSize}, ${contentType}, ${userId}, ${storageKey}, ${expiresAt})
      `;

      log.info("File uploaded successfully", { fileId, userId, fileSize, tier });

      // Return download URL
      const baseUrl = process.env.ENCORE_API_URL || "http://localhost:4000";
      const response: UploadResponse = {
        fileId,
        downloadUrl: `${baseUrl}/download/${fileId}`,
        expiresAt,
        tier,
      };

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response));
    } catch (error) {
      log.error("Upload failed", { error });
      if (error instanceof APIError) {
        res.writeHead(error.httpStatus, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: error.message }));
      } else {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "internal server error" }));
      }
    }
  }
);
