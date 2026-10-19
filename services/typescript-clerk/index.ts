// User profiles behind Clerk authentication: every protected route verifies
// the caller's Clerk session token, and each user's preferences are kept in
// a Postgres database.
//
//   GET  /{{name}}/profile         the signed-in user's profile and preferences
//   POST /{{name}}/preferences     update {"theme": "dark", "notifications": false, "bio": "..."}
//   POST /{{name}}/webhooks/clerk  Clerk's webhook: creates and deletes profiles
//
// The two profile routes need "Authorization: Bearer <Clerk session token>".
import { createClerkClient, verifyToken, type ClerkClient } from "@clerk/backend";
import { verifyWebhook } from "@clerk/backend/webhooks";
import { secret } from "@encore.dev/sdk/config";
import log from "@encore.dev/sdk/log";
import { onShutdown } from "@encore.dev/sdk/shutdown";
import { Database } from "@encore.dev/sdk/storage/postgres";

const service = "{{name}}";

// Your Clerk app's Secret Key (sk_...). It lets this service look users up
// in Clerk's Backend API, and verify session tokens against Clerk's published
// keys when ClerkJwtKey is not set.
const clerkSecretKey = secret("ClerkSecretKey");

// Your Clerk app's JWT public key, in PEM form. With it, session tokens are
// verified without calling Clerk at all (networkless verification).
const clerkJwtKey = secret("ClerkJwtKey");

// The signing secret (whsec_...) of the Clerk webhook endpoint pointing at
// POST /{{name}}/webhooks/clerk. Every webhook is checked against it.
const clerkWebhookSecret = secret("ClerkWebhookSecret");

// The origins of the frontends allowed to call this service, such as
// "http://localhost:3000". Clerk puts the origin a session token was issued
// to in its azp claim; when this list is not empty, a token issued to any
// other origin is rejected. Clerk recommends setting it.
const authorizedParties: string[] = [];

// db stores each user's preferences. Encore provisions it and applies the
// migrations in ./migrations before the service starts.
const db = new Database("{{ident}}", { migrations: "./migrations" });

type Theme = "light" | "dark";

interface ProfileRow {
  theme: Theme;
  notifications: boolean;
  bio: string | null;
}

/** The signed-in user's profile. */
interface Profile {
  userId: string;
  /** From Clerk's Backend API, when ClerkSecretKey is set. */
  email?: string;
  firstName?: string;
  lastName?: string;
  theme: Theme;
  notifications: boolean;
  bio?: string;
}

function error(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}

/**
 * Verifies the request's Clerk session token. Returns the user's Clerk id, or
 * the response to answer with when the request is not authenticated.
 */
async function authenticate(req: Request): Promise<{ userId: string } | Response> {
  const jwtKey = clerkJwtKey();
  const secretKey = clerkSecretKey();
  if (jwtKey === "" && secretKey === "") {
    log.error("neither ClerkJwtKey nor ClerkSecretKey is set, so no session token can be verified");
    return error("authentication is not configured: set the ClerkJwtKey or ClerkSecretKey secret", 503);
  }

  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : "";
  if (token === "") {
    return error("missing session token", 401);
  }

  try {
    // With jwtKey the token is checked locally; otherwise Clerk's public keys
    // are fetched (and cached) using the secret key.
    const claims = await verifyToken(token, {
      ...(jwtKey !== "" ? { jwtKey } : { secretKey }),
      authorizedParties: authorizedParties.length > 0 ? authorizedParties : undefined,
    });
    return { userId: claims.sub };
  } catch (err) {
    log.warn("rejected a session token", { reason: err instanceof Error ? err.message : String(err) });
    return error("invalid session token", 401);
  }
}

// A Clerk Backend API client, remade when the secret key changes.
let clerk: { key: string; client: ClerkClient } | undefined;
function clerkClient(): ClerkClient | undefined {
  const key = clerkSecretKey();
  if (key === "") return undefined;
  if (clerk?.key !== key) {
    clerk = { key, client: createClerkClient({ secretKey: key }) };
  }
  return clerk.client;
}

