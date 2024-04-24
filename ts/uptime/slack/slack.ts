import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import log from "encore.dev/log";
import { Subscription } from "encore.dev/pubsub";
import { TransitionTopic } from "../monitor/check";

export interface NotifyParams {
  text: string; // the slack message to send
}

// Sends a Slack message to a pre-configured channel using a
// Slack Incoming Webhook (see https://api.slack.com/messaging/webhooks).
export const notify = api<NotifyParams>({}, async ({ text }) => {
  const url = webhookURL();
  if (!url) {
    log.info("no slack webhook url defined, skipping slack notification");
    return;
  }

  const resp = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
  if (resp.status >= 400) {
    const body = await resp.text();
    throw new Error(`slack notification failed: ${resp.status}: ${body}`);
  }
});

// SlackWebhookURL defines the Slack webhook URL to send
// uptime notifications to.
const webhookURL = secret("SlackWebhookURL");

const _ = new Subscription(TransitionTopic, "slack-notification", {
  handler: async (event) => {
    const text = `*${event.site.url} is ${event.up ? "back up." : "down!"}*`;
    await notify({ text });
  },
});
