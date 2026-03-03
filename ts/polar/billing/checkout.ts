import { api } from "encore.dev/api";
import { polar } from "./polar";

interface CheckoutRequest {
  productId: string;
  customerEmail: string;
}

interface CheckoutResponse {
  checkoutUrl: string;
}

// Create a Polar checkout session.
// Returns a URL to redirect the customer to Polar's hosted payment page.
export const createCheckout = api(
  { expose: true, method: "POST", path: "/checkout" },
  async (req: CheckoutRequest): Promise<CheckoutResponse> => {
    const baseUrl = process.env.ENCORE_API_URL || "http://localhost:4000";

    const checkout = await polar.checkouts.create({
      products: [req.productId],
      customerEmail: req.customerEmail,
      successUrl: `${baseUrl}/site?success=true`,
    });

    return { checkoutUrl: checkout.url };
  }
);
