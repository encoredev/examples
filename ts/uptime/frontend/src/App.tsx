import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Client, { type monitor, type site } from "@/lib/client";

// The frontend is served by the Encore app itself, so the API lives on the same origin.
const client = new Client(window.location.origin);

// Suggestions shown when no sites are being monitored yet.
const SUGGESTIONS = ["encore.dev", "github.com", "this-site-is-down.invalid"];

export default function App() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Uptime Monitor
        </h1>
        <p className="mt-1 text-muted-foreground">
          Event-driven uptime monitoring with Encore.ts, Pub/Sub, and PostgreSQL
        </p>
      </header>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <main className="min-w-0 flex-1">
          <SiteList />
        </main>
        <Sidebar />
      </div>
    </div>
  );
}

function SiteList() {
  const queryClient = useQueryClient();

  const sites = useQuery({
    queryKey: ["sites"],
    queryFn: () => client.site.list(),
  });

  const status = useQuery({
    queryKey: ["status"],
    queryFn: () => client.monitor.status(),
    // Sites are checked in the background after they're added, so poll
    // quickly until every site has a status, then slow down.
    refetchInterval: (query) => {
      const checked = new Set(query.state.data?.sites.map((s) => s.id));
      const pending = sites.data?.sites.some((s) => !checked.has(s.id));
      return pending ? 1000 : 10_000;
    },
  });

  const refresh = () => queryClient.invalidateQueries();

  const checkAll = useMutation({
    mutationFn: () => client.monitor.checkAll(),
    onSettled: refresh,
  });

  if (sites.isPending) {
    return (
      <Card>
        <CardContent className="text-sm text-muted-foreground">
          Loading…
        </CardContent>
      </Card>
    );
  }
  if (sites.isError) {
    return (
      <Card>
        <CardContent>
          <ErrorMessage error={sites.error} />
        </CardContent>
      </Card>
    );
  }

  const list = sites.data.sites;
  const statuses = new Map(status.data?.sites.map((s) => [s.id, s]));
  const up = list.filter((s) => statuses.get(s.id)?.up === true).length;
  const down = list.filter((s) => statuses.get(s.id)?.up === false).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Monitored websites</CardTitle>
        <CardDescription>
          {list.length === 0
            ? "Add a website to start monitoring it."
            : `${list.length} ${list.length === 1 ? "site" : "sites"} · ${up} up · ${down} down`}
        </CardDescription>
        {list.length > 0 && (
          <CardAction>
            <Button
              variant="outline"
              onClick={() => checkAll.mutate()}
              disabled={checkAll.isPending}
            >
              {checkAll.isPending ? "Checking…" : "Check all now"}
            </Button>
          </CardAction>
        )}
      </CardHeader>

      <CardContent>
        <AddSiteForm />

        {list.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="mt-6 divide-y border-t">
            {list.map((s) => (
              <SiteRow key={s.id} site={s} status={statuses.get(s.id)} />
            ))}
          </ul>
        )}

        {checkAll.isError && <ErrorMessage error={checkAll.error} />}
      </CardContent>
    </Card>
  );
}

function AddSiteForm() {
  const queryClient = useQueryClient();
  const [url, setUrl] = useState("");

  const add = useMutation({
    mutationFn: (url: string) => client.site.add({ url }),
    onSuccess: () => {
      setUrl("");
      return queryClient.invalidateQueries();
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isValidURL(url)) add.mutate(url.trim());
  };

  const invalid = url.trim() !== "" && !isValidURL(url);

  return (
    <form onSubmit={onSubmit}>
      <div className="flex gap-2">
        <Input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="example.com"
          aria-label="Website URL"
          aria-invalid={invalid}
        />
        <Button type="submit" disabled={!isValidURL(url) || add.isPending}>
          {add.isPending ? "Adding…" : "Add website"}
        </Button>
      </div>
      {invalid && (
        <p className="mt-2 text-sm text-muted-foreground">
          Enter a domain like <InlineCode>example.com</InlineCode> or a full
          URL.
        </p>
      )}
      {add.isError && <ErrorMessage error={add.error} />}
    </form>
  );
}

function EmptyState() {
  const queryClient = useQueryClient();
  const add = useMutation({
    mutationFn: (url: string) => client.site.add({ url }),
    onSuccess: () => queryClient.invalidateQueries(),
  });

  return (
    <div className="mt-6 rounded-lg border border-dashed px-6 py-10 text-center">
      <p className="text-sm text-muted-foreground">
        Nothing to monitor yet. Add your own website above, or try one of these:
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {SUGGESTIONS.map((url) => (
          <Button
            key={url}
            variant="outline"
            size="sm"
            disabled={add.isPending}
            onClick={() => add.mutate(url)}
          >
            + {url}
          </Button>
        ))}
      </div>
      {add.isError && <ErrorMessage error={add.error} />}
    </div>
  );
}

function SiteRow({
  site,
  status,
}: {
  site: site.Site;
  status?: monitor.SiteStatus;
}) {
  const queryClient = useQueryClient();

  const check = useMutation({
    mutationFn: () => client.monitor.check(site.id),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["status"] }),
  });

  const remove = useMutation({
    mutationFn: () => client.site.del(site.id),
    onSettled: () => queryClient.invalidateQueries(),
  });

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4">
      <StatusBadge up={check.isPending ? undefined : status?.up} />
      <div className="min-w-0 flex-1">
        <a
          href={withScheme(site.url)}
          target="_blank"
          rel="noreferrer"
          className="block truncate font-medium underline-offset-4 hover:underline"
        >
          {site.url}
        </a>
        <p className="text-sm text-muted-foreground">
          {check.isPending || !status ? (
            "Checking…"
          ) : (
            <>
              Last checked <RelativeTime date={status.checkedAt} />
            </>
          )}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => check.mutate()}
          disabled={check.isPending}
        >
          Check
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => remove.mutate()}
          disabled={remove.isPending}
        >
          Remove<span className="sr-only"> {site.url}</span>
        </Button>
      </div>
    </li>
  );
}

