import { describe, expect, test } from "vitest";
import { dummy, get, shorten } from "./url";

describe("shorten", () => {
  test("it should ...", async () => {
    const resp = dummy();
    const val = await Promise.resolve(123);
    expect(val).toBe(123);
  });
});
