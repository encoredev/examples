import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { autumn } from "./autumn";

// ------------------------------------------------------------------
// Cancel Subscription
// ------------------------------------------------------------------

interface CancelRequest {
  productId: string;
  cancelImmediately?: boolean;
}

interface CancelResponse {
  success: boolean;
}

// Cancels a subscription. By default, cancellation is scheduled for the end
// of the billing cycle. Pass cancelImmediately: true to cancel right away.
export const cancelSubscription = api(
  { expose: true, method: "POST", path: "/billing/cancel", auth: true },
  async (req: CancelRequest): Promise<CancelResponse> => {
    const auth = getAuthData()!;

    const { error } = await autumn.cancel({
      customer_id: auth.userId,
      product_id: req.productId,
      cancel_immediately: req.cancelImmediately ?? false,
    });

    if (error) {
      throw APIError.internal(`Cancel failed: ${error.message}`);
    }

    return { success: true };
  }
);

