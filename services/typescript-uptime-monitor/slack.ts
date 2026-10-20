import { secret } from "@encore.dev/sdk/config";
import log from "@encore.dev/sdk/log";
import { Subscription } from "@encore.dev/sdk/pubsub";
import { transitions, type TransitionEvent } from "./check";

// The Slack incoming webhook to post notifications to
// (https://api.slack.com/messaging/webhooks). While it is not set,
// notifications are logged and skipped.
const slackWebhookURL = secret("SlackWebhookURL");

function webhookURL(): string {
  try {
    return slackWebhookURL();
  } catch {
    // Outside local development, reading a secret that is not set throws.
    return "";
  }
}

// Each transition is posted to Slack.
const _ = new Subscription(transitions, "slack-notification", {
  handler: async (msg) => {
    const event = JSON.parse(msg.data.toString()) as TransitionEvent;
    const text = `*${event.site.url} is ${event.up ? "back up." : "down!"}*`;

    const url = webhookURL();
    if (!url) {
      log.info("SlackWebhookURL is not set, skipping the Slack notification", { text });
      return;
    }

    let resp: Response;
    try {
      resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
    } catch {
      // Not the error itself: it can quote the webhook URL, which is a secret.
      throw new Error("notify slack: the request to the webhook failed");
    }
    if (!resp.ok) {
      throw new Error(`notify slack: ${resp.status}: ${await resp.text()}`);
    }
    log.info("notified slack", { text });
  },
});
