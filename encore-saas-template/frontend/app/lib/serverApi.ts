import getRequestClient from "./getRequestClient";

export async function getProducts() {
  // We need to pass in the API_URL from the environment variables, because running server sides api requests locally works better with 127.0.0.1
  const client = getRequestClient(undefined, { baseURL: process.env.API_URL });
  const { products } = await client.product.GetProducts();
  return products.sort((a, b) => a.price.unit_amount - b.price.unit_amount);
}