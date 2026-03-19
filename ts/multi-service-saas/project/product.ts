import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { billing } from "~encore/clients";
import crypto from "node:crypto";

const db = new SQLDatabase("product", {
  migrations: "./migrations",
});

// Plan limits for the number of projects a user can create.
const PLAN_LIMITS: Record<string, number> = {
  free: 3,
  pro: 25,
  enterprise: Infinity,
};

interface Project {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
}

interface CreateProjectRequest {
  name: string;
  description: string;
}

// Create a project. Enforces plan-based limits on the number of projects per user.
export const create = api(
  { expose: true, auth: true, method: "POST", path: "/projects" },
  async ({ name, description }: CreateProjectRequest): Promise<Project> => {
    const { userID: owner_id } = getAuthData()!;

    // Check the owner's plan to determine project limit.
    const sub = await billing.get();
    const limit = PLAN_LIMITS[sub.plan] ?? PLAN_LIMITS.free;

    // Count existing projects for this user.
    const count = await db.queryRow<{ count: number }>`
      SELECT COUNT(*)::int AS count FROM projects WHERE owner_id = ${owner_id}
    `;
    if ((count?.count ?? 0) >= limit) {
      throw APIError.permissionDenied(
        `project limit reached (${limit} on ${sub.plan} plan). Upgrade to create more.`,
      );
    }

    const id = crypto.randomUUID();

    await db.exec`
      INSERT INTO projects (id, name, description, owner_id)
      VALUES (${id}, ${name}, ${description}, ${owner_id})
    `;

    return { id, name, description, owner_id, created_at: new Date().toISOString() };
  },
);

// Get a project by ID.
export const get = api(
  { expose: true, auth: false, method: "GET", path: "/projects/:id" },
  async ({ id }: { id: string }): Promise<Project> => {
    const row = await db.queryRow<Project>`
      SELECT id, name, description, owner_id, created_at
      FROM projects WHERE id = ${id}
    `;
    if (!row) throw APIError.notFound("project not found");
    return row;
  },
);

interface ListProjectsRequest {
  owner_id?: string;
}

// List projects. Optionally filter by owner_id.
export const list = api(
  { expose: true, auth: false, method: "GET", path: "/projects" },
  async ({ owner_id }: ListProjectsRequest): Promise<{ projects: Project[] }> => {
    const projects: Project[] = [];

    if (owner_id) {
      const rows = db.query<Project>`
        SELECT id, name, description, owner_id, created_at
        FROM projects WHERE owner_id = ${owner_id}
        ORDER BY created_at DESC
      `;
      for await (const row of rows) {
        projects.push(row);
      }
    } else {
      const rows = db.query<Project>`
        SELECT id, name, description, owner_id, created_at
        FROM projects ORDER BY created_at DESC
      `;
      for await (const row of rows) {
        projects.push(row);
      }
    }

    return { projects };
  },
);
