import { useMutation } from "@tanstack/react-query";
import { type FormEvent, useState } from "react";
import Client, { type memory } from "@/lib/client";

const client = new Client(window.location.origin);

const PROFILES = {
  Infrastructure: [0.98, 0.02, 0, 0, 0, 0, 0, 0],
  "Data systems": [0.94, 0.06, 0, 0, 0, 0, 0, 0],
  Product: [0.05, 0.95, 0, 0, 0, 0, 0, 0],
  Customers: [0, 0, 1, 0, 0, 0, 0, 0],
} as const;

type Profile = keyof typeof PROFILES;
type Mode = "remember" | "recall" | "graph";

export default function App() {
  const [agentID, setAgentID] = useState("research-agent");
  const [mode, setMode] = useState<Mode>("remember");

  return (
    <div className="min-h-screen bg-white text-[#191919]">
      <header className="flex h-[73px] items-center justify-between border-b border-[#f0f0f0] px-6 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-lg bg-[#191919] text-sm font-semibold text-white">M</span>
          <span className="text-[17px] font-semibold">Agent Memory</span>
        </div>
        <label className="flex items-center gap-2 rounded-full bg-[#f7f7f7] px-4 py-2 text-sm">
          <span className="hidden text-[#777] sm:inline">Agent</span>
          <input className="w-28 bg-transparent font-medium outline-none sm:w-36" value={agentID} onChange={(event) => setAgentID(event.target.value)} aria-label="Agent ID" />
        </label>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-col items-center px-5 pb-16 pt-16 text-center sm:pt-20">
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.16em] text-[#777]">Encore × SurrealDB</p>
        <h1 className="max-w-4xl text-5xl font-bold leading-[0.98] tracking-[-0.045em] sm:text-7xl">Give your agent a memory.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#666] sm:text-xl">Store context asynchronously, recall it by meaning, and follow the relationships between memories.</p>

        <div className="mt-10 flex rounded-xl bg-[#f5f5f5] p-1.5">
          <ModeButton active={mode === "remember"} onClick={() => setMode("remember")}>Remember</ModeButton>
          <ModeButton active={mode === "recall"} onClick={() => setMode("recall")}>Recall</ModeButton>
          <ModeButton active={mode === "graph"} onClick={() => setMode("graph")}>Explore graph</ModeButton>
        </div>

        <div className="mt-6 w-full max-w-2xl text-left">
          {mode === "remember" && <RememberPanel agentID={agentID} onRecall={() => setMode("recall")} />}
          {mode === "recall" && <RecallPanel agentID={agentID} />}
          {mode === "graph" && <GraphPanel agentID={agentID} />}
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-2 text-sm text-[#777]">
          <FlowPill>Encore API</FlowPill><span aria-hidden="true">→</span><FlowPill>Pub/Sub</FlowPill><span aria-hidden="true">→</span><FlowPill>SurrealDB vector + graph</FlowPill>
        </div>
      </main>
    </div>
  );
}

function RememberPanel({ agentID, onRecall }: { agentID: string; onRecall: () => void }) {
  const [text, setText] = useState("SurrealDB stores vector and graph context for the agent.");
  const [entities, setEntities] = useState("SurrealDB, Encore");
  const [profile, setProfile] = useState<Profile>("Data systems");
  const remember = useMutation({
    mutationFn: () => client.memory.remember(agentID, {
      text: text.trim(),
      entities: entities.split(",").map((entity) => entity.trim()).filter(Boolean),
      embedding: [...PROFILES[profile]],
    }),
  });
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (agentID.trim() && text.trim()) remember.mutate();
  };

  return (
    <form className="rounded-2xl border border-[#e3e3e3] bg-[#fafafa] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.05)] sm:p-7" onSubmit={onSubmit}>
      <label className="text-sm font-semibold" htmlFor="memory-text">What should the agent remember?</label>
      <textarea id="memory-text" className="mt-3 min-h-32 w-full resize-none rounded-xl border border-[#dedede] bg-white p-4 text-base leading-7 outline-none transition focus:border-[#191919]" value={text} onChange={(event) => setText(event.target.value)} />
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold" htmlFor="entities">Related entities</label>
          <input id="entities" className="mt-2 h-11 w-full rounded-lg border border-[#dedede] bg-white px-3.5 outline-none transition focus:border-[#191919]" value={entities} onChange={(event) => setEntities(event.target.value)} placeholder="SurrealDB, Encore" />
          <p className="mt-1.5 text-xs text-[#888]">Separate names with commas.</p>
        </div>
        <ProfilePicker value={profile} onChange={setProfile} />
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#777]">Written asynchronously through Encore Pub/Sub.</p>
        <button className="rounded-lg bg-[#191919] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-50" disabled={!agentID.trim() || !text.trim() || remember.isPending}>{remember.isPending ? "Storing…" : "Store memory"}</button>
      </div>
      {remember.isSuccess && (
        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-[#dcebdd] bg-[#f3faf4] p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span>Memory queued with ID <code className="font-mono text-xs">{remember.data.memoryID}</code>.</span>
          <button type="button" className="font-semibold underline underline-offset-4" onClick={onRecall}>Recall it →</button>
        </div>
      )}
      {remember.isError && <ErrorMessage error={remember.error} />}
    </form>
  );
}

function RecallPanel({ agentID }: { agentID: string }) {
  const [profile, setProfile] = useState<Profile>("Infrastructure");
  const recall = useMutation({ mutationFn: () => client.memory.recall(agentID, { embedding: [...PROFILES[profile]], limit: 5 }) });
  return (
    <section className="rounded-2xl border border-[#e3e3e3] bg-[#fafafa] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.05)] sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <ProfilePicker value={profile} onChange={setProfile} />
        <button className="rounded-lg bg-[#191919] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black disabled:opacity-50" onClick={() => recall.mutate()} disabled={!agentID.trim() || recall.isPending}>{recall.isPending ? "Searching…" : "Recall memories"}</button>
      </div>
      {recall.isError && <ErrorMessage error={recall.error} />}
      {recall.isSuccess && recall.data.memories.length === 0 && <EmptyState>No matching memories yet. Store one first, then try again.</EmptyState>}
      {recall.data && recall.data.memories.length > 0 && <div className="mt-6 space-y-3 border-t border-[#e5e5e5] pt-5">{recall.data.memories.map((item) => <MemoryResult key={item.id} memory={item} />)}</div>}
    </section>
  );
}

function GraphPanel({ agentID }: { agentID: string }) {
  const [entity, setEntity] = useState("Encore");
  const lookup = useMutation({ mutationFn: () => client.memory.recallEntity(agentID, entity.trim()) });
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (agentID.trim() && entity.trim()) lookup.mutate();
  };
  return (
    <section className="rounded-2xl border border-[#e3e3e3] bg-[#fafafa] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.05)] sm:p-7">
      <form onSubmit={onSubmit}>
        <label className="text-sm font-semibold" htmlFor="entity">Find memories connected to an entity</label>
        <div className="mt-3 flex gap-2">
          <input id="entity" className="h-12 min-w-0 flex-1 rounded-lg border border-[#dedede] bg-white px-4 outline-none transition focus:border-[#191919]" value={entity} onChange={(event) => setEntity(event.target.value)} placeholder="Encore" />
          <button className="rounded-lg bg-[#191919] px-6 text-sm font-semibold text-white disabled:opacity-50" disabled={!agentID.trim() || !entity.trim() || lookup.isPending}>{lookup.isPending ? "Finding…" : "Find"}</button>
        </div>
      </form>
      {lookup.isError && <ErrorMessage error={lookup.error} />}
      {lookup.isSuccess && lookup.data.memories.length === 0 && <EmptyState>No memories are connected to this entity yet.</EmptyState>}
      {lookup.data && lookup.data.memories.length > 0 && <div className="mt-6 space-y-3 border-t border-[#e5e5e5] pt-5">{lookup.data.memories.map((item) => <article key={item.id} className="rounded-xl border border-[#e3e3e3] bg-white p-4"><p className="leading-7">{item.text}</p><p className="mt-2 truncate font-mono text-xs text-[#888]">{item.id}</p></article>)}</div>}
    </section>
  );
}

