// A JSON REST API for todo items, kept in memory.
//
//   GET    /{{name}}/todos       list every todo
//   POST   /{{name}}/todos       create one from {"title": "..."}
//   GET    /{{name}}/todos/:id   get one
//   PATCH  /{{name}}/todos/:id   update {"title": "...", "done": true}, either field optional
//   DELETE /{{name}}/todos/:id   delete one

const service = "{{name}}";
const prefix = `/${service}/todos`;

interface Todo {
  id: number;
  title: string;
  done: boolean;
}

// Kept in memory; the todos are lost when the service restarts.
const todos = new Map<number, Todo>();
let nextId = 1;

function json(body: unknown, status = 200): Response {
  return Response.json(body, { status });
}

function error(message: string, status: number): Response {
  return json({ error: message }, status);
}

// readBody parses the request body as a JSON object, or returns undefined.
async function readBody(req: Request): Promise<Record<string, unknown> | undefined> {
  try {
    const body = await req.json();
    return body !== null && typeof body === "object" && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : undefined;
  } catch {
    return undefined;
  }
}

async function handle(req: Request): Promise<Response> {
  const { pathname } = new URL(req.url);

  if (pathname === prefix) {
    if (req.method === "GET") {
      return json([...todos.values()].sort((a, b) => a.id - b.id));
    }
    if (req.method === "POST") {
      const body = await readBody(req);
      if (typeof body?.title !== "string" || body.title.trim() === "") {
        return error('the body must be JSON like {"title": "..."}', 400);
      }
      const todo: Todo = { id: nextId++, title: body.title, done: false };
      todos.set(todo.id, todo);
      return json(todo, 201);
    }
    return error("method not allowed", 405);
  }

  if (!pathname.startsWith(`${prefix}/`)) {
    return error("not found", 404);
  }
  const id = Number(pathname.slice(prefix.length + 1));
  if (!Number.isInteger(id)) {
    return error("the todo id must be a number", 400);
  }
  const todo = todos.get(id);
  if (!todo) {
    return error("no such todo", 404);
  }

  switch (req.method) {
    case "GET":
      return json(todo);
    case "PATCH": {
      const body = await readBody(req);
      if (!body) {
        return error('the body must be JSON like {"done": true}', 400);
      }
      if (body.title !== undefined) {
        if (typeof body.title !== "string" || body.title.trim() === "") {
          return error("title must be a non-empty string", 400);
        }
        todo.title = body.title;
      }
      if (body.done !== undefined) {
        if (typeof body.done !== "boolean") {
          return error("done must be true or false", 400);
        }
        todo.done = body.done;
      }
      return json(todo);
    }
    case "DELETE":
      todos.delete(id);
      return new Response(null, { status: 204 });
    default:
      return error("method not allowed", 405);
  }
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

const server = Bun.serve({ ...listenAddr(), fetch: handle });

console.log(`${service} listening on ${server.hostname}:${server.port}`);
