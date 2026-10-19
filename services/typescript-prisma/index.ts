// A REST API for users, stored in Postgres through Prisma.
//
//   GET    /{{name}}/count/users   count the users
//   POST   /{{name}}/users         create one from {"name": "...", "surname": "..."}
//   GET    /{{name}}/users         list them; ?page=1&limit=10 for one page
//   GET    /{{name}}/users/:id     get one
//   PATCH  /{{name}}/users/:id     update {"name": "...", "surname": "..."}, either optional
//   DELETE /{{name}}/users/:id     delete one
import log from "@encore.dev/sdk/log";
import { onShutdown } from "@encore.dev/sdk/shutdown";
import { prisma } from "./db";
import type { User } from "./generated/prisma/client";

const service = "{{name}}";

/** One page of a list. */
interface Pagination {
  /** The total number of users. */
  count: number;
  /** The number of users per page. */
  pageSize: number;
  /** The number of pages. */
  totalPages: number;
  /** The page returned, from 1. */
  current: number;
}

/** Every response: whether it succeeded, and its result or a message. */
interface Envelope {
  success: boolean;
  message?: string;
  result?: User | User[] | number | string;
  pagination?: Pagination;
}

function reply(body: Envelope, status = 200): Response {
  return Response.json(body, { status });
}

function fail(message: string, status: number): Response {
  return reply({ success: false, message }, status);
}

const notFound = () => fail("User not found", 404);

/** Parses the request body as {"name"?: string, "surname"?: string}. */
async function readUser(req: Request): Promise<{ name?: string; surname?: string } | undefined> {
  const body: unknown = await req.json().catch(() => undefined);
  if (body === null || typeof body !== "object" || Array.isArray(body)) return undefined;
  const { name, surname } = body as Record<string, unknown>;
  const optString = (v: unknown) => v === undefined || (typeof v === "string" && v.trim() !== "");
  if (!optString(name) || !optString(surname)) return undefined;
  return { name: name as string | undefined, surname: surname as string | undefined };
}

/** Parses a route's :id, or returns undefined if it isn't a positive integer. */
function parseId(raw: string): number | undefined {
  const id = Number(raw);
  return Number.isSafeInteger(id) && id > 0 ? id : undefined;
}

async function count(): Promise<Response> {
  return reply({ success: true, result: await prisma.user.count() });
}

async function create(req: Request): Promise<Response> {
  const data = await readUser(req);
  if (!data?.name || !data.surname) {
    return fail('the body must be JSON like {"name": "John", "surname": "Doe"}', 400);
  }
  const user = await prisma.user.create({ data: { name: data.name, surname: data.surname } });
  return reply({ success: true, result: user }, 201);
}

async function list(req: Request): Promise<Response> {
  const query = new URL(req.url).searchParams;
  if (!query.has("page") && !query.has("limit")) {
    return reply({ success: true, result: await prisma.user.findMany({ orderBy: { id: "asc" } }) });
  }
  const page = Number(query.get("page"));
  const limit = Number(query.get("limit"));
  if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1) {
    return fail("page and limit must both be positive integers", 400);
  }
  const [total, users] = await prisma.$transaction([
    prisma.user.count(),
    prisma.user.findMany({ orderBy: { id: "asc" }, take: limit, skip: limit * (page - 1) }),
  ]);
  return reply({
    success: true,
    result: users,
    pagination: { count: total, pageSize: limit, totalPages: Math.ceil(total / limit), current: page },
  });
}

async function get(rawId: string): Promise<Response> {
  const id = parseId(rawId);
  if (id === undefined) return notFound();
  const user = await prisma.user.findUnique({ where: { id } });
  return user ? reply({ success: true, result: user }) : notFound();
}

async function update(req: Request, rawId: string): Promise<Response> {
  const id = parseId(rawId);
  if (id === undefined) return notFound();
  const data = await readUser(req);
  if (!data) {
    return fail('the body must be JSON like {"name": "Johnny"}, with non-empty strings', 400);
  }
  // updateMany matches nothing, rather than throwing, when there is no such user.
  const { count } = await prisma.user.updateMany({ where: { id }, data });
  if (count === 0) return notFound();
  return reply({ success: true, result: (await prisma.user.findUnique({ where: { id } }))! });
}

async function remove(rawId: string): Promise<Response> {
  const id = parseId(rawId);
  if (id === undefined) return notFound();
  const { count } = await prisma.user.deleteMany({ where: { id } });
  if (count === 0) return notFound();
  return reply({ success: true, result: "User deleted successfully" });
}

// Encore's local run supplies ENCORE_LISTEN_ADDR as host:port. Run on its own,
// this falls back to PORT and then to 8080.
function listenAddr(): { hostname?: string; port: number } {
  const addr = process.env.ENCORE_LISTEN_ADDR;
  if (addr) {
    const at = addr.lastIndexOf(":");
    return { hostname: addr.slice(0, at) || undefined, port: Number(addr.slice(at + 1)) };
  }
  return { port: Number(process.env.PORT ?? 8080) };
}

const server = Bun.serve({
  ...listenAddr(),
  routes: {
    "/{{name}}/count/users": { GET: count },
    "/{{name}}/users": { GET: list, POST: create },
    "/{{name}}/users/:id": {
      GET: (req) => get(req.params.id),
      PATCH: (req) => update(req, req.params.id),
      DELETE: (req) => remove(req.params.id),
    },
  },
  fetch: () => fail("not found", 404),
  error(err) {
    log.error(err, "handling a request");
    return fail("internal error", 500);
  },
});

log.info("listening", { service, addr: `${server.hostname}:${server.port}` });

// On shutdown, finish the requests in flight, then close Prisma's connections.
onShutdown(async () => {
  await server.stop();
  await prisma.$disconnect();
});
