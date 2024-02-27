import { expect, describe, test } from "vitest";
import { check } from "./check";
import { site } from "~encore/clients";

describe("add", () => {
  test("it should add a site and check if it's up", async () => {
    const obj = await site.add({ url: "http://example.com" });
    const resp = await check({ siteID: obj.id });
    expect(resp.up).toBe(true);
  });
});
