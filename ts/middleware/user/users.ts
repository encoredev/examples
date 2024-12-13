import { APIError, api } from "encore.dev/api";
import * as storage from "./storage";

export interface User {
  id: number;
  name: string;
}

interface List {
  users: User[];
}

/**
 * Creating users
 */
export const create = api(
  { expose: true, auth: true, method: "POST", path: "/users" },
  async ({ name }: { name: string }) => {
    await storage.createUser(name);
  },
);

/**
 * List all users
 */
export const list = api(
  { expose: true, auth: true, method: "GET", path: "/users" },
  async (): Promise<List> => {
    return { users: await storage.listUsers() };
  },
);

/**
 * Get user by id
 */
export const get = api(
  { expose: true, auth: true, method: "GET", path: "/users/:id" },
  async ({ id }: { id: number }): Promise<User> => {
    const user = await storage.getUser(id);
    if (user === undefined) {
      throw APIError.notFound("user not found");
    }
    return user;
  },
);

/**
 * Update user by id
 */
export const put = api(
  { expose: true, auth: true, method: "PUT", path: "/users/:id" },
  async ({ id, name }: { id: number; name: string }) => {
    await storage.updateUser(id, name);
  },
);

/**
 * Delete user by id
 */
export const del = api(
  { expose: true, auth: true, method: "DELETE", path: "/users/:id" },
  async ({ id }: { id: number }) => {
    await storage.deleteUser(id);
  },
);
