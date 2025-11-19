import { api } from "encore.dev/api";
import { db } from "../user/db";
import log from "encore.dev/log";

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses?: Array<{ email_address: string }>;
    first_name?: string;
    last_name?: string;
  };
}

export const handleWebhook = api.raw(
  { expose: true, path: "/webhooks/clerk", method: "POST" },
  async (req, res) => {
    const body = await req.json();
    const event = body as ClerkWebhookEvent;

    switch (event.type) {
      case "user.created":
        log.info("User created", {
          userId: event.data.id,
          email: event.data.email_addresses?.[0]?.email_address,
        });
        
        // Create user profile with defaults
        await db.exec`
          INSERT INTO user_profile (clerk_user_id, theme, notifications)
          VALUES (${event.data.id}, 'light', true)
        `;
        break;

      case "user.updated":
        log.info("User updated", { userId: event.data.id });
        break;

      case "user.deleted":
        log.info("User deleted", { userId: event.data.id });
        
        // Clean up user data
        await db.exec`
          DELETE FROM user_profile
          WHERE clerk_user_id = ${event.data.id}
        `;
        break;
    }

    res.writeHead(200);
    res.end();
  }
);

