import { api } from "encore.dev/api";
import { polar } from "./polar";
import log from "encore.dev/log";

export const getProduct = api(
  { expose: true, method: "GET", path: "/products/:productId" },
  async ({ productId }: { productId: string }) => {
    try {
      const product = await polar.products.get({ id: productId });
      log.info("Product details", { product });
      return product;
    } catch (error) {
      log.error("Failed to get product", { error, productId });
      throw error;
    }
  }
);

