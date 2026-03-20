import { api } from "encore.dev/api";
import { appMeta } from "encore.dev";
import { secret } from "encore.dev/config";
import { WebhookTopic } from "./topic";
import crypto from "node:crypto";
import Stripe from "stripe";

// Landing page with setup instructions and API documentation.
export const index = api.raw(
  { expose: true, method: "GET", path: "/" },
  async (req, resp) => {
    const baseUrl = appMeta().apiBaseUrl;
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

  <p>Explore and test endpoints in the <a href="http://localhost:9400/">Local Dashboard</a> when running locally. When deployed to <a href="https://app.encore.cloud">Encore Cloud</a>, use the Service Catalog to call endpoints and view traces to see how requests flow between services.</p>

  <h2>Setup</h2>
  <p>Optionally set webhook secrets for signature validation:</p>
  <pre><code>encore secret set --type dev,local,pr,prod WebhookSecretStripe
encore secret set --type dev,local,pr,prod WebhookSecretGitHub</code></pre>
  <p>The Postgres database is provisioned automatically when you run <code>encore run</code>. No manual database setup required.</p>

  <h2>Signature Validation</h2>
  <p>When secrets are configured, incoming webhooks are verified using the official SDKs:</p>
  <p><strong>Stripe</strong> — Uses the <a href="https://www.npmjs.com/package/stripe">Stripe Node SDK</a> (<code>stripe.webhooks.constructEvent</code>) to verify the <code>Stripe-Signature</code> header. Stripe signs payloads using a timestamp and HMAC-SHA256 signature in the format <code>t=...,v1=...</code>.</p>
  <p><strong>GitHub</strong> — Uses HMAC-SHA256 with <code>crypto.timingSafeEqual</code> to verify the <code>X-Hub-Signature-256</code> header. GitHub signs payloads with HMAC-SHA256, prefixed with <code>sha256=</code>.</p>
  <p>Without secrets configured, all webhooks are accepted without signature checks.</p>

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
  -d '{"type": "payment_intent.succeeded", "data": {"object": {"amount": 2000}}}'</code></pre>

  <pre><code># GitHub webhook example
curl -X POST {{baseUrl}}/webhooks/github \\
  -H "Content-Type: application/json" \\
  -H "X-GitHub-Event: push" \\
  -d '{"ref": "refs/heads/main"}'</code></pre>

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

  <h3>Notifications</h3>

  <div class="endpoint">
    <span class="method get">GET</span>
    <span class="path">/notifications</span>
    <code>notifications.list</code>
  </div>
  <p class="desc">List recent important notifications (payment events, releases, etc.).</p>
  <pre><code>curl {{baseUrl}}/notifications</code></pre>

  <div class="endpoint">
    <span class="method get">GET</span>
    <span class="path">/notifications/stats</span>
    <code>notifications.stats</code>
  </div>
  <p class="desc">Get notification counts grouped by event type.</p>
  <pre><code>curl {{baseUrl}}/notifications/stats</code></pre>

</body>
</html>`;

const stripeSecret = secret("WebhookSecretStripe");
const githubSecret = secret("WebhookSecretGitHub");

const stripe = new Stripe("unused"); // API key not needed for webhook signature verification.

// Receive incoming webhooks and queue them for async processing.
// Uses a raw endpoint to access the full HTTP request for signature validation.
export const receive = api.raw(
  { expose: true, method: "POST", path: "/webhooks/:source" },
  async (req, resp) => {
    const source = req.url?.replace("/webhooks/", "") ?? "";

    // Read the raw request body.
    const body = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      req.on("data", (chunk: Buffer) => chunks.push(chunk));
      req.on("end", () => resolve(Buffer.concat(chunks)));
      req.on("error", reject);
    });

    // Validate signature if a secret is configured for this source.
    const webhookSecret = getSecretForSource(source);
    if (webhookSecret) {
      let valid = false;
      switch (source) {
        case "github":
          valid = verifyGitHubSignature(
            req.headers["x-hub-signature-256"] as string,
            body,
            webhookSecret,
          );
          break;
        case "stripe":
          try {
            stripe.webhooks.constructEvent(
              body,
              req.headers["stripe-signature"] as string,
              webhookSecret,
            );
            valid = true;
          } catch {
            valid = false;
          }
          break;
        default:
          valid = true;
      }

      if (!valid) {
        resp.writeHead(401, { "Content-Type": "application/json" });
        resp.end(JSON.stringify({ status: "invalid signature" }));
        return;
      }
    }

    // Parse body to store as structured data.
    const bodyStr = body.toString("utf-8");
    let payload: Record<string, unknown> = {};
    try {
      payload = JSON.parse(bodyStr);
    } catch {
      payload = { raw: bodyStr };
    }

    // Extract event type from payload or headers.
    const eventType = extractEventType(source, req.headers, payload);

    await WebhookTopic.publish({
      source,
      event_type: eventType,
      payload,
      received_at: new Date().toISOString(),
    });

    resp.writeHead(200, { "Content-Type": "application/json" });
    resp.end(JSON.stringify({ status: "accepted" }));
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
  headers: Record<string, string | string[] | undefined>,
  payload: Record<string, unknown>,
): string {
  // GitHub sends the event type in a header.
  if (source === "github") {
    const gh = headers["x-github-event"];
    if (typeof gh === "string") return gh;
  }

  // Stripe includes the type in the payload.
  if (source === "stripe" && typeof payload.type === "string") {
    return payload.type;
  }

  // Generic fallback.
  if (typeof payload.event === "string") return payload.event;
  if (typeof payload.event_type === "string") return payload.event_type;
  return "unknown";
}

// Verify a GitHub webhook signature.
// GitHub sends the HMAC-SHA256 signature in the X-Hub-Signature-256 header
// as "sha256=<hex-digest>".
function verifyGitHubSignature(
  signature: string | undefined,
  body: Buffer,
  secret: string,
): boolean {
  if (!signature) return false;
  const sig = signature.replace("sha256=", "");
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}
