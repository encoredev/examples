import { api } from "encore.dev/api";
import { db } from "./db";
import log from "encore.dev/log";

interface InboundWebhookPayload {
  id: string;
  from: string;
  to: string[];
  subject: string;
  text?: string;
  html?: string;
  date: string;
  threadId?: string;
  inReplyTo?: string;
}

// Receives incoming emails from Inbound via webhook.
export const inboundWebhook = api.raw(
  { expose: true, method: "POST", path: "/email/webhook" },
  async (req, res) => {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const body = Buffer.concat(chunks).toString();
    const payload: InboundWebhookPayload = JSON.parse(body);

    log.info("Received email", {
      id: payload.id,
      from: payload.from,
      subject: payload.subject,
    });

    // Store the email in the database
    await db.exec`
      INSERT INTO emails (id, sender, recipient, subject, body_text, body_html, received_at, thread_id)
      VALUES (
        ${payload.id},
        ${payload.from},
        ${payload.to[0]},
        ${payload.subject},
        ${payload.text ?? null},
        ${payload.html ?? null},
        ${new Date(payload.date)},
        ${payload.threadId ?? null}
      )
    `;

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ received: true }));
  }
);

