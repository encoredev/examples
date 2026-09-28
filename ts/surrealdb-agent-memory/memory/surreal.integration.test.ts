import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import type { Surreal } from "surrealdb";
import {
  connectSurreal,
  memoriesForEntity,
  pruneExpiredMemories,
  recallMemories,
  storeMemory,
} from "./surreal";

const testURL = process.env.SURREAL_TEST_URL;

describe.skipIf(!testURL)("SurrealDB memory store", () => {
  let db: Surreal;
  const agentID = `agent-${randomUUID()}`;
  const firstID = `m_${randomUUID().replaceAll("-", "")}`;

  beforeAll(async () => {
    db = await connectSurreal({
      url: testURL!,
      username: "root",
      password: "root",
    });
  });

  afterAll(async () => {
    if (db) await db.close();
  });

  test("stores retry-safe vector memories and graph relationships", async () => {
    const event = {
      memoryID: firstID,
      agentID,
      text: "Encore deploys the agent backend into the team's AWS account.",
      embedding: [1, 0, 0, 0, 0, 0, 0, 0],
      entities: [
        { name: "Encore", slug: "encore" },
        { name: "AWS", slug: "aws" },
      ],
    };

    await storeMemory(db, event);
    await storeMemory(db, event);
    await storeMemory(db, {
      memoryID: `m_${randomUUID().replaceAll("-", "")}`,
      agentID,
      text: "SurrealDB stores vector and graph context for the agent.",
      embedding: [0.9, 0.1, 0, 0, 0, 0, 0, 0],
      entities: [
        { name: "SurrealDB", slug: "surrealdb" },
        { name: "Encore", slug: "encore" },
      ],
    });

    const recalled = await recallMemories(
      db,
      agentID,
      [1, 0, 0, 0, 0, 0, 0, 0],
      2,
    );
    expect(recalled[0]?.id).toBe(`memory:${firstID}`);
    expect(recalled[0]?.entities).toContain("Encore");

    const encoreMemories = await memoriesForEntity(db, agentID, "encore");
    expect(encoreMemories).toHaveLength(2);
  });

  test("prunes expired memory records", async () => {
    const expiredID = `m_${randomUUID().replaceAll("-", "")}`;
    await storeMemory(db, {
      memoryID: expiredID,
      agentID,
      text: "This memory has expired.",
      embedding: [0, 1, 0, 0, 0, 0, 0, 0],
      entities: [],
      expiresAt: new Date("2020-01-01T00:00:00Z"),
    });

    expect(await pruneExpiredMemories(db)).toBeGreaterThanOrEqual(1);
    const [remaining] = await db
      .query("SELECT * FROM type::record('memory', $id)", { id: expiredID })
      .collect<[unknown[]]>();
    expect(remaining).toHaveLength(0);
  });
});
