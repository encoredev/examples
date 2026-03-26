import { api } from "encore.dev/api";
import { db } from "./db";

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  paymentId?: string;
  trackingId?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
}

// Create an order in the database with status "pending".
export const create = api(
  { expose: false },
  async (req: { orderId: string; userId: string; totalAmount: number; items: OrderItem[] }): Promise<Order> => {
    await db.exec`
      INSERT INTO orders (id, user_id, total_amount, status)
      VALUES (${req.orderId}, ${req.userId}, ${req.totalAmount}, 'pending')
    `;
    for (const item of req.items) {
      await db.exec`
        INSERT INTO order_items (order_id, product_id, quantity)
        VALUES (${req.orderId}, ${item.productId}, ${item.quantity})
      `;
    }
    return { id: req.orderId, userId: req.userId, totalAmount: req.totalAmount, status: "pending" };
  }
);

// Update an order's status, payment ID, or tracking ID.
export const updateStatus = api(
  { expose: false },
  async (req: { orderId: string; status: string; paymentId?: string; trackingId?: string }): Promise<void> => {
    await db.exec`
      UPDATE orders SET
        status = ${req.status},
        payment_id = COALESCE(${req.paymentId ?? null}, payment_id),
        tracking_id = COALESCE(${req.trackingId ?? null}, tracking_id),
        updated_at = NOW()
      WHERE id = ${req.orderId}
    `;
  }
);

// Get an order by ID.
export const get = api(
  { expose: true, method: "GET", path: "/orders/:orderId/details" },
  async (req: { orderId: string }): Promise<Order> => {
    const row = await db.queryRow<{
      id: string; user_id: string; total_amount: number;
      status: string; payment_id: string | null; tracking_id: string | null;
    }>`SELECT * FROM orders WHERE id = ${req.orderId}`;
    if (!row) throw new Error("Order not found");
    return {
      id: row.id,
      userId: row.user_id,
      totalAmount: row.total_amount,
      status: row.status,
      paymentId: row.payment_id ?? undefined,
      trackingId: row.tracking_id ?? undefined,
    };
  }
);
