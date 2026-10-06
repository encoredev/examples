import { appMeta } from "encore.dev";
import { secret } from "encore.dev/config";
import { RecordId, Surreal } from "surrealdb";
import type { EntityMemory, MemoryEvent, RecalledMemory } from "./model";

const surrealURL = secret("SurrealDBURL");
const surrealToken = secret("SurrealDBToken");

interface ConnectionConfig {
  url: string;
  token?: string;
  username?: string;
  password?: string;
}

let connection: Promise<Surreal> | undefined;

function connectionConfig(): ConnectionConfig {
  const local = appMeta().environment.cloud === "local";
  if (local && !surrealURL()) {
    return {
      url: "http://127.0.0.1:8000",
      username: "root",
      password: "secret",
    };
  }
  return { url: surrealURL(), token: surrealToken() };
}

export function connectSurreal(config: ConnectionConfig): Promise<Surreal> {
  return openSurreal(config);
}

async function openSurreal(config: ConnectionConfig): Promise<Surreal> {
  const authentication =
    config.token ||
    (config.username && config.password
      ? { username: config.username, password: config.password }
      : undefined);
  if (!config.url || !authentication) {
    throw new Error("SurrealDB connection secrets are not configured");
  }

  const db = new Surreal();
  await db.connect(config.url, {
    authentication,
  });
  await db
    .query(
      `
      DEFINE NAMESPACE IF NOT EXISTS encore;
      USE NS encore;
      DEFINE DATABASE IF NOT EXISTS agent_memory;
    `,
    )
    .collect();
  await db.use({ namespace: "encore", database: "agent_memory" });
  await initializeSchema(db);
  return db;
}

export function getSurreal(): Promise<Surreal> {
  connection ??= openSurreal(connectionConfig()).catch((error) => {
    connection = undefined;
    throw error;
  });
  return connection;
}

export async function initializeSchema(db: Surreal): Promise<void> {
  await db
    .query(
      `
      DEFINE TABLE IF NOT EXISTS memory SCHEMAFULL;
      DEFINE FIELD IF NOT EXISTS agent_id ON memory TYPE string;
      DEFINE FIELD IF NOT EXISTS text ON memory TYPE string;
      DEFINE FIELD IF NOT EXISTS embedding ON memory TYPE array<float>
        ASSERT array::len($value) = 8;
      DEFINE FIELD IF NOT EXISTS embedding.* ON memory TYPE float;
      DEFINE FIELD IF NOT EXISTS created_at ON memory TYPE datetime DEFAULT time::now();
      DEFINE FIELD IF NOT EXISTS expires_at ON memory TYPE option<datetime>;
      DEFINE INDEX IF NOT EXISTS memory_agent ON memory FIELDS agent_id;
      DEFINE INDEX IF NOT EXISTS memory_embedding ON memory FIELDS embedding
        HNSW DIMENSION 8 DIST COSINE TYPE F32;

      DEFINE TABLE IF NOT EXISTS entity SCHEMAFULL;
      DEFINE FIELD IF NOT EXISTS name ON entity TYPE string;

      DEFINE TABLE IF NOT EXISTS mentions TYPE RELATION IN memory OUT entity SCHEMAFULL;
      DEFINE FIELD IF NOT EXISTS linked_at ON mentions TYPE datetime DEFAULT time::now();
    `,
    )
    .collect();
}

export async function storeMemory(
  db: Surreal,
  event: MemoryEvent,
): Promise<void> {
  const memory = new RecordId("memory", event.memoryID);
  await db
    .query(
      `
        BEGIN;
        UPSERT $memory CONTENT {
          agent_id: $agent_id,
          text: $text,
          embedding: $embedding,
          created_at: time::now(),
          expires_at: $expires_at
        };
        FOR $entity_data IN $entities {
          LET $entity = type::record("entity", $entity_data.slug);
          LET $edge = type::record("mentions", [$memory_id, $entity_data.slug]);
          UPSERT $entity MERGE { name: $entity_data.name };
          RELATE OR UPDATE $memory->$edge->$entity
            SET linked_at = time::now();
        };
        COMMIT;
      `,
      {
        memory,
        memory_id: event.memoryID,
        agent_id: event.agentID,
        text: event.text,
        embedding: event.embedding,
        entities: event.entities,
        expires_at: event.expiresAt,
      },
    )
    .collect();
}

interface RecallRow {
  id: string;
  text: string;
  distance: number;
  entities: string[];
  created_at: string;
  expires_at?: string;
}

export async function recallMemories(
  db: Surreal,
  agentID: string,
  embedding: number[],
  limit: number,
): Promise<RecalledMemory[]> {
  const [rows] = await db
    .query(
      `
        SELECT id, text, created_at, expires_at,
               vector::distance::knn() AS distance,
               ->mentions->entity.name AS entities
        FROM memory
        WHERE embedding <|10, 100|> $embedding
          AND agent_id = $agent_id
          AND (expires_at = NONE OR expires_at > time::now())
        ORDER BY distance
        LIMIT $limit;
      `,
      { agent_id: agentID, embedding, limit },
    )
    .json()
    .collect<[RecallRow[]]>();

  return rows.map((row) => ({
    id: row.id,
    text: row.text,
    distance: row.distance,
    entities: row.entities,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
  }));
}

interface EntityRow {
  memory_id: string;
  text: string;
  created_at: string;
}

export async function memoriesForEntity(
  db: Surreal,
  agentID: string,
  entitySlug: string,
): Promise<EntityMemory[]> {
  const [rows] = await db
    .query(
      `
        SELECT in.id AS memory_id, in.text AS text, in.created_at AS created_at
        FROM mentions
        WHERE out = type::record("entity", $entity_slug)
          AND in.agent_id = $agent_id
          AND (in.expires_at = NONE OR in.expires_at > time::now())
        ORDER BY created_at DESC;
      `,
      { agent_id: agentID, entity_slug: entitySlug },
    )
    .json()
    .collect<[EntityRow[]]>();

  return rows.map((row) => ({
    id: row.memory_id,
    text: row.text,
    createdAt: row.created_at,
  }));
}

export async function pruneExpiredMemories(db: Surreal): Promise<number> {
  const [deleted] = await db
    .query(
      `DELETE memory
       WHERE expires_at != NONE AND expires_at <= time::now()
       RETURN BEFORE;`,
    )
    .json()
    .collect<[unknown[]]>();
  return deleted.length;
}
