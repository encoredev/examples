import { api, APIError } from "encore.dev/api";
import { Topic } from "encore.dev/pubsub";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import crypto from "node:crypto";

const db = new SQLDatabase("user", {
  migrations: "./migrations",
});

// -------------------------------------------------------------------
// Events
// -------------------------------------------------------------------

export interface UserCreatedEvent {
  user_id: string;
  email: string;
  name: string;
}

export const UserCreatedTopic = new Topic<UserCreatedEvent>("user-created", {
  deliveryGuarantee: "at-least-once",
});

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------

interface CreateUserRequest {
  email: string;
  name: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

// -------------------------------------------------------------------
// POST /users — Create a new user
// -------------------------------------------------------------------

export const create = api(
  { expose: true, auth: false, method: "POST", path: "/users" },
  async ({ email, name }: CreateUserRequest): Promise<User> => {
    const id = crypto.randomUUID();

    await db.exec`
      INSERT INTO users (id, email, name)
      VALUES (${id}, ${email}, ${name})
    `;

    await UserCreatedTopic.publish({ user_id: id, email, name });

    return { id, email, name, created_at: new Date().toISOString() };
  },
);

// -------------------------------------------------------------------
// GET /users/:id — Get a user by ID
// -------------------------------------------------------------------

export const get = api(
  { expose: true, auth: false, method: "GET", path: "/users/:id" },
  async ({ id }: { id: string }): Promise<User> => {
    const row = await db.queryRow<User>`
      SELECT id, email, name, created_at
      FROM users WHERE id = ${id}
    `;
    if (!row) throw APIError.notFound("user not found");
    return row;
  },
);

// -------------------------------------------------------------------
// GET /users — List all users
// -------------------------------------------------------------------

export const list = api(
  { expose: true, auth: false, method: "GET", path: "/users" },
  async (): Promise<{ users: User[] }> => {
    const rows = db.query<User>`
      SELECT id, email, name, created_at
      FROM users ORDER BY created_at DESC
    `;
    const users: User[] = [];
    for await (const row of rows) {
      users.push(row);
    }
    return { users };
  },
);
