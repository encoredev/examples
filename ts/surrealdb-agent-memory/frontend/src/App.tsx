import { useMutation } from "@tanstack/react-query";
import { type FormEvent, type ReactNode, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Client, { type memory } from "@/lib/client";

// The frontend is served by the Encore app itself, so the API lives on the same origin.
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
    <div className="mx-auto max-w-6xl px-5 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Agent Memory</h1>
        <p className="mt-1 text-muted-foreground">
          Durable vector and graph memory with Encore.ts and SurrealDB
        </p>
      </header>

      <div className="mb-6 max-w-sm">
        <Label htmlFor="agent-id">Agent ID</Label>
        <Input
          id="agent-id"
          value={agentID}
          onChange={(event) => setAgentID(event.target.value)}
          placeholder="research-agent"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr_18rem] lg:items-start">
        <RememberCard agentID={agentID} />
        <RecallCard agentID={agentID} />
        <EntityCard agentID={agentID} />
      </div>

      <Card className="mt-6 text-sm leading-relaxed">
        <CardContent className="grid gap-5 md:grid-cols-3">
          <Info title="Asynchronous writes">
            The API publishes each memory to Encore Pub/Sub, and a subscriber
            writes the memory and its entity relationships to SurrealDB.
          </Info>
          <Info title="Vector and graph recall">
            Recall uses SurrealDB vector similarity, while entity lookup follows
            the graph relationships created for each memory.
          </Info>
          <Info title="Local development">
            Open <a href="http://localhost:9400">localhost:9400</a> to inspect
            API calls, Pub/Sub messages, traces, and the application diagram.
          </Info>
        </CardContent>
      </Card>
    </div>
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Store a memory</CardTitle>
        <CardDescription>
          Queue a memory for the agent and connect it to the entities it
          mentions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <Label htmlFor="memory-text">Memory</Label>
            <Textarea
              id="memory-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="entities">Entities</Label>
            <Input
              id="entities"
              value={entities}
              onChange={(event) => setEntities(event.target.value)}
              placeholder="SurrealDB, Encore"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Separate entity names with commas.
            </p>
          </div>
          <ProfilePicker value={profile} onChange={setProfile} />
          <Button
            type="submit"
            disabled={!agentID.trim() || !text.trim() || remember.isPending}
          >
            {remember.isPending ? "Queuing…" : "Store memory"}
          </Button>
          {remember.isSuccess && (
            <Notice>
              Queued <InlineCode>{remember.data.memoryID}</InlineCode>. Pub/Sub
              will write it to SurrealDB momentarily.
            </Notice>
          )}
          {remember.isError && <ErrorMessage error={remember.error} />}
        </form>
      </CardContent>
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recall by similarity</CardTitle>
        <CardDescription>
          Search the agent's memories with an eight-dimensional demo embedding.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProfilePicker value={profile} onChange={setProfile} />
        <Button
          onClick={() => recall.mutate()}
          disabled={!agentID.trim() || recall.isPending}
        >
          {recall.isPending ? "Searching…" : "Recall memories"}
        </Button>
        {recall.isError && <ErrorMessage error={recall.error} />}
        {recall.isSuccess && recall.data.memories.length === 0 && (
          <EmptyState>
            No memories found. Store one and try again after the Pub/Sub event
            has been processed.
          </EmptyState>
        )}
        {recall.data?.memories.map((item) => (
          <MemoryResult key={item.id} memory={item} />
        ))}
      </CardContent>
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Follow the graph</CardTitle>
        <CardDescription>
          Find every memory connected to an entity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex gap-2" onSubmit={onSubmit}>
          <Input
            value={entity}
            onChange={(event) => setEntity(event.target.value)}
            aria-label="Entity name"
            placeholder="Encore"
          />
          <Button
            type="submit"
            disabled={!agentID.trim() || !entity.trim() || lookup.isPending}
          >
            Find
          </Button>
        </form>
        {lookup.isError && <ErrorMessage error={lookup.error} />}
        {lookup.isSuccess && lookup.data.memories.length === 0 && (
          <EmptyState>No memories mention this entity yet.</EmptyState>
        )}
        <ul className="mt-4 space-y-3">
          {lookup.data?.memories.map((item) => (
            <li key={item.id} className="rounded-lg border p-3">
              <p className="text-sm leading-relaxed">{item.text}</p>
              <p className="mt-2 truncate font-mono text-xs text-muted-foreground">
                {item.id}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
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
    <fieldset>
      <legend className="mb-2 text-sm font-medium">Embedding profile</legend>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(PROFILES) as Profile[]).map((profile) => (
          <Button
            key={profile}
            type="button"
            size="sm"
            variant={value === profile ? "default" : "outline"}
            onClick={() => onChange(profile)}
          >
            {profile}
          </Button>
        ))}
      </div>
      <p className="mt-2 break-all font-mono text-[11px] text-muted-foreground">
        [{PROFILES[value].join(", ")}]
      </p>
    </fieldset>
  );
}

function MemoryResult({ memory: item }: { memory: memory.RecalledMemory }) {
  const similarity = Math.max(0, 1 - item.distance);
  return (
    <article className="rounded-lg border p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {item.entities.map((entity) => (
            <Badge key={entity} variant="secondary">
              {entity}
            </Badge>
          ))}
        </div>
        <span className="whitespace-nowrap text-xs text-muted-foreground">
          {(similarity * 100).toFixed(1)}% match
        </span>
      </div>
      <p className="text-sm leading-relaxed">{item.text}</p>
    </article>
  );
}

function Label({
  children,
  htmlFor,
}: {
  children: ReactNode;
  htmlFor: string;
}) {
  return (
    <label className="mb-1.5 block text-sm font-medium" htmlFor={htmlFor}>
      {children}
    </label>
  );
}

function Info({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="text-muted-foreground [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4">
      <h2 className="mb-1.5 font-medium text-foreground">{title}</h2>
      <p>{children}</p>
    </section>
  );
}

function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs text-foreground">
      {children}
    </code>
  );
}

function Notice({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
      {children}
    </p>
  );
}

function ErrorMessage({ error }: { error: Error }) {
  return <p className="mt-3 text-sm text-destructive">{error.message}</p>;
}
