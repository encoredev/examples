import { describe, expect, test } from "vitest";
import { normalizeEntities, validateEmbedding } from "./model";

describe("agent memory input", () => {
  test("normalizes and deduplicates graph entities", () => {
    expect(
      normalizeEntities(["Encore", "SurrealDB", " Encore ", "AWS / GCP"]),
    ).toEqual([
      { slug: "encore", name: "Encore" },
      { slug: "surrealdb", name: "SurrealDB" },
      { slug: "aws-gcp", name: "AWS / GCP" },
    ]);
  });

  test("accepts the example embedding dimensions", () => {
    expect(() => validateEmbedding([1, 0, 0, 0, 0, 0, 0, 0])).not.toThrow();
  });

  test.each([
    [1, 2],
    [1, 0, 0, 0, 0, 0, 0, Number.NaN],
  ])("rejects an invalid embedding", (...embedding) => {
    expect(() => validateEmbedding(embedding)).toThrow(
      "embedding must contain 8 finite numbers",
    );
  });
});
