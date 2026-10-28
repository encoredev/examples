import type { RefObject } from "react";
import BlockField, { type BlockFieldHandle } from "./BlockField";
import { ago, type Thread } from "../lib/api";
import type { agent } from "../lib/client";

// What this app runs on. Every row is declared in the code and provisioned by
// Encore in your own AWS or GCP account; nothing here is a hosted service.
const INFRA = [
  { name: "agent", kind: "Service" },
  { name: "notes", kind: "Service" },
  { name: "agent db", kind: "Postgres" },
  { name: "notes db", kind: "Postgres" },
];

// A single isometric cube, the same three tones as the field.
const Cube = () => (
  <svg width="14" height="14" viewBox="-12 -12 24 24" aria-hidden="true">
    <polygon points="-10,-3 0,2 0,11 -10,6" fill="#3e3e3c" />
    <polygon points="0,2 10,-3 10,6 0,11" fill="#63635e" />
    <polygon points="0,2 10,-3 0,-8 -10,-3" fill="#9a9a92" />
  </svg>
);

const fmt = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e4 ? `${Math.round(n / 1e3)}k` : String(n));

export default function Sidebar(props: {
  field: RefObject<BlockFieldHandle>;
  threads: Thread[];
  stats: agent.ChatStats | null;
  activeId: string | null;
  onSelect(id: string | null): void;
}) {
  const { field, threads, stats, activeId, onSelect } = props;
  return (
    <aside className="sidebar">
      <div className="sidebar-hero">
        <BlockField ref={field} />
        <div className="brand">
          <span className="brand-name">Notes Agent</span>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat-value">{stats ? fmt(stats.threads) : "–"}</div>
          <div className="stat-label">threads</div>
        </div>
        <div className="stat">
          <div className="stat-value">{stats ? fmt(stats.toolCalls) : "–"}</div>
          <div className="stat-label">tool calls</div>
        </div>
        <div className="stat">
          <div className="stat-value">{stats ? fmt(stats.totalTokens) : "–"}</div>
          <div className="stat-label">tokens</div>
        </div>
      </div>

      <button className="new-thread" onClick={() => onSelect(null)}>
        New thread <span className="kbd">⌘K</span>
      </button>

      <div className="section-label">Threads</div>
      <div className="threads">
        {threads.length === 0 && <div className="empty-threads">Nothing yet. Ask the agent something.</div>}
        {threads.map((t) => (
          <button key={t.id} className={`thread ${t.id === activeId ? "active" : ""}`} onClick={() => onSelect(t.id)}>
            <span className="thread-meta" style={{ width: 18, textAlign: "center" }}>›</span>
            <span className="thread-title">{t.title}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="thread-meta">{ago(t.updatedAt)}</span>
              <span className={`dot ${t.status ?? ""}`} />
            </span>
          </button>
        ))}
      </div>

      <div className="infra">
        <div className="section-label">Infrastructure</div>
        {INFRA.map((r) => (
          <div key={r.name} className="infra-row">
            <Cube />
            <span className="infra-name">{r.name}</span>
            <span className="infra-kind">{r.kind}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
