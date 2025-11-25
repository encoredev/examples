import { api } from "encore.dev/api";
import { db } from "./db";
import { getAuthData } from "~encore/auth";
import log from "encore.dev/log";

export interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  subscription?: {
    id: string;
    productId: string;
    status: string;
    currentPeriodEnd: Date;
  };
}

// Internal helper function to check subscription by user ID
export async function checkSubscriptionByUserId(userId: string): Promise<SubscriptionStatus> {
  log.info("Checking subscription for user", { userId });
  
  // Find customer by user_id
  const customer = await db.queryRow<{ customer_id: string }>`
    SELECT customer_id
    FROM customers
    WHERE user_id = ${userId}
    LIMIT 1
  `;

  if (!customer) {
    log.info("No customer found for user", { userId });
    return { hasActiveSubscription: false };
  }

  // Check for active subscription
  const subscription = await db.queryRow<{
    subscription_id: string;
    product_id: string;
    status: string;
    current_period_end: Date;
  }>`
    SELECT subscription_id, product_id, status, current_period_end
    FROM subscriptions
    WHERE customer_id = ${customer.customer_id}
      AND status = 'active'
      AND (current_period_end IS NULL OR current_period_end > NOW())
    ORDER BY created_at DESC
    LIMIT 1
  `;

  if (!subscription) {
    log.info("No active subscription found for user", { userId });
    return { hasActiveSubscription: false };
  }

  log.info("Active subscription found", { 
    userId, 
    subscriptionId: subscription.subscription_id 
  });

  return {
    hasActiveSubscription: true,
    subscription: {
      id: subscription.subscription_id,
      productId: subscription.product_id,
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end,
    },
  };
}

// API endpoint for frontend to check subscription status
export const checkSubscription = api(
  { auth: true, expose: true, method: "GET", path: "/subscriptions/me" },
  async (): Promise<SubscriptionStatus> => {
    const authData = getAuthData()!;
    return checkSubscriptionByUserId(authData.userID);
  }
);
