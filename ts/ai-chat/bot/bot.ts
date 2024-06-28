import { api } from "encore.dev/api";
import { APICallMeta, currentRequest } from "encore.dev";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { llm } from "~encore/clients";

import knex from "knex";
import { atob } from "node:buffer";
import { LLMType } from "../llm/service/clients";
import { baseURL } from "./proxy";

export interface Bot {
  id: number;
  name: string;
  prompt: string;
  profile: string;
  provider: LLMType;
  deleted: boolean;
}

export interface Avatar {
  bot_id: number;
  avatar: string;
}

export interface CreateParams {
  name: string;
  prompt: string;
  provider: LLMType;
}

// Create a new bot by sending a user provided prompt to the LLM provider.
export const create = api(
  { expose: false, method: "POST", path: "/bots" },
  async (params: CreateParams): Promise<Bot> => {
    const profile = await llm.generateBotProfile(params);
    const bot = await Bots()
      .insert({
        name: params.name,
        prompt: params.prompt,
        profile: profile.profile,
        provider: params.provider,
        deleted: false,
      })
      .returning("*");
    if (profile.avatar) {
      await Avatars().insert({
        bot_id: bot.at(0)?.id,
        avatar: profile.avatar,
      });
    }
    return bot[0] ?? Promise.reject(new Error("bot not found"));
  },
);

// Get a bot by id.
export const get = api(
  { expose: false, method: "GET", path: "/bots/:id", auth: false },
  async ({ id }: { id: number }): Promise<Bot> => {
    const bot = await Bots().where("id", id).first();
    return bot ?? Promise.reject(new Error("bot not found"));
  },
);

// Return the avatar image for a bot
export const avatarImage = api.raw(
  { expose: false, method: "GET", path: "/bots/:id/avatar", auth: false },
  async (req, resp) => {
    const { pathParams } = currentRequest() as APICallMeta;
    const avatar = await Avatars().where("bot_id", pathParams.id).first();
    if (!avatar) {
      resp.statusCode = 404;
      resp.end("not found");
      return;
    }
    resp.setHeader("Content-Type", "image/png");
    resp.end(atob(avatar.avatar), "binary");
  },
);

// Return an avatar
export const avatar = api(
  {
    expose: false,
    method: "GET",
    path: "/bots/:id/avatar/content",
    auth: false,
  },
  async ({ id }: { id: number }): Promise<Avatar> => {
    const avatar = await Avatars().where("bot_id", id).first();
    return avatar ?? (await Promise.reject(new Error("avatar not found")));
  },
);

// Delete a bot by id.
export const del = api(
  { expose: false, method: "DELETE", path: "/bots/:id" },
  async ({ id }: { id: number }): Promise<void> => {
    await Bots().where("id", id).delete();
  },
);

// Lists complete bot information
export const list = api(
  { expose: false, method: "GET", path: "/bots" },
  async ({ ids }: { ids?: string }): Promise<{ bots: Bot[] }> => {
    if (ids === undefined) {
      const bots = await Bots().select();
      return { bots };
    }
    const bots = await Bots().whereIn("id", ids.split(",")).select();
    return { bots };
  },
);

export interface BotInfo {
  id: number;
  name: string;
  avatar: string;
}

// Lists bot names, ids, and avatars
export const getInfo = api(
  { expose: false, method: "GET", path: "/bots/:id/info" },
  async ({ id }: { id: number }): Promise<{ info?: BotInfo }> => {
    return await Bots()
      .where("id", id)
      .first()
      .then(async (r) => {
        return {
          info: r
            ? {
                id: r.id,
                name: r.name,
                avatar: baseURL + `/bots/${r.id}/avatar`,
              }
            : undefined,
        };
      });
  },
);

const BotDB = new SQLDatabase("bot", {
  migrations: "./migrations",
});

const orm = knex({
  client: "pg",
  connection: BotDB.connectionString,
});

const Bots = () => orm<Bot>("bot");
const Avatars = () => orm<Avatar>("avatar");
