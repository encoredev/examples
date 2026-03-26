import { APIError, Gateway, Header } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { ory } from "./ory";

// AuthParams defines what Encore extracts from incoming requests.
// The Authorization header carries the Ory session token.
interface AuthParams {
  authorization: Header<"Authorization">;
}

// AuthData is returned to protected endpoints via getAuthData().
export interface AuthData {
  userID: string;
  email: string;
  name?: string;
}

// Validate Ory session tokens for protected endpoints.
// Any endpoint with `auth: true` runs this handler first.
const handler = authHandler<AuthParams, AuthData>(async (params) => {
  const token = params.authorization?.replace("Bearer ", "");

  if (!token) {
    throw APIError.unauthenticated("missing session token");
  }

  try {
    // Verify the session token with Ory's API.
    const { data: session } = await ory.toSession({
      xSessionToken: token,
    });

    const userID = session.identity?.id;
    if (!userID) {
      throw new Error("No identity in session");
    }

    return {
      userID,
      email: session.identity?.traits?.email || "",
      name: session.identity?.traits?.name || undefined,
    };
  } catch (err: any) {
    console.error("Session verification failed:", err?.message || err);
    throw APIError.unauthenticated("invalid session token");
  }
});

// The gateway applies the auth handler to all incoming requests.
export const gateway = new Gateway({ authHandler: handler });
