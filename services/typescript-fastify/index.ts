// A JSON REST API for todo items, built on Fastify and stored in Postgres.
//
//   GET    /{{name}}/todos       list every todo
//   POST   /{{name}}/todos       create one from {"title": "..."}
//   GET    /{{name}}/todos/:id   get one
//   PATCH  /{{name}}/todos/:id   update {"title": "...", "done": true}, either field optional
//   DELETE /{{name}}/todos/:id   delete one

import log from "@encore.dev/sdk/log";
import { onShutdown } from "@encore.dev/sdk/shutdown";
import { Database } from "@encore.dev/sdk/storage/postgres";
import Fastify, { type FastifyInstance } from "fastify";

// The service's database. Encore finds this declaration, provisions the
// database and applies the migrations in ./migrations before the service
// starts.
const db = new Database("{{ident}}", { migrations: "./migrations" });

interface Todo {
  id: number;
  title: string;
  done: boolean;
  created_at: Date;
}

// The request shapes, checked by Fastify against the JSON schemas below
// before a handler runs: a request that does not match is answered with 400.
// Fields a schema does not name are dropped from the body.
interface IdParams {
  id: number;
}
interface CreateBody {
  title: string;
}
interface UpdateBody {
  title?: string;
  done?: boolean;
}

const idParams = {
  type: "object",
  required: ["id"],
  properties: { id: { type: "integer", minimum: 1 } },
} as const;

// A title must have something in it besides spaces.
const titleSchema = { type: "string", pattern: "\\S" } as const;

const createBody = {
  type: "object",
  required: ["title"],
  additionalProperties: false,
  properties: { title: titleSchema },
} as const;

const updateBody = {
  type: "object",
  additionalProperties: false,
  properties: { title: titleSchema, done: { type: "boolean" } },
} as const;

// How a todo is answered. Fastify serializes a response with its schema,
// which fixes the order of the fields and leaves out any others.
const todoSchema = {
  type: "object",
  properties: {
    id: { type: "integer" },
    title: { type: "string" },
    done: { type: "boolean" },
    created_at: { type: "string", format: "date-time" },
  },
} as const;

function routes(app: FastifyInstance) {
  app.get(
    "/todos",
    { schema: { response: { 200: { type: "array", items: todoSchema } } } },
    async () => {
      return db.queryAll<Todo>`
        SELECT id, title, done, created_at FROM todos ORDER BY id`;
    },
  );

  app.post<{ Body: CreateBody }>(
    "/todos",
    { schema: { body: createBody, response: { 201: todoSchema } } },
    async (req, reply) => {
      const todo = await db.queryRow<Todo>`
        INSERT INTO todos (title) VALUES (${req.body.title.trim()})
        RETURNING id, title, done, created_at`;
      log.info("todo created", { id: todo?.id });
      return reply.code(201).send(todo);
    },
  );

  app.get<{ Params: IdParams }>(
    "/todos/:id",
    { schema: { params: idParams, response: { 200: todoSchema } } },
    async (req, reply) => {
      const todo = await db.queryRow<Todo>`
        SELECT id, title, done, created_at FROM todos WHERE id = ${req.params.id}`;
      return todo ?? reply.code(404).send({ error: "no such todo" });
    },
  );

  app.patch<{ Params: IdParams; Body: UpdateBody }>(
    "/todos/:id",
    { schema: { params: idParams, body: updateBody, response: { 200: todoSchema } } },
    async (req, reply) => {
      // A field left out of the request keeps its value.
      const { title, done } = req.body;
      const todo = await db.queryRow<Todo>`
        UPDATE todos
        SET title = COALESCE(${title?.trim() ?? null}, title),
            done = COALESCE(${done ?? null}, done)
        WHERE id = ${req.params.id}
        RETURNING id, title, done, created_at`;
      return todo ?? reply.code(404).send({ error: "no such todo" });
    },
  );

  app.delete<{ Params: IdParams }>(
    "/todos/:id",
    { schema: { params: idParams } },
    async (req, reply) => {
      const { rowsAffected } = await db.exec`
        DELETE FROM todos WHERE id = ${req.params.id}`;
      if (rowsAffected === 0n) {
        return reply.code(404).send({ error: "no such todo" });
      }
      return reply.code(204).send();
    },
  );
}

const app = Fastify();

// The service receives the full path, its /{{name}} prefix included.
app.register(async (todos) => routes(todos), { prefix: "/{{name}}" });

// Unexpected errors are logged and answered with a 500 that says no more.
// Validation errors (400) and other client errors keep Fastify's answer.
app.setErrorHandler((err: { statusCode?: number; message: string }, req, reply) => {
  if (err.statusCode !== undefined && err.statusCode < 500) {
    return reply.code(err.statusCode).send({ error: err.message });
  }
  log.error("request failed", { route: req.url, error: err.message });
  return reply.code(500).send({ error: "internal error" });
});

// Encore's local run supplies ENCORE_LISTEN_ADDR as host:port. Run on its own,
// this falls back to PORT and then to 8080.
function listenAddr(): { host: string; port: number } {
  const addr = process.env.ENCORE_LISTEN_ADDR;
  if (addr) {
    const at = addr.lastIndexOf(":");
    return { host: addr.slice(0, at) || "127.0.0.1", port: Number(addr.slice(at + 1)) };
  }
  return { host: "127.0.0.1", port: Number(process.env.PORT ?? 8080) };
}

const address = await app.listen(listenAddr());
log.info("{{name}} listening", { address });

// On shutdown, finish the requests in flight before Encore flushes telemetry.
onShutdown(() => app.close());
