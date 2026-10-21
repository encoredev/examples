import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { WebhookTopic } from "./topic";
import crypto from "node:crypto";
import Stripe from "stripe";

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
