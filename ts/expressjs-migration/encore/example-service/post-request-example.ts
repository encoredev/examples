import { api } from "encore.dev/api";

interface OrderRequest {
  price: string;
  orderId: number;
}

// POST request example
// https://encore.dev/docs/ts/primitives/defining-apis
export const order = api(
  { expose: true, method: "POST", path: "/order" },
  async ({ price, orderId }: OrderRequest): Promise<{ message: string }> => {
    // Handle order logic
    return { message: "Order has been placed" };
  },
);
