import type { SDKCustomToolContext, SDKJsonValue } from "@cursor/sdk";
import { db } from "./db";
import { RECORDINGS } from "./recordings";
import { record, type TurnEventKind } from "./runtime";
import { deskTools } from "./tools";

// Replay mode, for the public demo.
//
// A recording is the event log of a real run: the agent's text and thinking,
// and every tool call with its arguments, each stamped with its offset from
// the start of the turn. Replaying writes the same events back at the same
// pace, so the UI can't tell the difference.
//
// The words are recorded but the tools are not: each tool call runs again for
// real with the recorded arguments, so updates land on the incidents and the
// results reflect the current data.

export interface RecordedEvent {
  kind: Exclude<TurnEventKind, "prompt">;
  data: any;
  ms: number;
}

export interface Recording {
  prompt: string;
  events: RecordedEvent[];
}

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export const findRecording = (prompt: string) =>
  RECORDINGS.find((r) => normalize(r.prompt) === normalize(prompt)) ?? null;

export const recordedPrompts = () => RECORDINGS.map((r) => r.prompt);

// Long pauses (the model thinking between steps) are trimmed so a replay
// keeps moving, but the rhythm stays.
const MAX_GAP_MS = 1500;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function replayTurn(threadId: string, turnId: string, recording: Recording) {
  const started = Date.now();
  let last = 0;
  const results = new Map<string, SDKJsonValue>();

  for (const ev of recording.events) {
    await sleep(Math.min(MAX_GAP_MS, Math.max(0, ev.ms - last)));
    last = ev.ms;

    if (ev.kind !== "tool") {
      if (ev.kind === "done") {
        await db.exec`
          UPDATE turns SET status = 'finished', usage = ${JSON.stringify(ev.data.usage ?? null)}::text::jsonb,
            duration_ms = ${Date.now() - started}
          WHERE id = ${turnId}`;
        await record(threadId, turnId, "done", { ...ev.data, durationMs: Date.now() - started });
      } else {
        await record(threadId, turnId, ev.kind, ev.data);
      }
      continue;
    }

    const { callId, name, args, status } = ev.data;
    if (status === "running") {
      await record(threadId, turnId, "tool", { callId, name, status, args });
      const t0 = Date.now();
      const tool = deskTools[name];
      try {
        const result = (await tool.execute(args, { toolCallId: callId } as SDKCustomToolContext)) as SDKJsonValue;
        results.set(callId, result);
        await record(threadId, turnId, "tool", { callId, name, status: "completed", args, result, ms: Date.now() - t0 });
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err);
        await record(threadId, turnId, "tool", { callId, name, status: "error", args, error });
      }
    }
    // The recorded completion is dropped; the real one was written above.
  }

  // A recording cut short still ends cleanly.
  await db.exec`UPDATE turns SET status = 'finished' WHERE id = ${turnId} AND status = 'running'`;
}
