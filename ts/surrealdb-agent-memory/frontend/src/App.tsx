import { useMutation } from "@tanstack/react-query";
import { type FormEvent, type ReactNode, useState } from "react";
import Client, { type memory } from "@/lib/client";

const client = new Client(window.location.origin);

const PROFILES = {
  Infrastructure: [0.98, 0.02, 0, 0, 0, 0, 0, 0],
  "Data systems": [0.94, 0.06, 0, 0, 0, 0, 0, 0],
  Product: [0.05, 0.95, 0, 0, 0, 0, 0, 0],
  Customers: [0, 0, 1, 0, 0, 0, 0, 0],
} as const;

type Profile = keyof typeof PROFILES;

export default function App() {
  const [agentID, setAgentID] = useState("research-agent");

  return (
    <main className="min-h-screen bg-[#EEEEE1] text-[#111]">
      <div className="mx-auto max-w-[960px] px-5 py-10">
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">
          SurrealDB + Encore
        </h1>
        <p className="mb-6 text-sm text-[#666]">
          Durable vector and graph memory for AI agents
        </p>

        <div className="flex items-start gap-8 max-md:flex-col">
          <div className="min-w-0 flex-1">
            <RememberCard agentID={agentID} />
            <RecallCard agentID={agentID} />
            <EntityCard agentID={agentID} />
          </div>

          <aside className="sticky top-10 w-[260px] shrink-0 border border-[#ccc] bg-white p-4 text-xs leading-[1.7] max-md:static max-md:w-full">
            <InfoHeading>Agent</InfoHeading>
            <p className="mb-2 text-[#555]">
              Memories are isolated by agent ID. Change it here to work with a
              separate memory space.
            </p>
            <input
              className={inputClass}
              value={agentID}
              onChange={(event) => setAgentID(event.target.value)}
              aria-label="Agent ID"
            />

            <InfoHeading>How it works</InfoHeading>
            <p className="mb-2 text-[#555]">
              The API publishes new memories to Encore Pub/Sub. A subscriber
              stores their text, vectors, and entity relationships in SurrealDB.
            </p>

            <InfoHeading>SurrealDB</InfoHeading>
            <ul className="mb-2 list-disc pl-3.5 text-[#555]">
              <li>Vector similarity search</li>
              <li>Graph relationships</li>
              <li>Memory retention</li>
            </ul>

            <InfoHeading>Encore integration</InfoHeading>
            <ul className="mb-2 list-disc pl-3.5 text-[#555]">
              <li>Type-safe APIs</li>
              <li>Pub/Sub ingestion</li>
              <li>Scheduled pruning</li>
            </ul>

            <InfoHeading>Local dashboard</InfoHeading>
            <p className="text-[#555]">
              Open{" "}
              <a className="text-[#4651FF] hover:underline" href="http://localhost:9400">
                localhost:9400
              </a>{" "}
              to inspect API calls, Pub/Sub messages, traces, and the application
              diagram.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

function RememberCard({ agentID }: { agentID: string }) {
  const [text, setText] = useState(
    "SurrealDB stores vector and graph context for the agent.",
  );
  const [entities, setEntities] = useState("SurrealDB, Encore");
  const [profile, setProfile] = useState<Profile>("Data systems");
  const remember = useMutation({
    mutationFn: () =>
      client.memory.remember(agentID, {
        text: text.trim(),
        entities: entities
          .split(",")
          .map((entity) => entity.trim())
          .filter(Boolean),
        embedding: [...PROFILES[profile]],
      }),
  });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (agentID.trim() && text.trim()) remember.mutate();
  };

  return (
    <Card title="Store memory">
      <Hint>
        New memories are accepted immediately and written to SurrealDB by a
        Pub/Sub subscriber.
      </Hint>
      <form onSubmit={onSubmit}>
        <Label htmlFor="memory-text">Memory</Label>
        <textarea
          id="memory-text"
          className={`${inputClass} min-h-24 resize-y`}
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <Label htmlFor="entities">Related entities</Label>
        <input
          id="entities"
          className={inputClass}
          value={entities}
          onChange={(event) => setEntities(event.target.value)}
          placeholder="SurrealDB, Encore"
        />
        <p className="mb-3 text-[11px] text-[#777]">
          Separate entity names with commas.
        </p>
        <ProfilePicker value={profile} onChange={setProfile} />
        <ActionButton
          disabled={!agentID.trim() || !text.trim() || remember.isPending}
        >
          {remember.isPending ? "Storing memory..." : "Store memory"}
        </ActionButton>
      </form>
      {remember.isSuccess && (
        <Status kind="success">
          Memory queued with ID <code>{remember.data.memoryID}</code>. It will be
          available for recall once the subscriber processes it.
        </Status>
      )}
      {remember.isError && <Status kind="error">{remember.error.message}</Status>}
    </Card>
  );
}

function RecallCard({ agentID }: { agentID: string }) {
  const [profile, setProfile] = useState<Profile>("Infrastructure");
  const recall = useMutation({
    mutationFn: () =>
      client.memory.recall(agentID, {
        embedding: [...PROFILES[profile]],
        limit: 5,
      }),
  });

  return (
    <Card title="Recall by similarity">
      <Hint>
        Choose a demo embedding profile to retrieve the closest memories using
        SurrealDB vector search.
      </Hint>
      <ProfilePicker value={profile} onChange={setProfile} />
      <ActionButton
        disabled={!agentID.trim() || recall.isPending}
        onClick={() => recall.mutate()}
      >
        {recall.isPending ? "Searching..." : "Recall memories"}
      </ActionButton>
      {recall.isError && <Status kind="error">{recall.error.message}</Status>}
      {recall.isSuccess && recall.data.memories.length === 0 && (
        <Status kind="neutral">No matching memories found.</Status>
      )}
      {recall.data?.memories.map((item) => (
        <MemoryResult key={item.id} memory={item} />
      ))}
    </Card>
  );
}

function EntityCard({ agentID }: { agentID: string }) {
  const [entity, setEntity] = useState("Encore");
  const lookup = useMutation({
    mutationFn: () => client.memory.recallEntity(agentID, entity.trim()),
  });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (agentID.trim() && entity.trim()) lookup.mutate();
  };

  return (
    <Card title="Follow the graph">
      <Hint>
        Look up an entity to follow its graph relationships to every memory that
        mentions it.
      </Hint>
      <form onSubmit={onSubmit}>
        <Label htmlFor="entity">Entity</Label>
        <input
          id="entity"
          className={inputClass}
          value={entity}
          onChange={(event) => setEntity(event.target.value)}
          placeholder="Encore"
        />
        <ActionButton
          disabled={!agentID.trim() || !entity.trim() || lookup.isPending}
        >
          {lookup.isPending ? "Following relationships..." : "Find memories"}
        </ActionButton>
      </form>
      {lookup.isError && <Status kind="error">{lookup.error.message}</Status>}
      {lookup.isSuccess && lookup.data.memories.length === 0 && (
        <Status kind="neutral">No memories mention this entity yet.</Status>
      )}
      {lookup.data?.memories.map((item) => (
        <div className="mt-2 border border-[#ccc] bg-white p-3 text-xs" key={item.id}>
          <p className="text-[13px] leading-5">{item.text}</p>
          <p className="mt-1 truncate font-mono text-[10px] text-[#777]">{item.id}</p>
        </div>
      ))}
    </Card>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-4 border border-[#ccc] bg-white p-5">
      <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.05em]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Hint({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 border border-[#ccc] bg-white px-3 py-2.5 text-xs leading-[1.5] text-[#555]">
      {children}
    </p>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label className="mb-1 block text-[13px] font-medium" htmlFor={htmlFor}>
      {children}
    </label>
  );
}

function ProfilePicker({
  value,
  onChange,
}: {
  value: Profile;
  onChange: (profile: Profile) => void;
}) {
  return (
    <div>
      <Label htmlFor={`profile-${value.replaceAll(" ", "-")}`}>
        Embedding profile
      </Label>
      <select
        id={`profile-${value.replaceAll(" ", "-")}`}
        className={inputClass}
        value={value}
        onChange={(event) => onChange(event.target.value as Profile)}
      >
        {(Object.keys(PROFILES) as Profile[]).map((profile) => (
          <option key={profile}>{profile}</option>
        ))}
      </select>
    </div>
  );
}

function ActionButton({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className="w-full bg-[#111] px-4 py-2 text-[13px] font-medium text-[#EEEEE1] hover:bg-[#333] disabled:cursor-not-allowed disabled:bg-[#999]"
      disabled={disabled}
      onClick={onClick}
      type={onClick ? "button" : "submit"}
    >
      {children}
    </button>
  );
}

function Status({
  children,
  kind,
}: {
  children: ReactNode;
  kind: "success" | "error" | "neutral";
}) {
  const colors = {
    success: "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]",
    error: "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]",
    neutral: "border-[#ccc] bg-white text-[#555]",
  };
  return (
    <p className={`mt-2.5 border p-2.5 text-xs ${colors[kind]}`}>
      {children}
    </p>
  );
}

function MemoryResult({ memory: item }: { memory: memory.RecalledMemory }) {
  const similarity = Math.max(0, 1 - item.distance);
  return (
    <article className="mt-2 border border-[#ccc] bg-white p-3">
      <div className="mb-1.5 flex items-center justify-between gap-3 text-[10px] text-[#666]">
        <span>{item.entities.join(" · ") || "No entities"}</span>
        <span className="whitespace-nowrap">{(similarity * 100).toFixed(1)}% match</span>
      </div>
      <p className="text-[13px] leading-5">{item.text}</p>
    </article>
  );
}

function InfoHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-1.5 mt-3.5 text-[11px] font-semibold uppercase tracking-[0.06em] first:mt-0">
      {children}
    </h2>
  );
}

const inputClass =
  "mb-1.5 w-full border border-[#ccc] bg-white px-2.5 py-[7px] text-[13px] font-[inherit] outline-none focus:border-[#111]";
