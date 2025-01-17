import { api } from "encore.dev/api";
import { Subscription, Topic } from "encore.dev/pubsub";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { Site, SiteAddedTopic } from "../site/site";
import { ping } from "./ping";
import { site } from "~encore/clients";
import { CronJob } from "encore.dev/cron";

// Check checks a single site.
export const check = api(
  { expose: true, method: "POST", path: "/check/:siteID" },
  async (p: { siteID: number }): Promise<{ up: boolean }> => {
    const s = await site.get({ id: p.siteID });
    return doCheck(s);
  },
);

// CheckAll checks all sites.
export const checkAll = api(
  { expose: true, method: "POST", path: "/check-all" },
  async (): Promise<void> => {
    const sites = await site.list();
    await Promise.all(sites.sites.map(doCheck));
  },
);

// Defines a Cron Job to check all tracked sites every hour.
// Learn more: https://encore.dev/docs/ts/primitives/cron-jobs

// 'check-all' is used to check all tracked sites every hour.
const cronJob = new CronJob("check-all", {
  title: "Check all sites",
  every: "1h",
  endpoint: checkAll,
});

async function doCheck(site: Site): Promise<{ up: boolean }> {
  const { up } = await ping({ url: site.url });

  // Publish a Pub/Sub message if the site transitions
  // from up->down or from down->up.
  const wasUp = await getPreviousMeasurement(site.id);
  if (up !== wasUp) {
    await TransitionTopic.publish({ site, up });
  }

  await MonitorDB.exec`
      INSERT INTO checks (site_id, up, checked_at)
      VALUES (${site.id}, ${up}, NOW())
  `;
  return { up };
}

// getPreviousMeasurement reports whether the given site was
// up or down in the previous measurement.
async function getPreviousMeasurement(siteID: number): Promise<boolean> {
  const row = await MonitorDB.queryRow`
      SELECT up
      FROM checks
      WHERE site_id = ${siteID}
      ORDER BY checked_at DESC
      LIMIT 1
  `;
  return row?.up ?? true;
}

// Define a database named 'monitor', using the database migrations
// in the "./migrations" folder. Encore automatically provisions,
// migrates, and connects to the database.

// The 'monitor' database is used to store the uptime checks
export const MonitorDB = new SQLDatabase("monitor", {
  migrations: "./migrations",
});

const _ = new Subscription(SiteAddedTopic, "check-site", {
  handler: doCheck,
});

// TransitionEvent describes a transition of a monitored site
// from up->down or from down->up.
export interface TransitionEvent {
  site: Site; // Site is the monitored site in question.
  up: boolean; // Up specifies whether the site is now up or down (the new value).
}

// 'uptime-transition' is a pubsub topic with transition events for when a monitored site
// transitions from up->down or from down->up.
export const TransitionTopic = new Topic<TransitionEvent>("uptime-transition", {
  deliveryGuarantee: "at-least-once",
});
