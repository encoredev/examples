// temporal/endpoints.ts
import { api } from "encore.dev/api";
import { getClient } from "./client";
import type { OrderInput } from "./activities";
import type { OrderResult } from "./workflows";

interface CreateOrderRequest {
  userId: string;
  items: { productId: string; quantity: number }[];
  totalAmount: number;
}

// Starts the workflow and waits for it to complete.
// Good for short workflows where the caller can wait.
export const createOrder = api(
  { expose: true, method: "POST", path: "/orders" },
  async (req: CreateOrderRequest): Promise<OrderResult> => {
    const orderId = `order_${Date.now()}`;
    const order: OrderInput = { orderId, ...req };

    const handle = await getClient().workflow.start("orderProcessingWorkflow", {
      args: [order],
      taskQueue: "orders",
      workflowId: orderId,
    });

    return handle.result();
  }
);

// Fire-and-forget: starts the workflow and returns the workflow ID
// immediately. Use getOrderStatus to poll for results.
export const startOrder = api(
  { expose: true, method: "POST", path: "/orders/async" },
  async (
    req: CreateOrderRequest
  ): Promise<{ orderId: string; workflowId: string }> => {
    const orderId = `order_${Date.now()}`;
    const order: OrderInput = { orderId, ...req };

    const handle = await getClient().workflow.start("orderProcessingWorkflow", {
      args: [order],
      taskQueue: "orders",
      workflowId: orderId,
    });

    return { orderId, workflowId: handle.workflowId };
  }
);

interface OrderStatusResponse {
  workflowId: string;
  status: string;
  result?: OrderResult;
}

// Query a workflow's current status by its ID.
export const getOrderStatus = api(
  { expose: true, method: "GET", path: "/orders/:workflowId" },
  async (p: { workflowId: string }): Promise<OrderStatusResponse> => {
    const handle = getClient().workflow.getHandle(p.workflowId);
    const description = await handle.describe();

    let result: OrderResult | undefined;
    if (description.status.name === "COMPLETED") {
      result = await handle.result();
    }

    return {
      workflowId: p.workflowId,
      status: description.status.name,
      result,
    };
  }
);
