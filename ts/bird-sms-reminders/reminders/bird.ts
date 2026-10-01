import { BirdClient } from "@messagebird/sdk";
import { secret } from "encore.dev/config";
import type { ReminderRecord } from "./model";
import { birdIdempotencyKey, buildSmsRequest } from "./model";

const birdAPIKey = secret("BirdAPIKey");
const birdSMSSender = secret("BirdSMSSender");
const birdWebhookSecret = secret("BirdWebhookSecret");

// Secrets are left empty in local development until they're set, so check
// before calling Bird instead of failing every send with an SDK error.
export function missingBirdSecrets(): string[] {
  const missing: string[] = [];
  if (!birdAPIKey()) missing.push("BirdAPIKey");
  if (!birdSMSSender()) missing.push("BirdSMSSender");
  return missing;
}

export async function sendReminder(reminder: ReminderRecord): Promise<string> {
  const bird = new BirdClient({ apiKey: birdAPIKey() });
  const message = await bird.sms.send(
    buildSmsRequest(reminder, birdSMSSender()),
    { idempotencyKey: birdIdempotencyKey(reminder.id) },
  );
  return message.id;
}

export function birdWebhookClient(): BirdClient {
  return new BirdClient({ webhooks: { secret: birdWebhookSecret() } });
}
