import { APIError, Gateway } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { Header } from "encore.dev/api";
import { auth } from "./auth";

interface AuthParams {
  authorization: Header<"Authorization">;
}

interface AuthData {
  userID: string;
}

// Validate Better Auth sessions for protected endpoints.
// Any endpoint with `auth: true` will run this handler first.
const handler = authHandler<AuthParams, AuthData>(async (params) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      authorization: params.authorization,
    }),
  });

  if (!session) {
    throw APIError.unauthenticated("invalid session");
  }

  return { userID: session.user.id };
});

export const gateway = new Gateway({ authHandler: handler });