function ProfilePicker({ value, onChange }: { value: Profile; onChange: (profile: Profile) => void }) {
  return <fieldset><legend className="text-sm font-semibold">Meaning profile</legend><select className="mt-2 h-11 w-full rounded-lg border border-[#dedede] bg-white px-3.5 outline-none transition focus:border-[#191919]" value={value} onChange={(event) => onChange(event.target.value as Profile)}>{(Object.keys(PROFILES) as Profile[]).map((profile) => <option key={profile}>{profile}</option>)}</select></fieldset>;
}

function MemoryResult({ memory: item }: { memory: memory.RecalledMemory }) {
  const similarity = Math.max(0, 1 - item.distance);
  return <article className="rounded-xl border border-[#e3e3e3] bg-white p-4"><div className="mb-2 flex items-center justify-between gap-3"><div className="flex flex-wrap gap-1.5">{item.entities.map((entity) => <span key={entity} className="rounded-full bg-[#f1f1f1] px-2.5 py-1 text-xs font-medium">{entity}</span>)}</div><span className="whitespace-nowrap text-xs text-[#777]">{(similarity * 100).toFixed(1)}% match</span></div><p className="leading-7">{item.text}</p></article>;
}

function ModeButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return <button className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition sm:px-5 ${active ? "bg-white text-[#191919] shadow-sm" : "text-[#777] hover:text-[#191919]"}`} onClick={onClick}>{children}</button>;
}

function FlowPill({ children }: { children: string }) {
  return <span className="rounded-full border border-[#e4e4e4] bg-[#fafafa] px-3 py-1.5">{children}</span>;
}

function EmptyState({ children }: { children: string }) {
  return <p className="mt-6 rounded-xl border border-dashed border-[#d8d8d8] bg-white p-5 text-sm text-[#777]">{children}</p>;
}

function ErrorMessage({ error }: { error: Error }) {
  return <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error.message}</p>;
}
