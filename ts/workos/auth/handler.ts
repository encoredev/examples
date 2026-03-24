import { APIError, Gateway, Header } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { workosClientId } from "./workos";

// Build a JWKS fetcher that caches WorkOS's public signing keys.
// The keys are fetched from WorkOS's JWKS endpoint and cached automatically.
const JWKS = createRemoteJWKSet(
  new URL(`https://api.workos.com/sso/jwks/${workosClientId()}`)
);

// AuthParams defines what Encore extracts from incoming requests.
// The Authorization header carries the access token from AuthKit.
interface AuthParams {
  authorization: Header<"Authorization">;
}

// AuthData is returned to protected endpoints via getAuthData().
// Add more fields here as your application needs grow.
export interface AuthData {
  userID: string;
  organizationID?: string;
  role?: string;
  permissions?: string[];
  sessionID?: string;
}

// Validate WorkOS AuthKit JWTs for protected endpoints.
// Any endpoint with `auth: true` runs this handler first.
const handler = authHandler<AuthParams, AuthData>(async (params) => {
  const token = params.authorization?.replace("Bearer ", "");

  if (!token) {
    throw APIError.unauthenticated("missing access token");
  }

  try {
    // Verify the JWT signature against WorkOS's JWKS and validate claims.
    const { payload } = await jwtVerify(token, JWKS);

    const userID = payload.sub;
    if (!userID) {
      throw new Error("No user ID in token");
    }

    return {
      userID,
      organizationID: payload.org_id as string | undefined,
      role: payload.role as string | undefined,
      permissions: payload.permissions as string[] | undefined,
      sessionID: payload.sid as string | undefined,
    };
  } catch (err: any) {
    console.error("JWT verification failed:", err?.message || err);
    throw APIError.unauthenticated("invalid access token");
  }
});

// The gateway applies the auth handler to all incoming requests.
export const gateway = new Gateway({ authHandler: handler });
