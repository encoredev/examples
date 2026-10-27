// Turns real threads into replay recordings for the public demo.
//
//   node scripts/record.mjs <threadId> [<threadId> ...]
//
// Run the desk with a real key, start one thread per suggested prompt, wait
// for each to finish, then pass their ids here. It fetches each thread's
// recording from the running app and writes agent/recordings.ts. Only the
// first turn of each thread is kept, since replay matches on that prompt.

import { writeFileSync } from "node:fs";

const base = process.env.DESK_URL ?? "http://localhost:4000";
const ids = process.argv.slice(2);
if (ids.length === 0) {
  console.error("usage: node scripts/record.mjs <threadId> [<threadId> ...]");
  process.exit(1);
}

const recordings = [];
for (const id of ids) {
  const res = await fetch(`${base}/threads/${id}/recording`);
  if (!res.ok) throw new Error(`${id}: ${res.status} ${await res.text()}`);
  const [first] = (await res.json()).recordings;
  if (!first?.events.some((e) => e.kind === "done")) throw new Error(`${id}: turn has not finished`);
  recordings.push(first);
  console.log(`${id}: ${first.events.length} events, "${first.prompt}"`);
}

writeFileSync(
  new URL("../agent/recordings.ts", import.meta.url),
  `import type { Recording } from "./replay";

// Real runs captured with \`GET /threads/:id/recording\` by scripts/record.mjs.
// Replay mode (CursorApiKey = "replay") serves these. Regenerate, don't edit.
export const RECORDINGS: Recording[] = ${JSON.stringify(recordings, null, 2)};
`,
);
console.log(`wrote ${recordings.length} recordings to agent/recordings.ts`);
