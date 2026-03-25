// temporal/activities.ts
import log from "encore.dev/log";

export interface OrderInput {
  orderId: string;
  userId: string;
  items: { productId: string; quantity: number }[];
  totalAmount: number;
}

// Activities are regular async functions that can perform I/O.
// Temporal retries them automatically based on the retry policy
// configured in the workflow via proxyActivities.

export async function checkInventory(order: OrderInput): Promise<boolean> {
  log.info("checking inventory", { orderId: order.orderId });
  // Replace with real inventory check - e.g. query a database or call
  // another Encore service.
  await new Promise((r) => setTimeout(r, 200));
  return true;
}

export async function processPayment(order: OrderInput): Promise<string> {
  log.info("processing payment", {
    orderId: order.orderId,
    amount: order.totalAmount,
  });
  // Replace with real payment provider call (Stripe, etc.)
  await new Promise((r) => setTimeout(r, 500));
  return `pay_${order.orderId}_${Date.now()}`;
}

export async function shipOrder(order: OrderInput): Promise<string> {
  log.info("shipping order", { orderId: order.orderId });
  // Replace with real shipping provider call
  await new Promise((r) => setTimeout(r, 300));
  return `track_${order.orderId}`;
}

export async function sendConfirmationEmail(
  order: OrderInput,
  trackingId: string
): Promise<void> {
  log.info("sending confirmation email", {
    orderId: order.orderId,
    userId: order.userId,
    trackingId,
  });
  // Replace with real email provider (SendGrid, Resend, etc.)
  await new Promise((r) => setTimeout(r, 100));
}

export async function refundPayment(paymentId: string): Promise<void> {
  log.info("refunding payment", { paymentId });
  // Compensation action - called when a later step fails (saga pattern)
  await new Promise((r) => setTimeout(r, 300));
}
