import { api } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import knex from "knex";
import { Topic } from "encore.dev/pubsub";

// Site describes a monitored site.
export interface Site {
  id: number;
  url: string;
}

// 'site-added' is a Pub/Sub topic for events when a new site is added to be monitored.
export const SiteAddedTopic = new Topic<Site>("site.added", {
  deliveryGuarantee: "at-least-once",
});

// AddParams are the parameters for adding a site to be monitored.
export interface AddParams {
  // URL is the URL of the site. If it doesn't contain a scheme
  // (like "http:" or "https:") it defaults to "https:".
  url: string;
}

// Add a new site to the list of monitored websites.
export const add = api(
  { expose: true, method: "POST", path: "/site" },
  async (params: AddParams): Promise<Site> => {
    const site = (await Sites().insert({ url: params.url }, "*"))[0];
    await SiteAddedTopic.publish(site);
    return site;
  },
);

// Get a site by id.
export const get = api(
  { expose: true, method: "GET", path: "/site/:id", auth: false },
  async ({ id }: { id: number }): Promise<Site> => {
    const site = await Sites().where("id", id).first();
    return site ?? Promise.reject(new Error("site not found"));
  },
);

// Delete a site by id.
export const del = api(
  { expose: true, method: "DELETE", path: "/site/:id" },
  async ({ id }: { id: number }): Promise<void> => {
    await Sites().where("id", id).delete();
  },
);

export interface ListResponse {
  sites: Site[]; // Sites is the list of monitored sites
}

// Lists the monitored websites.
export const list = api(
  { expose: true, method: "GET", path: "/site" },
  async (): Promise<ListResponse> => {
    const sites = await Sites().select();
    return { sites };
  },
);

// Define a 'site' database for storing which sites are being monitored
const SiteDB = new SQLDatabase("site", {
  migrations: "./migrations",
});

const orm = knex({
  client: "pg",
  connection: SiteDB.connectionString,
});

const Sites = () => orm<Site>("site");
