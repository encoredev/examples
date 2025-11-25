import { api } from "encore.dev/api";
import { polar } from "./polar";
import { getAuthData } from "~encore/auth";
import { db } from "./db";
import log from "encore.dev/log";

interface CreateCheckoutRequest {
  productPriceId: string;
}

interface CreateCheckoutResponse {
  checkoutUrl: string;
}

export const createCheckout = api(
  { auth: true, expose: true, method: "POST", path: "/checkout" },
  async (req: CreateCheckoutRequest): Promise<CreateCheckoutResponse> => {
    const authData = getAuthData()!;
    const baseUrl = process.env.ENCORE_API_URL || "http://localhost:4000";

    try {
      // Create a checkout session using the Polar SDK
      const session = await polar.checkouts.create({
        productPriceId: req.productPriceId,
        customerEmail: authData.email,
        successUrl: `${baseUrl}/?success=true`,
      });

      log.info("Created Polar checkout session", {
        sessionId: session.id,
        userId: authData.userID,
        email: authData.email,
      });

      // When webhook fires, we'll need to link the Polar customer to this user
      // Store a mapping so the webhook can find the user
      // For now, we'll rely on email matching in the webhook handler

      return {
        checkoutUrl: session.url || "",
      };
    } catch (error) {
      log.error("Failed to create checkout", { error, productPriceId: req.productPriceId, userId: authData.userID });
      throw new Error(`Failed to create checkout: ${error}`);
    }
  }
);

