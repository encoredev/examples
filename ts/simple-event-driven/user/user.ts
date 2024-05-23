import { api, APIError } from "encore.dev/api";
import { Topic } from "encore.dev/pubsub";
import { HelloResponse } from "../hello/hello";
import { hello } from "~encore/clients";
import { SQLDatabase } from "encore.dev/storage/sqldb";

interface UserRequest {
  name: string;
  email: string;
}

export const add = api(
  { expose: true, method: "POST", path: "/user" },
  async ({ name, email }: UserRequest): Promise<HelloResponse> => {
    await db.exec`
        INSERT INTO users (name, email)
        VALUES (${name}, ${email})
    `;

    await UserAddedTopic.publish({ name, email });

    return await hello.get({ name });
  },
);

export const UserAddedTopic = new Topic<UserRequest>("user-added", {
  deliveryGuarantee: "at-least-once",
});

export const db = new SQLDatabase("user", {
  migrations: "./migrations",
});

interface User {
  id: string;
  name: string;
  email: string;
}

export const get = api(
  { expose: true, method: "GET", path: "/user/:id" },
  async ({ id }: { id: number }): Promise<User> => {
    const row = await db.queryRow<User>`
        SELECT name, email, id
        FROM users
        WHERE id = ${id}
    `;
    if (!row) throw APIError.notFound("user not found");
    return row;
  },
);

export const list = api(
  { expose: true, method: "GET", path: "/user" },
  async (): Promise<{ users: User[] }> => {
    const rows = db.query<User>`
        SELECT name, email, id
        FROM users
    `;
    const users: User[] = [];
    for await (const row of rows) {
      users.push(row);
    }
    return { users };
  },
);
