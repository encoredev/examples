import { describe, expect, test } from "vitest";
import { ping } from "./ping";

describe("ping", () => {
  test.each([
    // Test both with and without "https://"
    { site: "google.com", expected: true },
    { site: "https://encore.dev", expected: true },

    // 4xx and 5xx should considered down.
    { site: "https://not-a-real-site.xyz", expected: false },
    // Invalid URLs should be considered down.
    { site: "invalid://scheme", expected: false },
  ])(
    `should verify that $site is ${"$expected" ? "up" : "down"}`,
    async ({ site, expected }) => {
      const resp = await ping({ url: site });
      expect(resp.up).toBe(expected);
    },
  );
});
