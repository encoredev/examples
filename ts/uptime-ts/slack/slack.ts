import { api } from "encore.dev/api";
import { Subscription } from "encore.dev/pubsub";
import { TransitionTopic } from "../monitor/check";
import { secret } from "encore.dev/config";

export interface NotifyParams {
  text: string; // the slack message to send
}

export const notify = api<NotifyParams>({}, async ({ text }) => {
  const url = webhookURL();
  if (!url) {
    console.log("no slack webhook url defined, skipping slack notification");
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

const webhookURL = secret("SlackWebhookURL");

const _ = new Subscription(TransitionTopic, "slack-notification", {
  handler: async (event) => {
    const text = `*${event.site.url} is ${event.up ? "back up." : "down!"}*`;
    await notify({ text });
  },
});
