import { api } from "encore.dev/api";
import { Subscription, Topic } from "encore.dev/pubsub";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { Site, SiteAddedTopic } from "../site/site";
import { ping } from "./ping";
import { site } from "~encore/clients";

export const check = api(
  { expose: true, method: "POST", path: "/check/:siteID" },
  async (p: { siteID: number }): Promise<{ up: boolean }> => {
    const s = await site.get({ id: p.siteID });
    return doCheck(s);
  }
);

export const checkAll = api(
  { expose: true, method: "POST", path: "/check-all" },
  async (): Promise<void> => {
    const sites = await site.list();
    await Promise.all(sites.sites.map(doCheck));
  }
);

async function doCheck(site: Site): Promise<{ up: boolean }> {
  const { up } = await ping({ url: site.url });
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
