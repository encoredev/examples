import { api } from "encore.dev/api";
import { polar } from "./polar";

interface CheckoutRequest {
  productPriceId: string;
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
    const checkout = await polar.checkouts.custom.create({
      productPriceId: req.productPriceId,
      customerEmail: req.customerEmail,
      successUrl: `${process.env.ENCORE_API_URL}/site?success=true`,
    });

    return { checkoutUrl: checkout.url };
  }
);
