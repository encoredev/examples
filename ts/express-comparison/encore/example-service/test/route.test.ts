import { describe, expect, test } from "vitest";
import { dynamicPathParamExample } from "../get-request-example";

// This test suite demonstrates how to test an Encore route.
// Run tests using the `encore test` command.
describe("Encore app", () => {
  test("should respond with a greeting message", async () => {
    const resp = await dynamicPathParamExample({ name: "world" });
    expect(resp.message).toBe("Hello world!");
  });
});
