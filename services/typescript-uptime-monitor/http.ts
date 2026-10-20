export function json(body: unknown, status = 200): Response {
  return Response.json(body, { status });
}

export function error(message: string, status: number): Response {
  return json({ error: message }, status);
}

/** The request body as a JSON object, or undefined if it is not one. */
export async function readBody(req: Request): Promise<Record<string, unknown> | undefined> {
  try {
    const body = await req.json();
    return body !== null && typeof body === "object" && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : undefined;
  } catch {
    return undefined;
  }
}
