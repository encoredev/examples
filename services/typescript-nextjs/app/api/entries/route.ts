// A route handler serving the guestbook as JSON, for scripts and other clients.
//
//   GET  /api/entries   the newest entries, newest first
//   POST /api/entries   add one from {"name": "...", "message": "..."}
export const dynamic = "force-dynamic";

// The database module is imported on first use rather than at the top: see
// "Building" in the README.
const db = () => import("@/db");

export async function GET(): Promise<Response> {
  const { listEntries } = await db();
  return Response.json({ entries: await listEntries() });
}

export async function POST(req: Request): Promise<Response> {
  const body: unknown = await req.json().catch(() => undefined);
  const { name, message } = (body ?? {}) as { name?: unknown; message?: unknown };
  if (typeof name !== "string" || typeof message !== "string") {
    return Response.json(
      { error: 'the body must be JSON like {"name": "...", "message": "..."}' },
      { status: 400 },
    );
  }
  const { addEntry } = await db();
  const result = await addEntry(name, message);
  if (typeof result === "string") {
    return Response.json({ error: result }, { status: 400 });
  }
  return Response.json(result, { status: 201 });
}
