// temporal/workflows.ts
//
// Workflows run in a deterministic, sandboxed V8 isolate.
// They CANNOT do I/O directly - no HTTP, no DB, no console.log.
// All side effects go through activities via proxyActivities.

import { proxyActivities } from "@temporalio/workflow";
import type * as activities from "./activities";

// proxyActivities creates stubs that schedule activities on the worker.
// startToCloseTimeout = max time for a single activity attempt.
const {
  createOrder,
  checkInventory,
  processPayment,
  shipOrder,
  sendConfirmationEmail,
  refundPayment,
} = proxyActivities<typeof activities>({
  startToCloseTimeout: "30s",
  retry: {
    maximumAttempts: 3,
    backoffCoefficient: 2,
  },
});

export interface OrderResult {
  orderId: string;
  status: "completed" | "failed";
  paymentId?: string;
  trackingId?: string;
  error?: string;
}

export async function orderProcessingWorkflow(
  order: activities.OrderInput
): Promise<OrderResult> {
  // Step 1: Persist order in the database via the orders service
  await createOrder(order);

  // Step 2: Check inventory
  const inStock = await checkInventory(order);
  if (!inStock) {
    return { orderId: order.orderId, status: "failed", error: "Items out of stock" };
  }

  // Step 3: Process payment
  let paymentId: string;
  try {
    paymentId = await processPayment(order);
  } catch (err) {
    return { orderId: order.orderId, status: "failed", error: "Payment failed" };
  }

  // Step 4: Ship order. If this fails, refund the payment (saga pattern).
  let trackingId: string;
  try {
    trackingId = await shipOrder(order);
  } catch (err) {
    await refundPayment(paymentId);
    return {
      orderId: order.orderId,
      status: "failed",
      paymentId,
      error: "Shipping failed, payment refunded",
    };
  }

  // Step 5: Send confirmation (best-effort)
  try {
    await sendConfirmationEmail(order, trackingId);
  } catch {
    // The order shipped successfully, don't fail over an email
  }

  return { orderId: order.orderId, status: "completed", paymentId, trackingId };
}
