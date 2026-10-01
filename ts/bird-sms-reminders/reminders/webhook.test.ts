import { createHmac, randomBytes } from "node:crypto";
import { BirdClient, BirdWebhookVerificationError } from "@messagebird/sdk";
import { describe, expect, test } from "vitest";

function signedWebhook(body: string) {
  const id = "msg_01test";
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const key = randomBytes(32);
  const secret = `whsec_${key.toString("base64")}`;
  const signature = createHmac("sha256", key)
    .update(`${id}.${timestamp}.${body}`)
    .digest("base64");
  return {
    secret,
    headers: {
      "webhook-id": id,
      "webhook-timestamp": timestamp,
      "webhook-signature": `v1,${signature}`,
    },
  };
}

describe("Bird webhook verification", () => {
  test("verifies the raw body and narrows an SMS delivery event", () => {
    const body = JSON.stringify({
      type: "sms.delivered",
      timestamp: "2026-09-28T12:00:00Z",
      data: {
        sms_id: "sms_01test",
        workspace_id: "ws_01test",
        to: "+15005550006",
        from: "+15557654321",
        tags: null,
        metadata: { reminder_id: "reminder-1" },
        requested_language: null,
        resolved_language: null,
        template_id: null,
        template_version_id: null,
        template_content_hash: null,
      },
    });
    const { secret, headers } = signedWebhook(body);
    const event = new BirdClient({ webhooks: { secret } }).webhooks.unwrap(body, headers);

    expect(event.type).toBe("sms.delivered");
    if (event.type === "sms.delivered") {
      expect(event.data.sms_id).toBe("sms_01test");
      expect(event.data.metadata?.reminder_id).toBe("reminder-1");
    }
  });

  test("rejects a body changed after it was signed", () => {
    const body = JSON.stringify({ type: "sms.delivered", timestamp: "2026-09-28T12:00:00Z", data: {} });
    const { secret, headers } = signedWebhook(body);
    const bird = new BirdClient({ webhooks: { secret } });

    expect(() => bird.webhooks.unwrap(`${body} `, headers)).toThrow(BirdWebhookVerificationError);
  });
});
