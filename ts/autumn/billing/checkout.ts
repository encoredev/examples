import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { autumn } from "./autumn";

// ------------------------------------------------------------------
// Checkout
// ------------------------------------------------------------------

interface CheckoutRequest {
  productId: string;
  successUrl?: string;
}

interface CheckoutResponse {
  checkoutUrl?: string;
  requiresConfirmation: boolean;
  previewData?: {
    total: number;
    currency: string;
  };
}

// Creates a checkout session for a product purchase.
// Returns a Stripe checkout URL for new customers, or preview data for upgrades.
export const createCheckout = api(
  { expose: true, method: "POST", path: "/billing/checkout", auth: true },
  async (req: CheckoutRequest): Promise<CheckoutResponse> => {
    const auth = getAuthData()!;

    const { data, error } = await autumn.checkout({
      customer_id: auth.userId,
      product_id: req.productId,
      success_url: req.successUrl,
    });

    if (error) {
      throw APIError.internal(`Checkout failed: ${error.message}`);
    }

    // If URL exists, customer needs to complete Stripe checkout
    if (data.url) {
      return {
        checkoutUrl: data.url,
        requiresConfirmation: false,
      };
    }

    // No URL means payment details are on file
    // Return preview data for user confirmation
    return {
      requiresConfirmation: true,
      previewData: {
        total: data.total,
        currency: data.currency,
      },
    };
  }
);

// ------------------------------------------------------------------
// Attach Product
// ------------------------------------------------------------------

interface AttachRequest {
  productId: string;
}

interface AttachResponse {
  success: boolean;
}

// Attaches a product to a customer and charges their saved payment method.
// Only needed when payment details are already on file (no checkout URL returned).
export const attachProduct = api(
  { expose: true, method: "POST", path: "/billing/attach", auth: true },
  async (req: AttachRequest): Promise<AttachResponse> => {
    const auth = getAuthData()!;

    const { data, error } = await autumn.attach({
      customer_id: auth.userId,
      product_id: req.productId,
    });

    if (error) {
      throw APIError.internal(`Attach failed: ${error.message}`);
    }

    return { success: true };
  }
);

