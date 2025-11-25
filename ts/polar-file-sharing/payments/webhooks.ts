import { api } from "encore.dev/api";
import { db } from "./db";
import { db as authDb } from "../auth/db";
import { user } from "../auth/schema";
import { eq } from "drizzle-orm";
import log from "encore.dev/log";

interface PolarWebhookEvent {
  type: string;
  data: {
    object: {
      id: string;
      customer_id: string;
      product_id: string;
      status: string;
      current_period_start?: string;
      current_period_end?: string;
      cancel_at_period_end?: boolean;
      customer?: {
        id: string;
        email: string;
        name?: string;
      };
    };
  };
}

export const handleWebhook = api.raw(
  { expose: true, path: "/webhooks/polar", method: "POST" },
  async (req, res) => {
    // Read request body
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const bodyText = Buffer.concat(chunks).toString();
    const event = JSON.parse(bodyText) as PolarWebhookEvent;

    log.info("Received Polar webhook", { type: event.type });

    switch (event.type) {
      case "subscription.created":
      case "subscription.updated":
        await syncSubscription(event.data.object);
        break;

      case "subscription.canceled":
        await cancelSubscription(event.data.object.id);
        break;

      case "customer.created":
      case "customer.updated":
        await syncCustomer(event.data.object.customer);
        break;
    }

    res.writeHead(200);
    res.end();
  }
);

async function syncSubscription(subscription: any) {
  // Ensure customer exists
  if (subscription.customer) {
    await syncCustomer(subscription.customer);
  }

  // Parse timestamps
  const periodStart = subscription.current_period_start 
    ? new Date(subscription.current_period_start) 
    : null;
  const periodEnd = subscription.current_period_end 
    ? new Date(subscription.current_period_end) 
    : null;

  // Upsert subscription
  await db.exec`
    INSERT INTO subscriptions (
      subscription_id, customer_id, product_id, status,
      current_period_start, current_period_end, cancel_at_period_end, updated_at
    )
    VALUES (
      ${subscription.id},
      ${subscription.customer_id},
      ${subscription.product_id},
      ${subscription.status},
      ${periodStart},
      ${periodEnd},
      ${subscription.cancel_at_period_end || false},
      NOW()
    )
    ON CONFLICT (subscription_id)
    DO UPDATE SET
      status = ${subscription.status},
      current_period_start = ${periodStart},
      current_period_end = ${periodEnd},
      cancel_at_period_end = ${subscription.cancel_at_period_end || false},
      updated_at = NOW()
  `;

  log.info("Synced subscription", { subscriptionId: subscription.id });
}

async function syncCustomer(customer: any) {
  if (!customer) return;

  // Look up user by email in auth database
  const userRows = await authDb
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, customer.email))
    .limit(1);

  const userId = userRows[0]?.id || null;

  if (userId) {
    log.info("Linking Polar customer to user", { customerId: customer.id, userId, email: customer.email });
  } else {
    log.warn("No user found for Polar customer email", { customerId: customer.id, email: customer.email });
  }

  await db.exec`
    INSERT INTO customers (customer_id, email, name, user_id, updated_at)
    VALUES (${customer.id}, ${customer.email}, ${customer.name}, ${userId}, NOW())
    ON CONFLICT (customer_id)
    DO UPDATE SET
      email = ${customer.email},
      name = ${customer.name},
      user_id = ${userId},
      updated_at = NOW()
  `;
}

async function cancelSubscription(subscriptionId: string) {
  await db.exec`
    UPDATE subscriptions
    SET status = 'canceled', updated_at = NOW()
    WHERE subscription_id = ${subscriptionId}
  `;

  log.info("Canceled subscription", { subscriptionId });
}

