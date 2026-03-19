import { api, APIError } from "encore.dev/api";
import { Subscription } from "encore.dev/pubsub";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { WebhookTopic } from "../ingest/topic";
import log from "encore.dev/log";

const db = new SQLDatabase("processor", {
  migrations: "./migrations",
});

// Subscribe to the webhook topic and store processed events.
const _ = new Subscription(WebhookTopic, "process-events", {
  handler: async (event) => {
    log.info("processing webhook", { source: event.source, type: event.event_type });

    await db.exec`
      INSERT INTO webhook_events (source, event_type, payload, received_at)
      VALUES (${event.source}, ${event.event_type}, ${JSON.stringify(event.payload)}, ${event.received_at})
    `;
  },
});

interface StoredEvent {
  id: number;
  source: string;
  event_type: string;
  payload: Record<string, unknown>;
  status: string;
  received_at: string;
  processed_at: string;
}

// List the 50 most recent processed webhook events.
export const list = api(
  { expose: true, auth: false, method: "GET", path: "/webhooks/events" },
  async (): Promise<{ events: StoredEvent[] }> => {
    const rows = db.query<StoredEvent>`
      SELECT id, source, event_type, payload, status, received_at, processed_at
      FROM webhook_events
      ORDER BY received_at DESC
      LIMIT 50
    `;
    const events: StoredEvent[] = [];
    for await (const row of rows) {
      events.push(row);
    }
    return { events };
  },
);

// Get a specific processed webhook event by ID.
export const get = api(
  { expose: true, auth: false, method: "GET", path: "/webhooks/events/:id" },
  async ({ id }: { id: number }): Promise<StoredEvent> => {
    const row = await db.queryRow<StoredEvent>`
      SELECT id, source, event_type, payload, status, received_at, processed_at
      FROM webhook_events
      WHERE id = ${id}
    `;
    if (!row) throw APIError.notFound("event not found");
    return row;
  },
);
