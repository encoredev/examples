import { useEffect, useRef, useState } from "react";
import { api, type Thread, type Turn, type TurnEvent } from "../lib/api";
import { Markdown } from "../lib/markdown";

// Renders one thread by replaying its event stream from the start and then
// following it live. The server persists every event, so reloading the page
// mid-turn picks up exactly where the agent is.

type Item =
  | { kind: "text"; text: string }
  | { kind: "thinking"; text: string }
  | {
      kind: "tool";
      callId: string;
      name: string;
      status: "running" | "completed" | "error";
      args: unknown;
      result?: unknown;
      error?: string;
      ms?: number;
    };

interface TurnView {
  id: string;
  prompt: string;
  items: Item[];
  done?: {
    status: string;
    error?: string;
    durationMs?: number;
    usage?: { inputTokens: number; outputTokens: number; totalTokens: number };
  };
}

function apply(turns: TurnView[], ev: TurnEvent): TurnView[] {
  const next = [...turns];
  let i = next.findIndex((t) => t.id === ev.turnId);
  if (i === -1) {
    next.push({ id: ev.turnId, prompt: "", items: [] });
    i = next.length - 1;
  }
  const turn = { ...next[i], items: [...next[i].items] };
  next[i] = turn;
  const last = turn.items[turn.items.length - 1];

  switch (ev.kind) {
    case "prompt":
      turn.prompt = ev.data.text;
      break;
    case "text":
    case "thinking":
      if (last?.kind === ev.kind) turn.items[turn.items.length - 1] = { ...last, text: last.text + ev.data.text };
      else turn.items.push({ kind: ev.kind, text: ev.data.text });
      break;
    case "tool": {
      const j = turn.items.findIndex((it) => it.kind === "tool" && it.callId === ev.data.callId);
      const item: Item = { kind: "tool", ...ev.data };
      if (j === -1) turn.items.push(item);
      else turn.items[j] = item;
      break;
    }
    case "done":
      turn.done = ev.data;
      break;
  }
  return next;
}

const argSummary = (args: unknown) => {
  if (!args || typeof args !== "object") return "";
  return Object.entries(args as Record<string, unknown>)
    .map(([k, v]) => `${k}: ${typeof v === "string" ? JSON.stringify(v.length > 40 ? v.slice(0, 40) + "…" : v) : JSON.stringify(v)}`)
    .join("  ");
};

function ToolCard({ item }: { item: Extract<Item, { kind: "tool" }> }) {
  return (
    <details className={`tool ${item.status}`}>
      <summary>
        {item.status === "running" ? (
          <span className="spinner" />
        ) : item.status === "error" ? (
          <span style={{ color: "var(--red)" }}>✕</span>
        ) : (
          <span style={{ color: "var(--green)" }}>✓</span>
        )}
        <span className="tool-name">{item.name}</span>
        <span className="tool-args">{argSummary(item.args)}</span>
        <span className="tool-ms">{item.ms !== undefined ? `${item.ms}ms` : ""}</span>
      </summary>
      <pre>
        {item.error
          ? item.error
          : item.result !== undefined
            ? JSON.stringify(item.result, null, 2)
            : JSON.stringify(item.args, null, 2)}
      </pre>
    </details>
  );
}

function Thinking({ text, live }: { text: string; live: boolean }) {
  return (
    <details className="thinking">
      <summary>
        {live ? <span className="spinner" /> : <span>◇</span>}
        {live ? "Thinking" : "Thought it through"}
      </summary>
      <div className="thinking-body">{text.trim()}</div>
    </details>
  );
}

export default function ThreadView(props: {
  thread: Thread;
  // Called for every tool call that arrives live (not on replay).
  onToolCall(): void;
}) {
  const { thread, onToolCall } = props;
  const [turns, setTurns] = useState<TurnView[]>([]);
  const [meta, setMeta] = useState<Turn[]>([]);
  const scroller = useRef<HTMLDivElement>(null);
  const pinned = useRef(true);
  const onTool = useRef(onToolCall);
  onTool.current = onToolCall;

  useEffect(() => {
    let cancelled = false;
    let close = () => {};
    setTurns([]);
    pinned.current = true;

    (async () => {
      const stream = await api.agent.stream(thread.id, { after: 0 });
      close = () => stream.close();
      if (cancelled) return close();
      for await (const ev of stream) {
        if (cancelled) break;
        setTurns((t) => apply(t, ev));
        const fresh = Date.now() - new Date(ev.at).getTime() < 8000;
        if (fresh && ev.kind === "tool" && ev.data.status === "running") onTool.current();
        if (ev.kind === "done") api.agent.get(thread.id).then((r) => !cancelled && setMeta(r.turns));
      }
    })().catch(() => {});

    api.agent.get(thread.id).then((r) => !cancelled && setMeta(r.turns));
    return () => {
      cancelled = true;
      close();
    };
  }, [thread.id]);

  // Follow the bottom while the agent writes, unless the reader scrolled up.
  useEffect(() => {
    const el = scroller.current;
    if (el && pinned.current) el.scrollTop = el.scrollHeight;
  }, [turns]);

  return (
    <div
      className="scroll"
      ref={scroller}
      onScroll={(e) => {
        const el = e.currentTarget;
        pinned.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
      }}
    >
      <div className="transcript">
        {turns.map((turn) => {
          const live = !turn.done;
          const lastItem = turn.items[turn.items.length - 1];
          const m = meta.find((x) => x.id === turn.id);
          return (
            <section className="turn" key={turn.id}>
              <div className="prompt">
                <div className="avatar">Y</div>
                <div className="prompt-text">{turn.prompt}</div>
              </div>
              <div className="agent-body">
                {turn.items.map((it, i) =>
                  it.kind === "text" ? (
                    <Markdown key={i} text={it.text} caret={live && it === lastItem} />
                  ) : it.kind === "thinking" ? (
                    <Thinking key={i} text={it.text} live={live && it === lastItem} />
                  ) : (
                    <ToolCard key={it.callId} item={it} />
                  ),
                )}
                {live && turn.items.length === 0 && (
                  <div className="thinking" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span className="spinner" /> Starting the agent
                  </div>
                )}
                {turn.done?.error && <div className="turn-error">{turn.done.error}</div>}
                {turn.done && (
                  <div className="turn-footer">
                    {m?.model && <span>{m.model}</span>}
                    {turn.done.durationMs !== undefined && <span>{(turn.done.durationMs / 1000).toFixed(1)}s</span>}
                    {turn.done.usage && <span>{turn.done.usage.totalTokens.toLocaleString()} tokens</span>}
                    <span>{turn.items.filter((x) => x.kind === "tool").length} tool calls</span>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