function Sidebar() {
  return (
    <aside className="lg:sticky lg:top-6 lg:w-72 lg:shrink-0">
      <Card className="text-sm leading-relaxed">
        <CardContent className="space-y-5">
          <SidebarSection title="How it works">
            <p>
              Adding a site publishes an event to the{" "}
              <InlineCode>site.added</InlineCode> Pub/Sub topic. The{" "}
              <InlineCode>monitor</InlineCode> service subscribes, pings the
              site, and stores the result in its database.
            </p>
            <p className="mt-2">
              When a site goes down or comes back up,{" "}
              <InlineCode>monitor</InlineCode> publishes to{" "}
              <InlineCode>uptime-transition</InlineCode>, and the{" "}
              <InlineCode>slack</InlineCode> service sends a notification.
            </p>
          </SidebarSection>

          <SidebarSection title="Cron jobs">
            <p>
              In the cloud, a cron job checks every site each hour. Cron jobs
              don't run locally, so use <em>Check all now</em> to call the same
              endpoint.
            </p>
          </SidebarSection>

          <SidebarSection title="Slack notifications">
            <p>
              Set a Slack webhook URL to get notified when a site goes down:
            </p>
            <pre className="mt-2 rounded-md bg-muted p-3 font-mono text-xs whitespace-pre-wrap">
              encore secret set --type local SlackWebhookURL
            </pre>
          </SidebarSection>

          <SidebarSection title="Local dashboard">
            <p>
              Open <a href="http://localhost:9400">localhost:9400</a> to see
              traces of every request, including the Pub/Sub messages flowing
              between services, plus API docs and an architecture diagram.
            </p>
          </SidebarSection>

          <SidebarSection title="Next steps">
            <ul className="space-y-1">
              <li>
                <a href="https://encore.dev/docs/ts/tutorials/uptime">
                  Build this app step by step
                </a>
              </li>
              <li>
                <a href="https://encore.dev/docs/ts/primitives/pubsub">
                  Learn about Pub/Sub
                </a>
              </li>
              <li>
                <a href="https://encore.dev/docs/platform/deploy/deploying">
                  Deploy to the cloud
                </a>
              </li>
            </ul>
          </SidebarSection>
        </CardContent>
      </Card>
    </aside>
  );
}

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="text-muted-foreground [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4">
      <h3 className="mb-1.5 font-medium text-foreground">{title}</h3>
      {children}
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

function StatusBadge({ up }: { up?: boolean }) {
  if (up === true) {
    return (
      <Badge variant="outline" className="w-16">
        <span className="size-1.5 rounded-full bg-emerald-500" />
        Up
      </Badge>
    );
  }
  if (up === false) {
    return (
      <Badge variant="destructive" className="w-16">
        Down
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="w-16">
      …
    </Badge>
  );
}

function ErrorMessage({ error }: { error: Error }) {
  return <p className="mt-3 text-sm text-destructive">{error.message}</p>;
}

const relativeTime = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto",
});

// RelativeTime renders a timestamp like "5 seconds ago", updating every second.
function RelativeTime({ date }: { date: string }) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = Math.round((new Date(date).getTime() - now) / 1000);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) {
      return <>{relativeTime.format(Math.round(seconds / size), unit)}</>;
    }
  }
  return <>{relativeTime.format(Math.min(seconds, 0), "second")}</>;
}

// Mirrors the backend, which defaults to https:// when no scheme is given.
function withScheme(url: string) {
  return /^https?:\/\//.test(url) ? url : `https://${url}`;
}

function isValidURL(input: string) {
  try {
    const url = new URL(withScheme(input.trim()));
    return url.hostname.includes(".") && !url.hostname.endsWith(".");
  } catch {
    return false;
  }
}
