// Error tracking with Sentry: errors thrown by the routes are reported to
// Sentry, with the request they happened in, and answered with a 500 that
// carries the Sentry event id.
//
//   GET  /{{name}}/users          a page of (sample) users: ?page=1&limit=10&department=...
//   POST /{{name}}/trigger-error  throws an error to see it in Sentry: {"errorType": "database"}
//
// The DSN comes from the SentryDsn secret. Until it is set, Sentry is
// disabled and errors are only logged.
import * as Sentry from "@sentry/bun";
import { appMeta } from "@encore.dev/sdk";
import { secret } from "@encore.dev/sdk/config";
import log from "@encore.dev/sdk/log";
import { onShutdown } from "@encore.dev/sdk/shutdown";

const service = "{{name}}";

// Your Sentry project's DSN (Project Settings → Client Keys).
const sentryDsn = secret("SentryDsn");

// Sentry.init comes before Bun.serve: Sentry instruments Bun.serve, so that
// the events it captures during a request carry that request.
const dsn = sentryDsn();
const meta = appMeta();
Sentry.init({
  // With no DSN, Sentry is disabled and sends nothing.
  dsn: dsn || undefined,
  environment: meta.environment.name,
  release: meta.build.revision || undefined,
  // Encore traces every request already, so Sentry is used for errors only.
  tracesSampleRate: 0,
});
if (dsn) {
  log.info("reporting errors to Sentry", { environment: meta.environment.name });
} else {
  log.warn("SentryDsn is not set, so Sentry is disabled and errors are only logged");
}

/** A user, as a user management API might return it. */
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
}

const users: User[] = [
  {
    id: "usr_001",
    email: "john.doe@company.com",
    firstName: "John",
    lastName: "Doe",
    role: "Senior Software Engineer",
    department: "Engineering",
    isActive: true,
    lastLogin: "2025-01-15T10:30:00Z",
    createdAt: "2024-06-15T09:00:00Z",
  },
  {
    id: "usr_002",
    email: "jane.smith@company.com",
    firstName: "Jane",
    lastName: "Smith",
    role: "Product Manager",
    department: "Product",
    isActive: true,
    lastLogin: "2025-01-15T14:20:00Z",
    createdAt: "2024-08-20T11:30:00Z",
  },
  {
    id: "usr_003",
    email: "mike.wilson@company.com",
    firstName: "Mike",
    lastName: "Wilson",
    role: "DevOps Engineer",
    department: "Platform",
    isActive: false,
    lastLogin: "2025-01-10T16:45:00Z",
    createdAt: "2024-04-10T08:15:00Z",
  },
];

function error(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}

/** A positive integer query parameter, its default when absent, or undefined when invalid. */
function positiveInt(params: URLSearchParams, name: string, fallback: number): number | undefined {
  const raw = params.get(name);
  if (raw === null) return fallback;
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : undefined;
}

/** Lists the users a page at a time, optionally only those of one department. */
function listUsers(req: Request): Response {
  const params = new URL(req.url).searchParams;
  const page = positiveInt(params, "page", 1);
  const limit = positiveInt(params, "limit", 10);
  if (page === undefined || limit === undefined) {
    return error("page and limit must be positive integers", 400);
  }
  const department = params.get("department");
  const matching = department ? users.filter((u) => u.department === department) : users;
  return Response.json({
    data: matching.slice((page - 1) * limit, page * limit),
    total: matching.length,
    page,
    limit,
    hasNext: page * limit < matching.length,
  });
}

// The errors /trigger-error can throw, by errorType.
const errors: Record<string, string> = {
  validation: "Validation failed: Invalid user data provided",
  database: "Database connection failed: Unable to connect to PostgreSQL",
  permission: "Permission denied: User does not have required permissions",
  timeout: "Request timeout: Operation took longer than 30 seconds",
  notfound: "Resource not found: User with ID usr_999 does not exist",
  generic: "Something went wrong in the application",
};

/** Throws an error of the requested type, for Sentry to capture. */
async function triggerError(req: Request): Promise<Response> {
  const body: unknown = await req.json().catch(() => ({}));
  const errorType = (body as { errorType?: unknown } | null)?.errorType ?? "generic";
  if (typeof errorType !== "string" || !(errorType in errors)) {
    return error(`errorType must be one of: ${Object.keys(errors).join(", ")}`, 400);
  }
  // Tags and context set here are attached to the event Sentry captures.
  Sentry.setTag("error_type", errorType);
  throw new Error(errors[errorType]);
}

/**
 * Wraps a route so that an error it throws is reported to Sentry and
 * answered with a 500 carrying the Sentry event id, which finds the event in
 * Sentry. The event is tagged with the Encore trace id, which finds the
 * request's trace in Encore.
 */
function withSentry(
  handler: (req: Request) => Response | Promise<Response>,
): (req: Request) => Promise<Response> {
  return async (req) => {
    try {
      return await handler(req);
    } catch (err) {
      // The traceparent header Encore's gateway sends: 00-<trace id>-<span id>-<flags>.
      const traceId = req.headers.get("traceparent")?.split("-")[1];
      const eventId = Sentry.withScope((scope) => {
        if (traceId) scope.setTag("encore_trace_id", traceId);
        return Sentry.captureException(err);
      });
      log.error(err, "request failed", dsn ? { sentryEventId: eventId } : undefined);
      return Response.json({ error: "internal error", eventId: dsn ? eventId : undefined }, { status: 500 });
    }
  };
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
    [`/${service}/users`]: { GET: withSentry(listUsers) },
    [`/${service}/trigger-error`]: { POST: withSentry(triggerError) },
  },
  fetch: () => error("not found", 404),
});

// On shutdown, finish the requests in flight and send the events Sentry still
// holds before Encore exits.
onShutdown(async () => {
  await server.stop();
  await Sentry.close(2000);
});

log.info("listening", { service, addr: `${server.hostname}:${server.port}` });
