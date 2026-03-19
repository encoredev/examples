import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { WebhookTopic } from "./topic";
import crypto from "node:crypto";

// -------------------------------------------------------------------
// GET / — Landing page with usage instructions
// -------------------------------------------------------------------

export const index = api.raw(
  { expose: true, method: "GET", path: "/" },
  async (req, resp) => {
    const host = req.headers["host"] ?? "localhost:4000";
    const proto = req.headers["x-forwarded-proto"] ?? "http";
    const baseUrl = `${proto}://${host}`;
    resp.setHeader("Content-Type", "text/html");
    resp.end(landingPage.replaceAll("{{baseUrl}}", baseUrl));
  },
);

const landingPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Webhook Processor</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #0a0a0a; color: #e5e5e5; padding: 2rem; max-width: 720px; margin: 0 auto; line-height: 1.6; }
    h1 { font-size: 1.75rem; margin-bottom: 0.5rem; color: #fff; }
    h2 { font-size: 1.1rem; margin-top: 2rem; margin-bottom: 0.75rem; color: #fff; }
    h3 { font-size: 0.95rem; margin-top: 1.5rem; margin-bottom: 0.5rem; color: #d4d4d4; }
    p { margin-bottom: 1rem; color: #a3a3a3; }
    code { background: #1a1a1a; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.9em; color: #e5e5e5; }
    pre { background: #1a1a1a; border: 1px solid #262626; border-radius: 8px; padding: 1rem; overflow-x: auto; margin-bottom: 1rem; }
    pre code { background: none; padding: 0; }
    .endpoint { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
    .method { font-size: 0.75rem; font-weight: 600; padding: 0.2rem 0.5rem; border-radius: 4px; font-family: monospace; }
    .post { background: #1d4ed8; color: #fff; }
    .get { background: #15803d; color: #fff; }
    .path { font-family: monospace; color: #e5e5e5; }
    .desc { color: #737373; font-size: 0.9rem; margin-bottom: 1.25rem; }
    a { color: #60a5fa; }
    .badge { display: inline-block; background: #1d4ed8; color: #fff; font-size: 0.7rem; padding: 0.15rem 0.5rem; border-radius: 999px; margin-left: 0.5rem; font-weight: 600; vertical-align: middle; position: relative; top: -0.15em; }
  </style>
</head>
<body>
  <h1>Webhook Processor <span class="badge">Encore.ts</span></h1>
  <p>Receive, validate, and process webhooks from external services. Events are published to a Pub/Sub topic and processed by multiple subscribers independently (fan-out pattern).</p>

  <p>Explore and test all endpoints in the <a href="http://localhost:9400/">Local Dashboard</a> when running locally, or in <a href="https://app.encore.cloud">Encore Cloud</a> when deployed.</p>

  <h2>Setup</h2>
  <p>Optionally set webhook secrets for signature validation:</p>
  <pre><code>encore secret set --type dev,local,pr,prod WebhookSecretStripe
encore secret set --type dev,local,pr,prod WebhookSecretGitHub</code></pre>
  <p>The Postgres database is provisioned automatically when you run <code>encore run</code>. No manual database setup required.</p>

  <h2>Architecture</h2>
  <p>Three services demonstrate the fan-out pattern:</p>
  <p><strong>ingest</strong> receives webhooks and publishes to a Pub/Sub topic. <strong>processor</strong> and <strong>notifications</strong> both subscribe independently, so each event is handled by both services in parallel.</p>

  <h2>Endpoints</h2>

  <h3>Ingest</h3>

  <div class="endpoint">
    <span class="method post">POST</span>
    <span class="path">/webhooks/:source</span>
    <code>ingest.receive</code>
  </div>
  <p class="desc">Receive a webhook. Validates signature if configured, then queues for processing.</p>
  <pre><code>curl -X POST {{baseUrl}}/webhooks/stripe \\
  -H "Content-Type: application/json" \\
  -d '{"payload": {"type": "payment_intent.succeeded", "data": {"amount": 2000}}}'</code></pre>

  <pre><code># GitHub webhook example
curl -X POST {{baseUrl}}/webhooks/github \\
  -H "Content-Type: application/json" \\
  -d '{"payload": {"action": "push", "ref": "refs/heads/main"}}'</code></pre>

  <h3>Processed Events</h3>

  <div class="endpoint">
    <span class="method get">GET</span>
    <span class="path">/webhooks/events</span>
    <code>processor.list</code>
  </div>
  <p class="desc">List the 50 most recent processed events.</p>
  <pre><code>curl {{baseUrl}}/webhooks/events</code></pre>

  <div class="endpoint">
    <span class="method get">GET</span>
    <span class="path">/webhooks/events/:id</span>
    <code>processor.get</code>
  </div>
  <p class="desc">Get a specific processed event by ID.</p>
  <pre><code>curl {{baseUrl}}/webhooks/events/1</code></pre>

</body>
</html>`;

const stripeSecret = secret("WebhookSecretStripe");
const githubSecret = secret("WebhookSecretGitHub");

interface IngestRequest {
  source: string;
  payload: Record<string, unknown>;
  signature?: string;
}

interface IngestResponse {
  status: string;
}

// POST /webhooks/:source — Receive and queue a webhook.
// Validates the signature if a secret is configured for the source,
// then publishes the event to the webhook topic for async processing.
export const receive = api(
  { expose: true, auth: false, method: "POST", path: "/webhooks/:source" },
  async ({ source, payload, signature }: IngestRequest): Promise<IngestResponse> => {
    // Validate signature if secret is configured for this source.
    const webhookSecret = getSecretForSource(source);
    if (webhookSecret && signature) {
      const expected = crypto
        .createHmac("sha256", webhookSecret)
        .update(JSON.stringify(payload))
        .digest("hex");

      if (signature !== expected) {
        return { status: "invalid signature" };
      }
    }

    // Extract event type from common webhook payload patterns.
    const event_type = extractEventType(source, payload);

    await WebhookTopic.publish({
      source,
      event_type,
      payload,
      received_at: new Date().toISOString(),
    });

    return { status: "accepted" };
  },
);

function getSecretForSource(source: string): string | null {
  switch (source) {
    case "stripe":
      return stripeSecret();
    case "github":
      return githubSecret();
    default:
      return null;
  }
}

function extractEventType(
  source: string,
  payload: Record<string, unknown>,
): string {
  // Stripe uses a "type" field (e.g. "payment_intent.succeeded").
  if (source === "stripe" && typeof payload.type === "string") {
    return payload.type;
  }
  // GitHub uses an "action" field within the event payload.
  if (source === "github" && typeof payload.action === "string") {
    return payload.action;
  }
  // Fall back to a generic event type.
  if (typeof payload.event === "string") {
    return payload.event;
  }
  return "unknown";
}
