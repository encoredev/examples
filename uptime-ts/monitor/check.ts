import { api } from "encore.dev/api";
import { Subscription, Topic } from "encore.dev/pubsub";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { Site, SiteAddedTopic } from "../site/site";
import { ping } from "./ping";
import { site } from "encore.app/clients";

export const check = api(
  { method: "POST", path: "/check/:siteID" },
  async (p: { siteID: number }): Promise<void> => {
    const s = await site.get({ id: p.siteID });
    return doCheck(s);
  },
);

export const checkAll = api(
  { method: "POST", path: "/check-all" },
  async (): Promise<void> => {
    const sites = await site.list();
    await Promise.all(sites.sites.map(doCheck));
  },
);

async function doCheck(site: Site): Promise<void> {
  const { up } = await ping({ url: site.url });
  const wasUp = await getPreviousMeasurement(site.id);
  if (up !== wasUp) {
    await TransitionTopic.publish({ site, up });
  }
  await MonitorDB.q`
    INSERT INTO checks (site_id, up, checked_at)
    VALUES (${site.id}, ${up}, NOW())
  `;
}

async function getPreviousMeasurement(siteID: number): Promise<boolean> {
  const rows = MonitorDB.q`
    SELECT up
    FROM checks
    WHERE site_id = ${siteID}
    ORDER BY checked_at DESC 
    LIMIT 1
  `;
  for await (const row of rows) {
    return row.up;
  }
  return true;
}

const MonitorDB = new SQLDatabase("monitor", { migrations: "./migrations" });

const _ = new Subscription(SiteAddedTopic, "check-site", {
  handler: doCheck,
});

export interface TransitionEvent {
  site: Site;
  up: boolean;
}

export const TransitionTopic = new Topic<TransitionEvent>("uptime-transition", {
  deliveryGuarantee: "at-least-once",
});
