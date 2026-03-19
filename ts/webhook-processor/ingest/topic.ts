import { Topic } from "encore.dev/pubsub";

export interface WebhookEvent {
  source: string;
  event_type: string;
  payload: Record<string, unknown>;
  received_at: string;
}

// Topic for incoming webhook events. Multiple services can subscribe
// to process events independently (fan-out pattern).
export const WebhookTopic = new Topic<WebhookEvent>("webhook-received", {
  deliveryGuarantee: "at-least-once",
});
