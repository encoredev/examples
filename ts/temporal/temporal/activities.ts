// temporal/activities.ts
import log from "encore.dev/log";
import { orders } from "~encore/clients";

export interface OrderInput {
  orderId: string;
  userId: string;
  items: { productId: string; quantity: number }[];
  totalAmount: number;
}

// Activities are regular async functions that can perform I/O.
// They can call other Encore services, query databases, make HTTP requests.
// Temporal retries them automatically based on the retry policy.

export async function createOrder(order: OrderInput): Promise<void> {
  // Calls the orders service to persist the order in the database.
  await orders.create({
    orderId: order.orderId,
    userId: order.userId,
    totalAmount: order.totalAmount,
    items: order.items,
  });
  log.info("order created in database", { orderId: order.orderId });
}

export async function checkInventory(order: OrderInput): Promise<boolean> {
  log.info("checking inventory", { orderId: order.orderId });
  // In production, this would query an inventory service or database.
  // Return false for product "out-of-stock" to test the failure path.
  if (order.items.some((i) => i.productId === "out-of-stock")) {
    return false;
  }
  return true;
}

export async function processPayment(order: OrderInput): Promise<string> {
  log.info("processing payment", {
    orderId: order.orderId,
    amount: order.totalAmount,
  });
  // In production, this would call Stripe or another payment provider.
  const paymentId = `pay_${order.orderId}_${Date.now()}`;
  await orders.updateStatus({ orderId: order.orderId, status: "paid", paymentId });
  return paymentId;
}

export async function shipOrder(order: OrderInput): Promise<string> {
  log.info("shipping order", { orderId: order.orderId });
  // In production, this would call a shipping provider.
  // Use product "fail-shipping" to test the saga refund path.
  if (order.items.some((i) => i.productId === "fail-shipping")) {
    throw new Error("Shipping provider unavailable");
  }
  const trackingId = `track_${order.orderId}`;
  await orders.updateStatus({ orderId: order.orderId, status: "shipped", trackingId });
  return trackingId;
}

export async function sendConfirmationEmail(
  order: OrderInput,
  trackingId: string
): Promise<void> {
  log.info("sending confirmation email", {
    orderId: order.orderId,
    trackingId,
  });
  // In production, this would call Resend, SendGrid, etc.
  await orders.updateStatus({ orderId: order.orderId, status: "completed" });
}

export async function refundPayment(paymentId: string): Promise<void> {
  log.info("refunding payment", { paymentId });
  // Compensation action for saga pattern.
  // In production, this would call the payment provider's refund API.
}
