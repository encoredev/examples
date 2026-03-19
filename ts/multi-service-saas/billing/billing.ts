import { api, APIError } from "encore.dev/api";
import { Topic, Subscription } from "encore.dev/pubsub";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { UserCreatedTopic } from "../user/user";
import log from "encore.dev/log";

const db = new SQLDatabase("billing", {
  migrations: "./migrations",
});

// -------------------------------------------------------------------
// Events
// -------------------------------------------------------------------

export interface PlanChangedEvent {
  user_id: string;
  old_plan: string;
  new_plan: string;
}

export const PlanChangedTopic = new Topic<PlanChangedEvent>("plan-changed", {
  deliveryGuarantee: "at-least-once",
});

// -------------------------------------------------------------------
// Auto-create free plan when a user signs up
// -------------------------------------------------------------------

const _ = new Subscription(UserCreatedTopic, "create-free-plan", {
  handler: async (event) => {
    log.info("creating free plan for new user", { user_id: event.user_id });

    await db.exec`
      INSERT INTO subscriptions (user_id, plan, status)
      VALUES (${event.user_id}, 'free', 'active')
      ON CONFLICT (user_id) DO NOTHING
    `;
  },
});

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------

interface Subscription_ {
  id: number;
  user_id: string;
  plan: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// -------------------------------------------------------------------
// GET /billing/:user_id — Get billing info
// -------------------------------------------------------------------

export const get = api(
  { expose: true, auth: false, method: "GET", path: "/billing/:user_id" },
  async ({ user_id }: { user_id: string }): Promise<Subscription_> => {
    const row = await db.queryRow<Subscription_>`
      SELECT id, user_id, plan, status, created_at, updated_at
      FROM subscriptions WHERE user_id = ${user_id}
    `;
    if (!row) throw APIError.notFound("no subscription found");
    return row;
  },
);

// -------------------------------------------------------------------
// POST /billing/:user_id/upgrade — Upgrade plan
// -------------------------------------------------------------------

interface UpgradeRequest {
  user_id: string;
  plan: string;
}

export const upgrade = api(
  { expose: true, auth: false, method: "POST", path: "/billing/:user_id/upgrade" },
  async ({ user_id, plan }: UpgradeRequest): Promise<Subscription_> => {
    const valid = ["free", "pro", "enterprise"];
    if (!valid.includes(plan)) {
      throw APIError.invalidArgument(`plan must be one of: ${valid.join(", ")}`);
    }

    const current = await db.queryRow<{ plan: string }>`
      SELECT plan FROM subscriptions WHERE user_id = ${user_id}
    `;
    if (!current) throw APIError.notFound("no subscription found");

    await db.exec`
      UPDATE subscriptions
      SET plan = ${plan}, updated_at = NOW()
      WHERE user_id = ${user_id}
    `;

    await PlanChangedTopic.publish({
      user_id,
      old_plan: current.plan,
      new_plan: plan,
    });

    const row = await db.queryRow<Subscription_>`
      SELECT id, user_id, plan, status, created_at, updated_at
      FROM subscriptions WHERE user_id = ${user_id}
    `;
    return row!;
  },
);