/** Returns the user's profile, creating it with the defaults on first use. */
async function getProfile(req: Request): Promise<Response> {
  const auth = await authenticate(req);
  if (auth instanceof Response) return auth;

  await db.exec`
    INSERT INTO user_profile (clerk_user_id) VALUES (${auth.userId})
    ON CONFLICT (clerk_user_id) DO NOTHING
  `;
  const row = await db.queryRow<ProfileRow>`
    SELECT theme, notifications, bio FROM user_profile
    WHERE clerk_user_id = ${auth.userId}
  `;
  if (!row) {
    return error("the profile was deleted meanwhile", 409);
  }

  const profile: Profile = {
    userId: auth.userId,
    theme: row.theme,
    notifications: row.notifications,
    bio: row.bio ?? undefined,
  };

  // The session token only names the user; their name and email address
  // come from Clerk's Backend API.
  const client = clerkClient();
  if (client) {
    try {
      const user = await client.users.getUser(auth.userId);
      profile.email = user.primaryEmailAddress?.emailAddress;
      profile.firstName = user.firstName ?? undefined;
      profile.lastName = user.lastName ?? undefined;
    } catch (err) {
      log.error(err, "could not look the user up in Clerk", { userId: auth.userId });
      return error("could not look the user up in Clerk", 502);
    }
  }

  return Response.json(profile);
}

/** Updates the given preferences, leaving the others as they are. */
async function updatePreferences(req: Request): Promise<Response> {
  const auth = await authenticate(req);
  if (auth instanceof Response) return auth;

  const body: unknown = await req.json().catch(() => undefined);
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return error('the body must be JSON like {"theme": "dark", "notifications": true, "bio": "..."}', 400);
  }
  const { theme, notifications, bio } = body as Record<string, unknown>;
  if (theme !== undefined && theme !== "light" && theme !== "dark") {
    return error('theme must be "light" or "dark"', 400);
  }
  if (notifications !== undefined && typeof notifications !== "boolean") {
    return error("notifications must be true or false", 400);
  }
  if (bio !== undefined && typeof bio !== "string") {
    return error("bio must be a string", 400);
  }

  await db.exec`
    INSERT INTO user_profile (clerk_user_id, theme, notifications, bio)
    VALUES (${auth.userId}, ${theme ?? "light"}, ${notifications ?? true}, ${bio ?? null})
    ON CONFLICT (clerk_user_id) DO UPDATE SET
      theme = COALESCE(${theme ?? null}, user_profile.theme),
      notifications = COALESCE(${notifications ?? null}, user_profile.notifications),
      bio = COALESCE(${bio ?? null}, user_profile.bio),
      updated_at = now()
  `;
  return Response.json({ success: true });
}

/**
 * Clerk's webhook. Clerk signs each delivery (Standard Webhooks, the svix-*
 * headers) with the endpoint's signing secret; anything else gets 400.
 */
async function clerkWebhook(req: Request): Promise<Response> {
  const signingSecret = clerkWebhookSecret();
  if (signingSecret === "") {
    log.error("ClerkWebhookSecret is not set, so no webhook can be verified");
    return error("webhooks are not configured: set the ClerkWebhookSecret secret", 503);
  }

  let event;
  try {
    event = await verifyWebhook(req, { signingSecret });
  } catch (err) {
    log.warn("rejected a webhook", { reason: err instanceof Error ? err.message : String(err) });
    return error("webhook verification failed", 400);
  }

  switch (event.type) {
    case "user.created":
      log.info("user created", { userId: event.data.id });
      await db.exec`
        INSERT INTO user_profile (clerk_user_id) VALUES (${event.data.id})
        ON CONFLICT (clerk_user_id) DO NOTHING
      `;
      break;
    case "user.updated":
      log.info("user updated", { userId: event.data.id });
      break;
    case "user.deleted":
      log.info("user deleted", { userId: event.data.id });
      if (event.data.id) {
        await db.exec`DELETE FROM user_profile WHERE clerk_user_id = ${event.data.id}`;
      }
      break;
    default:
      log.info("ignored a webhook", { type: event.type });
  }
  return new Response(null, { status: 204 });
}

// Encore's local run supplies ENCORE_LISTEN_ADDR as host:port. Run on its own,
// this falls back to PORT and then to 8080.
function listenAddr(): { hostname?: string; port: number } {
  const addr = process.env.ENCORE_LISTEN_ADDR;
  if (addr) {
    const at = addr.lastIndexOf(":");
    return { hostname: addr.slice(0, at) || undefined, port: Number(addr.slice(at + 1)) };
  }
  return { port: Number(process.env.PORT ?? 8080) };
}

const server = Bun.serve({
  ...listenAddr(),
  routes: {
    [`/${service}/profile`]: { GET: getProfile },
    [`/${service}/preferences`]: { POST: updatePreferences },
    [`/${service}/webhooks/clerk`]: { POST: clerkWebhook },
  },
  fetch: () => error("not found", 404),
  error: (err) => {
    log.error(err, "request failed");
    return error("internal error", 500);
  },
});

// On shutdown, finish the requests in flight before Encore exits.
onShutdown(() => server.stop());

log.info("listening", { service, addr: `${server.hostname}:${server.port}` });
