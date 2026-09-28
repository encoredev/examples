import { randomUUID } from "node:crypto";
import { api, APIError } from "encore.dev/api";
import { CronJob } from "encore.dev/cron";
import { Subscription, Topic } from "encore.dev/pubsub";
import {
  normalizeEntities,
  validateEmbedding,
  type EntityMemory,
  type MemoryEvent,
  type RecalledMemory,
} from "./model";
import {
  getSurreal,
  memoriesForEntity,
  pruneExpiredMemories,
  recallMemories,
  storeMemory,
} from "./surreal";

const memoriesToStore = new Topic<MemoryEvent>("memories-to-store", {
  deliveryGuarantee: "at-least-once",
});

export interface RememberParams {
  agentID: string;
  text: string;
  embedding: number[];
  entities?: string[];
  expiresAt?: Date;
}

export const remember = api(
  { expose: true, method: "POST", path: "/agents/:agentID/memories" },
  async (
    params: RememberParams,
  ): Promise<{ memoryID: string; status: string }> => {
    try {
      validateEmbedding(params.embedding);
    } catch (error) {
      throw APIError.invalidArgument((error as Error).message);
    }
    if (!params.text.trim()) {
      throw APIError.invalidArgument("text cannot be empty");
    }

    const memoryID = `m_${randomUUID().replaceAll("-", "")}`;
    await memoriesToStore.publish({
      memoryID,
      agentID: params.agentID,
      text: params.text.trim(),
      embedding: params.embedding,
      entities: normalizeEntities(params.entities ?? []),
      expiresAt: params.expiresAt,
    });
    return { memoryID, status: "queued" };
  },
);

new Subscription(memoriesToStore, "store-memory-in-surrealdb", {
  handler: async (event) => storeMemory(await getSurreal(), event),
});

export interface RecallParams {
  agentID: string;
  embedding: number[];
  limit?: number;
}

export const recall = api(
  { expose: true, method: "POST", path: "/agents/:agentID/recall" },
  async (params: RecallParams): Promise<{ memories: RecalledMemory[] }> => {
    try {
      validateEmbedding(params.embedding);
    } catch (error) {
      throw APIError.invalidArgument((error as Error).message);
    }
    const limit = Math.min(Math.max(params.limit ?? 5, 1), 10);
    return {
      memories: await recallMemories(
        await getSurreal(),
        params.agentID,
        params.embedding,
        limit,
      ),
    };
  },
);

export const recallEntity = api(
  {
    expose: true,
    method: "GET",
    path: "/agents/:agentID/entities/:entity/memories",
  },
  async ({
    agentID,
    entity,
  }: {
    agentID: string;
    entity: string;
  }): Promise<{ memories: EntityMemory[] }> => {
    const normalized = normalizeEntities([entity]);
    if (!normalized[0])
      throw APIError.invalidArgument("entity cannot be empty");
    return {
      memories: await memoriesForEntity(
        await getSurreal(),
        agentID,
        normalized[0].slug,
      ),
    };
  },
);

export const pruneExpired = api(
  { expose: true, method: "POST", path: "/memories/prune" },
  async (): Promise<{ deleted: number }> => ({
    deleted: await pruneExpiredMemories(await getSurreal()),
  }),
);

new CronJob("prune-agent-memory", {
  title: "Remove expired agent memories",
  every: "24h",
  endpoint: pruneExpired,
});
