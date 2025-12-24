import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { autumn } from "./autumn";
import log from "encore.dev/log";

// ------------------------------------------------------------------
// Track Usage
// ------------------------------------------------------------------

interface TrackUsageRequest {
  featureId: string;
  value?: number;
}

interface TrackUsageResponse {
  success: boolean;
}

// Tracks usage of a feature for the authenticated customer.
// This decrements the customer's feature balance.
export const trackUsage = api(
  { expose: true, method: "POST", path: "/billing/usage", auth: true },
  async (req: TrackUsageRequest): Promise<TrackUsageResponse> => {
    const auth = getAuthData()!;

    const { error } = await autumn.track({
      customer_id: auth.userId,
      feature_id: req.featureId,
      value: req.value ?? 1,
    });

    if (error) {
      throw APIError.internal(`Failed to track usage: ${error.message}`);
    }

    log.info("Usage tracked", {
      customerId: auth.userId,
      featureId: req.featureId,
      value: req.value ?? 1,
    });

    return { success: true };
  }
);

