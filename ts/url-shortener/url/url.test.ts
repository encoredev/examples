import { describe, expect, test } from "vitest";
import { get, shorten } from "./url";

describe("shorten", () => {
  test("getting a shortened url should give back the original", async () => {
    const resp = await shorten({ url: "https://example.com" });
    const url = await get({ id: resp.id });
    expect(url.url).toBe("https://example.com");
  });
});
