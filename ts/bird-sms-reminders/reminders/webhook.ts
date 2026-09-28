import { api } from "encore.dev/api";
import { BirdWebhookVerificationError } from "@messagebird/sdk";
import { birdWebhookClient } from "./bird";
import { db } from "./db";

export const birdWebhook = api.raw(
  { expose: true, method: "POST", path: "/webhooks/bird" },
  async (req, resp) => {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(Buffer.from(chunk));
    const rawBody = Buffer.concat(chunks).toString("utf8");

    const headers: Record<string, string> = {};
    for (const [name, value] of Object.entries(req.headers)) {
      if (typeof value === "string") headers[name] = value;
      else if (value) headers[name] = value.join(",");
    }

    try {
      const event = birdWebhookClient().webhooks.unwrap(rawBody, headers);
      const webhookID = headers["webhook-id"];
      const smsID = "sms_id" in event.data ? String(event.data.sms_id) : null;

      const inserted = await db.queryRow<{ webhook_id: string }>`
        INSERT INTO delivery_events
          (webhook_id, bird_message_id, event_type, occurred_at, payload)
        VALUES
          (${webhookID}, ${smsID}, ${event.type}, ${new Date(event.timestamp)}, ${event})
        ON CONFLICT (webhook_id) DO NOTHING
        RETURNING webhook_id
      `;

      resp.writeHead(inserted ? 202 : 200, { "Content-Type": "application/json" });
      resp.end(JSON.stringify({ accepted: true, duplicate: !inserted }));
    } catch (error) {
      if (error instanceof BirdWebhookVerificationError) {
        resp.writeHead(400, { "Content-Type": "application/json" });
        resp.end(JSON.stringify({ accepted: false, error: "invalid webhook signature" }));
        return;
      }
      throw error;
    }
  },
);
