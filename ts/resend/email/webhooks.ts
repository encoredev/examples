import { api } from "encore.dev/api";
import { db } from "./db";
import log from "encore.dev/log";

interface ResendWebhookEvent {
  type: string;
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    created_at: string;
  };
}

export const handleWebhook = api.raw(
  { expose: true, path: "/webhooks/resend", method: "POST" },
  async (req, res) => {
    const event = (await req.json()) as ResendWebhookEvent;

    log.info("Received Resend webhook", { type: event.type, emailId: event.data.email_id });

    switch (event.type) {
      case "email.sent":
        await db.exec`
          UPDATE emails
          SET status = 'sent'
          WHERE resend_id = ${event.data.email_id}
        `;
        break;

      case "email.delivered":
        await db.exec`
          UPDATE emails
          SET status = 'delivered', delivered_at = NOW()
          WHERE resend_id = ${event.data.email_id}
        `;
        break;

      case "email.opened":
        await db.exec`
          UPDATE emails
          SET opened_at = NOW()
          WHERE resend_id = ${event.data.email_id}
        `;
        break;

      case "email.clicked":
        await db.exec`
          UPDATE emails
          SET clicked_at = NOW()
          WHERE resend_id = ${event.data.email_id}
        `;
        break;

      case "email.bounced":
        await db.exec`
          UPDATE emails
          SET status = 'bounced', bounced_at = NOW()
          WHERE resend_id = ${event.data.email_id}
        `;
        break;

      case "email.complained":
        await db.exec`
          UPDATE emails
          SET status = 'complained', complained_at = NOW()
          WHERE resend_id = ${event.data.email_id}
        `;
        break;
    }

    res.writeHead(200);
    res.end();
  }
);

