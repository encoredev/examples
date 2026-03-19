import { Subscription } from "encore.dev/pubsub";
import { WebhookTopic } from "../ingest/topic";
import log from "encore.dev/log";

// Important event types that should trigger notifications.
const IMPORTANT_EVENTS = new Set([
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
  "customer.subscription.deleted",
  "invoice.payment_failed",
  "push",
  "pull_request",
  "release",
]);

// Second subscriber on the same topic — demonstrates fan-out pattern.
// Both the processor and notifications services receive every event independently.
const _ = new Subscription(WebhookTopic, "notify-important", {
  handler: async (event) => {
    if (!IMPORTANT_EVENTS.has(event.event_type)) {
      return; // Skip non-important events.
    }

    log.info("important webhook event", {
      source: event.source,
      type: event.event_type,
      received_at: event.received_at,
    });

    // In a real app, this could send a Slack message, email, or push notification.
  },
});
