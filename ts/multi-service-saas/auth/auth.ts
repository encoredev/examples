import { APIError, Gateway } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { Query } from "encore.dev/api";

// AuthParams defines how the auth handler receives credentials.
interface AuthParams {
  // The user ID to authenticate as. Pass as ?auth_user=<user_id>.
  auth_user: Query<string>;
}

// AuthData represents the authenticated user's data.
interface AuthData {
  userID: string;
}

// Placeholder auth handler for demo purposes.
// Reads the user ID from the `auth_user` query string parameter.
// In a real app, replace this with JWT validation, session cookies,
// or an auth provider like Clerk or Auth0.
export const auth = authHandler<AuthParams, AuthData>(
  async (params): Promise<AuthData> => {
    if (!params.auth_user) {
      throw APIError.unauthenticated("missing auth_user query parameter");
    }
    return { userID: params.auth_user };
  },
);

export const gw = new Gateway({
  authHandler: auth,
});