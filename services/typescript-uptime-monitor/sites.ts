import log from "@encore.dev/sdk/log";
import type { BunRequest } from "bun";
import { check } from "./check";
import { db, type Site } from "./db";
import { error, json, readBody } from "./http";

// At most this many sites can be monitored, to limit abuse.
const maxSites = 20;

export async function allSites(): Promise<Site[]> {
  return db.queryAll<Site>`SELECT id, url FROM sites ORDER BY id`;
}

export async function listSites(): Promise<Response> {
  return json({ sites: await allSites() });
}

export async function addSite(req: Request): Promise<Response> {
  const body = await readBody(req);
  const url = typeof body?.url === "string" ? body.url.trim() : "";
  if (url === "") {
    return error('the body must be JSON like {"url": "example.com"}', 400);
  }

  const count = await db.queryRow<{ n: number }>`SELECT count(*)::int AS n FROM sites`;
  if ((count?.n ?? 0) >= maxSites) {
    return error(`too many sites: at most ${maxSites} can be monitored`, 429);
  }

  const site = await db.queryRow<Site>`
    INSERT INTO sites (url) VALUES (${url})
    ON CONFLICT (url) DO NOTHING
    RETURNING id, url
  `;
  if (!site) {
    return error("the site is already being monitored", 409);
  }

  // Check the new site right away, without making the caller wait for it.
  check(site).catch((err) => log.error(err, "checking a new site", { site: site.url }));

  return json(site, 201);
}

export async function getSite(req: BunRequest<"/:id">): Promise<Response> {
  const site = await siteFromPath(req);
  return site instanceof Response ? site : json(site);
}

export async function deleteSite(req: BunRequest<"/:id">): Promise<Response> {
  const id = siteId(req);
  if (id === undefined) {
    return error("the site id must be a number", 400);
  }
  // Its checks are deleted with it (ON DELETE CASCADE).
  const { rowsAffected } = await db.exec`DELETE FROM sites WHERE id = ${id}`;
  if (rowsAffected === 0n) {
    return error("no such site", 404);
  }
  return new Response(null, { status: 204 });
}

/** The site the request's `:id` names, or the response saying why there is none. */
export async function siteFromPath(req: BunRequest<"/:id">): Promise<Site | Response> {
  const id = siteId(req);
  if (id === undefined) {
    return error("the site id must be a number", 400);
  }
  const site = await db.queryRow<Site>`SELECT id, url FROM sites WHERE id = ${id}`;
  return site ?? error("no such site", 404);
}

function siteId(req: BunRequest<"/:id">): number | undefined {
  const id = Number(req.params.id);
  return Number.isSafeInteger(id) && id > 0 ? id : undefined;
}
