import { api, APIError } from "encore.dev/api";
import { Topic } from "encore.dev/pubsub";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import crypto from "node:crypto";

// Landing page with setup instructions and API documentation.
export const index = api.raw(
  { expose: true, method: "GET", path: "/" },
  async (req, resp) => {
    const host = req.headers["host"] ?? "localhost:4000";
    const proto = req.headers["x-forwarded-proto"] ?? "http";
    const baseUrl = `${proto}://${host}`;
    resp.setHeader("Content-Type", "text/html");
    resp.end(landingPage.replaceAll("{{baseUrl}}", baseUrl));
  },
);

const landingPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Multi-Service SaaS Backend</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #0a0a0a; color: #e5e5e5; padding: 2rem; max-width: 720px; margin: 0 auto; line-height: 1.6; }
    h1 { font-size: 1.75rem; margin-bottom: 0.5rem; color: #fff; }
    h2 { font-size: 1.1rem; margin-top: 2rem; margin-bottom: 0.75rem; color: #fff; }
    h3 { font-size: 0.95rem; margin-top: 1.5rem; margin-bottom: 0.5rem; color: #d4d4d4; }
    p { margin-bottom: 1rem; color: #a3a3a3; }
    code { background: #1a1a1a; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.9em; color: #e5e5e5; }
    pre { background: #1a1a1a; border: 1px solid #262626; border-radius: 8px; padding: 1rem; overflow-x: auto; margin-bottom: 1rem; }
    pre code { background: none; padding: 0; }
    .endpoint { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
    .method { font-size: 0.75rem; font-weight: 600; padding: 0.2rem 0.5rem; border-radius: 4px; font-family: monospace; }
    .post { background: #1d4ed8; color: #fff; }
    .get { background: #15803d; color: #fff; }
    .path { font-family: monospace; color: #e5e5e5; }
    .desc { color: #737373; font-size: 0.9rem; margin-bottom: 1.25rem; }
    a { color: #60a5fa; }
    .badge { display: inline-block; background: #1d4ed8; color: #fff; font-size: 0.7rem; padding: 0.15rem 0.5rem; border-radius: 999px; margin-left: 0.5rem; font-weight: 600; vertical-align: middle; position: relative; top: -0.15em; }
  </style>
</head>
<body>
  <h1>Multi-Service SaaS <span class="badge">Encore.ts</span></h1>
  <p>A SaaS backend starter with user management, billing, and project management. Demonstrates event-driven provisioning, plan-based limits, and database-per-service architecture.</p>

  <p>Explore and test endpoints in the <a href="http://localhost:9400/">Local Dashboard</a> when running locally. When deployed to <a href="https://app.encore.cloud">Encore Cloud</a>, use the Service Catalog to call endpoints and view traces to see how requests flow between services.</p>

  <h2>Setup</h2>
  <p>No secrets or manual configuration needed. The Postgres databases are provisioned automatically when you run <code>encore run</code>. Each service gets its own database.</p>

  <h2>Architecture</h2>
  <p>When a user is created, the <strong>billing</strong> service automatically provisions a free subscription via Pub/Sub. The <strong>project</strong> service enforces plan-based limits (free: 3, pro: 25, enterprise: unlimited).</p>

  <h2>Endpoints</h2>

  <h3>Users</h3>

  <div class="endpoint">
    <span class="method post">POST</span>
    <span class="path">/users</span>
    <code>user.create</code>
  </div>
  <p class="desc">Create a new user. Triggers automatic free plan provisioning.</p>
  <pre><code>curl -X POST {{baseUrl}}/users \\
  -H "Content-Type: application/json" \\
  -d '{"email": "alice@example.com", "name": "Alice"}'</code></pre>

  <div class="endpoint">
    <span class="method get">GET</span>
    <span class="path">/users/:id</span>
    <code>user.get</code>
  </div>
  <p class="desc">Get a user by ID.</p>
  <pre><code>curl {{baseUrl}}/users/&lt;user_id&gt;</code></pre>

  <div class="endpoint">
    <span class="method get">GET</span>
    <span class="path">/users</span>
    <code>user.list</code>
  </div>
  <p class="desc">List all users.</p>
  <pre><code>curl {{baseUrl}}/users</code></pre>

  <h3>Billing</h3>

  <div class="endpoint">
    <span class="method get">GET</span>
    <span class="path">/billing/:user_id</span>
    <code>billing.get</code>
  </div>
  <p class="desc">Get billing info for a user. Auto-created after user signup.</p>
  <pre><code>curl {{baseUrl}}/billing/&lt;user_id&gt;</code></pre>

  <div class="endpoint">
    <span class="method post">POST</span>
    <span class="path">/billing/:user_id/upgrade</span>
    <code>billing.upgrade</code>
  </div>
  <p class="desc">Upgrade a user's plan. Options: free, pro, enterprise.</p>
  <pre><code>curl -X POST {{baseUrl}}/billing/&lt;user_id&gt;/upgrade \\
  -H "Content-Type: application/json" \\
  -d '{"plan": "pro"}'</code></pre>

  <h3>Projects</h3>

  <div class="endpoint">
    <span class="method post">POST</span>
    <span class="path">/projects</span>
    <code>project.create</code>
  </div>
  <p class="desc">Create a project. Enforces plan-based limits (free: 3, pro: 25, enterprise: unlimited).</p>
  <pre><code>curl -X POST {{baseUrl}}/projects \\
  -H "Content-Type: application/json" \\
  -d '{"name": "My Project", "description": "A great project", "owner_id": "&lt;user_id&gt;"}'</code></pre>

  <div class="endpoint">
    <span class="method get">GET</span>
    <span class="path">/projects/:id</span>
    <code>project.get</code>
  </div>
  <p class="desc">Get a project by ID.</p>
  <pre><code>curl {{baseUrl}}/projects/&lt;project_id&gt;</code></pre>

  <div class="endpoint">
    <span class="method get">GET</span>
    <span class="path">/projects</span>
    <code>project.list</code>
  </div>
  <p class="desc">List projects. Optionally filter by owner.</p>
  <pre><code>curl {{baseUrl}}/projects
curl "{{baseUrl}}/projects?owner_id=&lt;user_id&gt;"</code></pre>

</body>
</html>`;

const db = new SQLDatabase("user", {
  migrations: "./migrations",
});

export interface UserCreatedEvent {
  user_id: string;
  email: string;
  name: string;
}

export const UserCreatedTopic = new Topic<UserCreatedEvent>("user-created", {
  deliveryGuarantee: "at-least-once",
});

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

// Create a new user. Publishes a UserCreated event for downstream services.
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

// Get a user by ID.
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

// List all users.
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
