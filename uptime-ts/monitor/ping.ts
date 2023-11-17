import { api } from "encore.dev/api";
import fetch from "node-fetch";

export interface PingParams {
  url: string;
}

export interface PingResponse {
  up: boolean;
}

export const ping = api<PingParams, PingResponse>(
  { path: "/ping/:url", method: "GET" },
  async ({ url }) => {
    if (!url.startsWith("http:") && !url.startsWith("https:")) {
      url = "https://" + url;
    }

    try {
      const resp = await fetch(url, { method: "GET" });
      const up = resp.status >= 200 && resp.status < 300;
      return { up };
    } catch (err) {
      return { up: false };
    }
  },
);
