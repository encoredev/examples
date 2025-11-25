import { APIError, Gateway, Header } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { db } from "./db";
import { session, user } from "./schema";
import { eq } from "drizzle-orm";
import log from "encore.dev/log";

// Define what we extract from the Authorization header
interface AuthParams {
  authorization: Header<"Authorization">;
}

// Define what authenticated data we make available to endpoints
export interface AuthData {
  userID: string;
  email: string;
  name: string;
}

const myAuthHandler = authHandler(
  async (params: AuthParams): Promise<AuthData> => {
    const token = params.authorization.replace("Bearer ", "");

    if (!token) {
      throw APIError.unauthenticated("no token provided");
    }

    try {
      // Query the session directly from the database using Drizzle
      const sessionRows = await db
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

      // Check if session is expired
      if (new Date(sessionRow.expiresAt) < new Date()) {
        throw APIError.unauthenticated("session expired");
      }

      // Get user info
      const userRows = await db
        .select({
          id: user.id,
          email: user.email,
          name: user.name,
        })
        .from(user)
        .where(eq(user.id, sessionRow.userId))
        .limit(1);

      const userRow = userRows[0];

      if (!userRow) {
        throw APIError.unauthenticated("user not found");
      }

      return {
        userID: userRow.id,
        email: userRow.email,
        name: userRow.name,
      };
    } catch (e) {
      log.error(e);
      throw APIError.unauthenticated("invalid token", e as Error);
    }
  }
);

// Create gateway with auth handler
export const gateway = new Gateway({ authHandler: myAuthHandler });

