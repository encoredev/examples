import { describe, expect, test } from "vitest";
import { get, shorten } from "./url";

describe("Test shorten and retrieve", () => {
  test("it should work", async () => {
    const testURL = "https://github.com/encoredev/encore";
    const resp = await shorten({ url: testURL });
    expect(resp).toStrictEqual({ id: expect.any(String), url: testURL });

    const { id } = resp;
    const gotURL = await get({ id });
    expect(gotURL).toStrictEqual({ id, url: testURL });
  });
});
