import log from "@encore.dev/sdk/log";
import { Subscription, Topic } from "@encore.dev/sdk/pubsub";
import { Database } from "@encore.dev/sdk/storage/postgres";

// db holds the events and notifications. Encore provisions it and applies
// ./migrations before the service starts.
const db = new Database("{{ident}}", { migrations: "./migrations" });

/** A webhook received, as it is published. */
export interface WebhookEvent {
  source: string;
  event_type: string;
  payload: Record<string, unknown>;
  received_at: string;
}

// webhooks carries each webhook received. Each of its subscriptions gets
// every message, and handles it independently of the others.
export const webhooks = new Topic<WebhookEvent>("{{kebab}}-webhook-received", {
  deliveryGuarantee: "at-least-once",
});

// Store every event.
new Subscription(webhooks, "process-events", {
  handler: async (msg) => {
    const event = JSON.parse(msg.data.toString("utf-8")) as WebhookEvent;
    log.info("processing webhook", { source: event.source, type: event.event_type });
    await db.exec`
      INSERT INTO webhook_events (source, event_type, payload, received_at)
      VALUES (${event.source}, ${event.event_type}, ${event.payload}, ${new Date(event.received_at)})
    `;
  },
});

// The event types kept as notifications.
const importantEvents = new Set([
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
  "customer.subscription.deleted",
  "invoice.payment_failed",
  "push",
  "pull_request",
  "release",
]);

// Keep the important events as notifications.
new Subscription(webhooks, "notify-important", {
  handler: async (msg) => {
    const event = JSON.parse(msg.data.toString("utf-8")) as WebhookEvent;
    if (!importantEvents.has(event.event_type)) return;
    log.info("important webhook event", { source: event.source, type: event.event_type });
    await db.exec`
      INSERT INTO notifications (source, event_type, payload)
      VALUES (${event.source}, ${event.event_type}, ${event.payload})
    `;
  },
});

/** A webhook event as it is stored. */
export interface StoredEvent {
  id: number;
  source: string;
  event_type: string;
  payload: Record<string, unknown>;
  status: string;
  received_at: Date;
  processed_at: Date;
}

/** The 50 most recent events. */
export function listEvents(): Promise<StoredEvent[]> {
  return db.queryAll<StoredEvent>`
    SELECT id, source, event_type, payload, status, received_at, processed_at
    FROM webhook_events
    ORDER BY received_at DESC
    LIMIT 50
  `;
}

/** One event, or null if there is none with the id. */
export function getEvent(id: number): Promise<StoredEvent | null> {
  return db.queryRow<StoredEvent>`
    SELECT id, source, event_type, payload, status, received_at, processed_at
    FROM webhook_events
    WHERE id = ${id}
  `;
}

/** An important event. */
export interface Notification {
  id: number;
  source: string;
  event_type: string;
  payload: Record<string, unknown>;
  created_at: Date;
}

/** The 50 most recent notifications. */
export function listNotifications(): Promise<Notification[]> {
  return db.queryAll<Notification>`
    SELECT id, source, event_type, payload, created_at
    FROM notifications
    ORDER BY created_at DESC
    LIMIT 50
  `;
}

/** How many notifications there are of an event type. */
export interface StatEntry {
  event_type: string;
  count: number;
}

/** The number of notifications of each event type, most first. */
export function notificationStats(): Promise<StatEntry[]> {
  return db.queryAll<StatEntry>`
    SELECT event_type, COUNT(*)::int AS count
    FROM notifications
    GROUP BY event_type
    ORDER BY count DESC
  `;
}
