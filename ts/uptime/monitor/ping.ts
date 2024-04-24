// Service monitor checks if a website is up or down.
import { api } from "encore.dev/api";

export interface PingParams {
  url: string;
}

export interface PingResponse {
  up: boolean;
}

// Ping pings a specific site and determines whether it's up or down right now.
export const ping = api<PingParams, PingResponse>(
  { expose: true, path: "/ping/:url", method: "GET" },
  async ({ url }) => {
    // If the url does not start with "http:" or "https:", default to "https:".
    if (!url.startsWith("http:") && !url.startsWith("https:")) {
      url = "https://" + url;
    }

    try {
      // Make an HTTP request to check if it's up.
      const resp = await fetch(url, { method: "GET" });
      // 2xx and 3xx status codes are considered up
      const up = resp.status >= 200 && resp.status < 300;
      return { up };
    } catch (err) {
      return { up: false };
    }
  },
);
