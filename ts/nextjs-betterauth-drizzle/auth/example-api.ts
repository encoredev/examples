/**
 * Example API endpoints showing how to extend the starter
 * 
 * This file demonstrates:
 * - Creating new API endpoints
 * - Querying the database with Drizzle
 * - Type-safe request/response handling
 * - Error handling
 */

import { api, APIError } from "encore.dev/api";
import { db } from "./db.js";
import { user } from "./schema.js";
import { eq } from "drizzle-orm";

// Example: Get user profile by ID
interface GetUserRequest {
  id: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
}

export const getUserProfile = api(
  { expose: true, method: "GET", path: "/users/:id" },
  async ({ id }: GetUserRequest): Promise<UserProfile> => {
    const userRecord = await db.query.user.findFirst({
      where: eq(user.id, id),
    });

    if (!userRecord) {
      throw APIError.notFound(`User with id ${id} not found`);
    }

    return {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      emailVerified: userRecord.emailVerified,
      createdAt: userRecord.createdAt,
    };
  }
);

// Example: List all users (with pagination)
interface ListUsersRequest {
  limit?: number;
  offset?: number;
}

interface ListUsersResponse {
  users: UserProfile[];
  total: number;
}

export const listUsers = api(
  { expose: true, method: "GET", path: "/users" },
  async ({ limit = 10, offset = 0 }: ListUsersRequest): Promise<ListUsersResponse> => {
    const users = await db.query.user.findMany({
      limit,
      offset,
    });

    return {
      users: users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        emailVerified: u.emailVerified,
        createdAt: u.createdAt,
      })),
      total: users.length,
    };
  }
);

// Example: Update user profile
interface UpdateUserRequest {
  id: string;
  name?: string;
  image?: string;
}

export const updateUserProfile = api(
  { expose: true, method: "PATCH", path: "/users/:id", auth: false },
  async ({ id, name, image }: UpdateUserRequest): Promise<UserProfile> => {
    // In a real app, you'd verify the user is updating their own profile
    // using auth data: const authData = getAuthData();
    
    const updates: Partial<typeof user.$inferInsert> = {};
    if (name !== undefined) updates.name = name;
    if (image !== undefined) updates.image = image;
    updates.updatedAt = new Date();

    const [updated] = await db
      .update(user)
      .set(updates)
      .where(eq(user.id, id))
      .returning();

    if (!updated) {
      throw APIError.notFound(`User with id ${id} not found`);
    }

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      emailVerified: updated.emailVerified,
      createdAt: updated.createdAt,
    };
  }
);

