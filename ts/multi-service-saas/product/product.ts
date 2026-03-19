import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { billing } from "~encore/clients";
import crypto from "node:crypto";

const db = new SQLDatabase("product", {
  migrations: "./migrations",
});

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------

interface Product {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
}

interface CreateProductRequest {
  name: string;
  description: string;
  owner_id: string;
}

// -------------------------------------------------------------------
// POST /products — Create a product
// -------------------------------------------------------------------

export const create = api(
  { expose: true, auth: false, method: "POST", path: "/products" },
  async ({ name, description, owner_id }: CreateProductRequest): Promise<Product> => {
    // Check that the owner has an active subscription.
    const sub = await billing.get({ user_id: owner_id });
    if (sub.status !== "active") {
      throw APIError.permissionDenied("owner does not have an active subscription");
    }

    const id = crypto.randomUUID();

    await db.exec`
      INSERT INTO products (id, name, description, owner_id)
      VALUES (${id}, ${name}, ${description}, ${owner_id})
    `;

    return { id, name, description, owner_id, created_at: new Date().toISOString() };
  },
);

// -------------------------------------------------------------------
// GET /products/:id — Get a product
// -------------------------------------------------------------------

export const get = api(
  { expose: true, auth: false, method: "GET", path: "/products/:id" },
  async ({ id }: { id: string }): Promise<Product> => {
    const row = await db.queryRow<Product>`
      SELECT id, name, description, owner_id, created_at
      FROM products WHERE id = ${id}
    `;
    if (!row) throw APIError.notFound("product not found");
    return row;
  },
);

// -------------------------------------------------------------------
// GET /products — List products, optionally by owner
// -------------------------------------------------------------------

interface ListProductsRequest {
  owner_id?: string;
}

export const list = api(
  { expose: true, auth: false, method: "GET", path: "/products" },
  async ({ owner_id }: ListProductsRequest): Promise<{ products: Product[] }> => {
    const products: Product[] = [];

    if (owner_id) {
      const rows = db.query<Product>`
        SELECT id, name, description, owner_id, created_at
        FROM products WHERE owner_id = ${owner_id}
        ORDER BY created_at DESC
      `;
      for await (const row of rows) {
        products.push(row);
      }
    } else {
      const rows = db.query<Product>`
        SELECT id, name, description, owner_id, created_at
        FROM products ORDER BY created_at DESC
      `;
      for await (const row of rows) {
        products.push(row);
      }
    }

    return { products };
  },
);
