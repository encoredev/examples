// User signups, event-driven: a signup is stored in Postgres and published as
// an event on a Pub/Sub topic, and a subscription to that topic sends the new
// user a welcome email, apart from the request that signed them up.
//
//   POST /{{name}}/users       sign up a user from {"name": "...", "email": "..."}
//   GET  /{{name}}/users       list every user
//   GET  /{{name}}/users/:id   get one user
import { secret } from "@encore.dev/sdk/config";
import log from "@encore.dev/sdk/log";
import { Subscription, Topic } from "@encore.dev/sdk/pubsub";
import { onShutdown } from "@encore.dev/sdk/shutdown";
import { Database } from "@encore.dev/sdk/storage/postgres";

const service = "{{name}}";

// The database holding the users, migrated from ./migrations before the
// service starts.
const db = new Database("{{ident}}", { migrations: "./migrations" });

interface User {
  id: number;
  name: string;
  email: string;
}

// UserAdded is published for each signup, after the user is stored.
interface UserAdded {
  id: number;
  name: string;
  email: string;
}

const userAdded = new Topic<UserAdded>("{{kebab}}-user-added", {
  deliveryGuarantee: "at-least-once",
});

// The SendGrid API key. Without it, the welcome email is logged rather than sent.
const sendGridAPIKey = secret("SendGridAPIKey");

// The sender of the welcome email: an address SendGrid has verified for your account.
const fromAddress = "welcome@example.com";

// Sends each new user a welcome email. A handler that throws has its message
// redelivered later, so a failed send is retried.
const welcomeEmail = new Subscription(userAdded, "{{kebab}}-welcome-email", {
  handler: async (msg) => {
    const user = JSON.parse(msg.data.toString()) as UserAdded;
    await sendWelcomeEmail(user);
  },
});

async function sendWelcomeEmail(user: UserAdded): Promise<void> {
  const subject = `Welcome ${user.name}!`;
  const text = "You are sooo welcome!";

  const apiKey = sendGridAPIKey();
  if (!apiKey) {
    log.info("SendGridAPIKey is not set; not sending the welcome email", {
      to: user.email,
      from: fromAddress,
      subject,
      text,
    });
    return;
  }

  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: user.email, name: user.name }] }],
      from: { email: fromAddress },
      subject,
      content: [{ type: "text/plain", value: text }],
    }),
  });
  if (!res.ok) {
    throw new Error(`SendGrid answered ${res.status}: ${await res.text()}`);
  }
  log.info("welcome email sent", { to: user.email });
}

function toUser(row: Record<string, any>): User {
  return { id: Number(row.id), name: row.name, email: row.email };
}

async function signUp(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = undefined;
  }
  const { name, email } = (body ?? {}) as Record<string, unknown>;
  if (typeof name !== "string" || name.trim() === "" || typeof email !== "string" || !email.includes("@")) {
    return error('the body must be JSON like {"name": "Ada", "email": "ada@example.com"}', 400);
  }

  const row = await db.queryRow`
    INSERT INTO users (name, email) VALUES (${name}, ${email})
    RETURNING id, name, email`;
  const user = toUser(row!);
  await userAdded.publish(user);
  log.info("user signed up", { id: user.id });
  return Response.json(user, { status: 201 });
}

async function listUsers(): Promise<Response> {
  const rows = await db.queryAll`SELECT id, name, email FROM users ORDER BY id`;
  return Response.json({ users: rows.map(toUser) });
}

async function getUser(id: string): Promise<Response> {
  if (!/^\d+$/.test(id)) {
    return error("the user id must be a number", 400);
  }
  const row = await db.queryRow`SELECT id, name, email FROM users WHERE id = ${Number(id)}`;
  return row ? Response.json(toUser(row)) : error("no such user", 404);
}

function error(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
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
    "/{{name}}/users": { GET: listUsers, POST: signUp },
    "/{{name}}/users/:id": { GET: (req) => getUser(req.params.id) },
  },
  fetch: () => error("not found", 404),
  error(err) {
    log.error(err, "request failed");
    return error("internal error", 500);
  },
});

// On shutdown, finish the requests in flight. Encore then waits for the
// subscription's handlers to finish.
onShutdown(() => server.stop());

console.log(`${service} listening on ${server.hostname}:${server.port}`);
