import * as Sentry from "@sentry/node";

let initialized = false;

export function initSentry(dsn: string) {
  if (initialized) return;
  initialized = true;

  Sentry.init({
    dsn,
    environment: process.env.ENCORE_ENVIRONMENT ?? "development",
    sampleRate: 1.0,
    // Encore has its own distributed tracing, so disable Sentry's.
    tracesSampleRate: 0.0,
    // Encore's Rust gateway handles inbound HTTP, so the default
    // HTTP/Express integrations won't see incoming requests.
    integrations: (defaults) =>
      defaults.filter(
        (i) => !["Http", "Express", "Fastify", "Connect"].includes(i.name)
      ),
  });
}

// Wraps an Encore API handler to catch errors and report them to Sentry
// with endpoint name and request data as context.
export function withSentry<Req, Resp>(
  name: string,
  handler: (req: Req) => Promise<Resp>
): (req: Req) => Promise<Resp> {
  return async (req) => {
    return Sentry.withScope(async (scope) => {
      scope.setTag("endpoint", name);
      try {
        return await handler(req);
      } catch (err) {
        scope.setExtra("request", req);
        Sentry.captureException(err);
        throw err; // Re-throw so Encore handles it normally
      }
    });
  };
}

export { Sentry };
