import { api } from "encore.dev/api";
import log from "encore.dev/log";
import { toNodeHandler } from "better-auth/node";
import { Readable } from "stream";
import { auth } from "./better-auth.js";

/**
 * Better Auth API handler
 * This raw endpoint handles all authentication requests from the frontend
 */
export const authHandler = api.raw(
  { expose: true, path: "/api/auth/*path", method: "*" },
  async (req, res) => {
    try {
      // Read the request body if it exists
      if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        const chunks: Buffer[] = [];
        for await (const chunk of req) {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        const bodyBuffer = Buffer.concat(chunks);
        
        // Create a new readable stream with Uint8Array chunks
        const uint8Array = new Uint8Array(bodyBuffer);
        const bodyStream = Readable.from([uint8Array]);
        
        // Create a new request object with the readable stream
        const newReq = Object.assign(bodyStream, {
          method: req.method,
          url: req.url,
          headers: req.headers,
          httpVersion: req.httpVersion,
          httpVersionMajor: req.httpVersionMajor,
          httpVersionMinor: req.httpVersionMinor,
        });
        
        // Use Better Auth's Node adapter with the modified request
        const handler = toNodeHandler(auth);
        return await handler(newReq as any, res);
      }
      
      // For non-body requests, pass through directly
      const handler = toNodeHandler(auth);
      return await handler(req, res);
    } catch (error) {
      log.error("Authentication error:", { 
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
);

/**
 * Get current session
 * Returns the current authenticated user session
 */
interface SessionResponse {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    emailVerified: boolean;
  } | null;
  session: {
    id: string;
    expiresAt: Date;
    token: string;
  } | null;
}

export const getSession = api(
  { expose: true, method: "GET", path: "/api/session", auth: false },
  async (): Promise<SessionResponse> => {
    // This is a placeholder - the session is actually managed by Better Auth
    // via cookies. The frontend will call Better Auth directly for session info.
    return {
      user: null,
      session: null,
    };
  }
);

