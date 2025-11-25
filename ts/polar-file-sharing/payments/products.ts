import { api } from "encore.dev/api";
import { polar } from "./polar";

interface CreatePremiumProductResponse {
  productId: string;
  checkoutUrl: string;
}

export const createPremiumProduct = api(
  { expose: true, method: "POST", path: "/products/premium" },
  async (): Promise<CreatePremiumProductResponse> => {
    const product = await polar.products.create({
      name: "Premium File Sharing",
      description: "Upload files up to 5GB, 30-day retention, no ads",
      organizationId: "4cbe308e-b875-4e30-92e7-4b9e0b2a6cae",
      prices: [
        {
          priceAmount: 999, // $9.99/month
          priceCurrency: "USD",
          recurring: {
            interval: "month",
          },
        },
      ],
    });

    return {
      productId: product.id,
      checkoutUrl: `https://polar.sh/checkout/${product.id}`,
    };
  }
);

