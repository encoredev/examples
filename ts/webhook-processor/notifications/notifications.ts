import { api } from "encore.dev/api";
import { Subscription } from "encore.dev/pubsub";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { WebhookTopic } from "../ingest/topic";
import log from "encore.dev/log";

const db = new SQLDatabase("notifications", {
  migrations: "./migrations",
});

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
      return;
    }

    log.info("important webhook event", {
      source: event.source,
      type: event.event_type,
    });

    await db.exec`
      INSERT INTO notifications (source, event_type, payload)
      VALUES (${event.source}, ${event.event_type}, ${JSON.stringify(event.payload)})
    `;
  },
});

interface Notification {
  id: number;
  source: string;
  event_type: string;
  payload: Record<string, unknown>;
  created_at: string;
}

// List recent important notifications.
export const list = api(
  { expose: true, auth: false, method: "GET", path: "/notifications" },
  async (): Promise<{ notifications: Notification[] }> => {
    const rows = db.query<Notification>`
      SELECT id, source, event_type, payload, created_at
      FROM notifications
      ORDER BY created_at DESC
      LIMIT 50
    `;
    const notifications: Notification[] = [];
    for await (const row of rows) {
      notifications.push(row);
    }
    return { notifications };
  },
);

interface StatEntry {
  event_type: string;
  count: number;
}

// Get notification counts grouped by event type.
export const stats = api(
  { expose: true, auth: false, method: "GET", path: "/notifications/stats" },
  async (): Promise<{ stats: StatEntry[] }> => {
    const rows = db.query<StatEntry>`
      SELECT event_type, COUNT(*)::int AS count
      FROM notifications
      GROUP BY event_type
      ORDER BY count DESC
    `;
    const stats: StatEntry[] = [];
    for await (const row of rows) {
      stats.push(row);
    }
    return { stats };
  },
);
