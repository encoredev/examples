import { api } from "encore.dev/api";
import { polar } from "./polar";
import { getAuthData } from "~encore/auth";
import { db } from "./db";
import log from "encore.dev/log";

interface CreateCheckoutRequest {
  productId: string;
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
        products: [req.productId],
        customerEmail: authData.email,
        successUrl: `${baseUrl}/?success=true`,
      });

      log.info("Created Polar checkout session", {
        sessionId: session.id,
        userId: authData.userID,
        email: authData.email,
      });

      return {
        checkoutUrl: session.url || "",
      };
    } catch (error) {
      log.error("Failed to create checkout", { error, productId: req.productId, userId: authData.userID });
      throw new Error(`Failed to create checkout: ${error}`);
    }
  }
);

