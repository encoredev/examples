import { APIError } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";

// AuthData represents the authenticated user's data.
interface AuthData {
  userId: string;
}

// Placeholder auth handler for demo purposes.
// Reads the user ID from the `auth_user` query string parameter.
export const auth = authHandler(
  async (params): Promise<AuthData> => {
    const userId = params.query.get("auth_user");
    if (!userId) {
      throw APIError.unauthenticated("missing auth_user query parameter");
    }
    return { userId };
  },
);
