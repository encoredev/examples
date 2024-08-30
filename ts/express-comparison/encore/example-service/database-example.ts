import { api } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";

// Define a database named 'users', using the database migrations in the "./migrations" folder.
// Encore automatically provisions, migrates, and connects to the database.
// https://encore.dev/docs/ts/primitives/databases
export const DB = new SQLDatabase("users", {
  migrations: "./migrations",
});

interface User {
  name: string;
  id: number;
}

// Get one User from DB
export const getUser = api(
  { expose: true, method: "GET", path: "/user/:id" },
  async ({ id }: { id: number }): Promise<{ user: User | null }> => {
    const user = await DB.queryRow<User>`
        SELECT name
        FROM users
        WHERE id = ${id}
    `;

    return { user };
  },
);

// Get all Users from DB
export const listUsers = api(
  { expose: true, method: "GET", path: "/user" },
  async (): Promise<{ users: User[] }> => {
    const rows = await DB.query<User>`
        SELECT *
        FROM users
    `;

    const users: User[] = [];
    for await (const user of rows) {
      users.push(user);
    }

    return { users };
  },
);

// Add User from DB
export const addUser = api(
  { expose: true, method: "POST", path: "/user" },
  async ({ name }: { name: string }): Promise<void> => {
    await DB.exec`
        INSERT INTO users (name)
        VALUES (${name})
    `;
    return;
  },
);
