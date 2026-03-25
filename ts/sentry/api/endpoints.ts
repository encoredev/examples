import { api, APIError } from "encore.dev/api";
import { Sentry, withSentry } from "../lib/sentry";

// Simple health check — no Sentry wrapper needed.
export const health = api(
  { expose: true, method: "GET", path: "/health" },
  async (): Promise<{ ok: boolean }> => {
    return { ok: true };
  }
);

interface ProcessRequest {
  itemId: string;
  quantity: number;
}

interface ProcessResponse {
  status: string;
  itemId: string;
}

// Wrapped with withSentry — errors are captured and reported
// with the endpoint name and request data as context.
export const process = api(
  { expose: true, method: "POST", path: "/process" },
  withSentry("process", async (req: ProcessRequest): Promise<ProcessResponse> => {
    // Add a breadcrumb to see the event timeline in Sentry
    Sentry.addBreadcrumb({
      category: "business-logic",
      message: `Processing ${req.quantity}x ${req.itemId}`,
      level: "info",
    });

    // Simulate processing
    if (req.quantity <= 0) {
      throw APIError.invalidArgument("quantity must be positive");
    }

    return { status: "processed", itemId: req.itemId };
  })
);

// Intentionally throws an error so you can verify Sentry is capturing it.
export const errorTest = api(
  { expose: true, method: "GET", path: "/error-test" },
  withSentry("errorTest", async (): Promise<never> => {
    throw new Error("This is a test error for Sentry");
  })
);
