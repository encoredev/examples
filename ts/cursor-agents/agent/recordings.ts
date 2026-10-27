import type { Recording } from "./replay";

// Real runs captured with `GET /threads/:id/recording` and pasted in here by
// scripts/record.mjs. Replay mode (CursorApiKey = "replay") serves these.
export const RECORDINGS: Recording[] = [];
