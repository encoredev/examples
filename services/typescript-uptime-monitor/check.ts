import { CronJob } from "@encore.dev/sdk/cron";
import log from "@encore.dev/sdk/log";
import { Topic } from "@encore.dev/sdk/pubsub";
import type { BunRequest } from "bun";
import { error, json } from "./http";
import { db, type Site } from "./db";
import { allSites, siteFromPath } from "./sites";

// checkAllJob checks every site once an hour. Encore sends a POST for its path
// when it is due; locally nothing runs it, so POST the path yourself.
export const checkAllJob = new CronJob("{{kebab}}-check-all", {
  title: "Check all sites",
  path: "/{{name}}/check-all",
  every: "1h",
});

/** A site went from up to down, or from down to up. */
export interface TransitionEvent {
  site: Site;
  /** Whether the site is up now. */
  up: boolean;
}

// transitions carries a TransitionEvent each time a check finds a site's
// status changed. The Slack notification subscribes to it.
export const transitions = new Topic<TransitionEvent>("{{kebab}}-transition", {
  deliveryGuarantee: "at-least-once",
});

/** Whether url answers a GET with a 2xx status. Without a scheme, it is requested over https. */
export async function ping(url: string): Promise<boolean> {
  if (!url.startsWith("http:") && !url.startsWith("https:")) {
    url = "https://" + url;
  }
  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    await resp.body?.cancel();
    return resp.ok;
  } catch {
    return false;
  }
}

/** Pings site, publishes a TransitionEvent if its status changed since the last check, and records the check. */
export async function check(site: Site): Promise<boolean> {
  const up = await ping(site.url);

  // A site never checked before counts as having been up.
  const last = await db.queryRow<{ up: boolean }>`
    SELECT up FROM checks
    WHERE site_id = ${site.id}
    ORDER BY checked_at DESC
    LIMIT 1
  `;
  const wasUp = last?.up ?? true;
  if (up !== wasUp) {
    await transitions.publish({ site, up });
  }

  await db.exec`
    INSERT INTO checks (site_id, up, checked_at)
    VALUES (${site.id}, ${up}, NOW())
  `;
  return up;
}

export async function checkSite(req: BunRequest<"/:id">): Promise<Response> {
  const site = await siteFromPath(req);
  if (site instanceof Response) return site;
  return json({ up: await check(site) });
}

// checkAll checks every site, up to 8 at a time.
export async function checkAll(): Promise<Response> {
  const sites = await allSites();
  const queue = [...sites];
  const failures: unknown[] = [];
  const worker = async () => {
    for (let site = queue.shift(); site; site = queue.shift()) {
      await check(site).catch((err) => failures.push(err));
    }
  };
  await Promise.all(Array.from({ length: Math.min(8, sites.length) }, worker));
  if (failures.length > 0) {
    log.error(failures[0], "checking sites", { failed: failures.length });
    return error("internal error", 500);
  }
  log.info("checked all sites", { count: sites.length });
  return json({ checked: sites.length });
}

export async function status(): Promise<Response> {
  const sites = await db.queryAll<{ id: number; up: boolean; checked_at: Date }>`
    SELECT DISTINCT ON (site_id) site_id AS id, up, checked_at
    FROM checks
    ORDER BY site_id, checked_at DESC
  `;
  return json({ sites });
}

export async function pingUrl(req: BunRequest<"/:url">): Promise<Response> {
  return json({ up: await ping(req.params.url) });
}
