import { api } from "encore.dev/api";
import log from "encore.dev/log";

// Handle incoming webhooks from Polar.
// Polar sends events when customers subscribe, pay, or cancel.
export const webhook = api.raw(
  { expose: true, method: "POST", path: "/webhook/polar" },
  async (req, res) => {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const event = JSON.parse(Buffer.concat(chunks).toString());

    log.info("Polar webhook received", { type: event.type });

    switch (event.type) {
      case "subscription.active":
        log.info("Subscription activated", {
          customerId: event.data.customerId,
        });
        // TODO: Grant access to your product
        break;
      case "subscription.canceled":
        log.info("Subscription canceled", {
          customerId: event.data.customerId,
        });
        // TODO: Revoke access
        break;
      case "order.paid":
        log.info("Order paid", { orderId: event.data.id });
        // TODO: Fulfill the order
        break;
    }

    res.writeHead(200);
    res.end();
  }
);
