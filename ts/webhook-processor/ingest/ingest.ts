import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { WebhookTopic } from "./topic";
import crypto from "node:crypto";

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
