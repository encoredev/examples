import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type ComponentProps,
  type FormEvent,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import Client, { type monitor, type site } from "./lib/client";

// The frontend is served by the Encore app itself, so the API lives on the same origin.
const client = new Client(window.location.origin);

// Suggestions shown when no sites are being monitored yet.
const SUGGESTIONS = ["encore.dev", "github.com", "this-site-is-down.invalid"];

export default function App() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold">Uptime Monitor</h1>
        <p className="mt-1 text-neutral-600">
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
    return <Card>Loading…</Card>;
  }
  if (sites.isError) {
    return (
      <Card>
        <ErrorMessage error={sites.error} />
      </Card>
    );
  }

  const list = sites.data.sites;
  const statuses = new Map(status.data?.sites.map((s) => [s.id, s]));
  const up = list.filter((s) => statuses.get(s.id)?.up === true).length;
  const down = list.filter((s) => statuses.get(s.id)?.up === false).length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Monitored websites</h2>
          <p className="mt-1 text-sm text-neutral-600">
            {list.length === 0
              ? "Add a website to start monitoring it."
              : `${list.length} ${list.length === 1 ? "site" : "sites"} · ${up} up · ${down} down`}
          </p>
        </div>
        {list.length > 0 && (
          <Button
            variant="secondary"
            onClick={() => checkAll.mutate()}
            disabled={checkAll.isPending}
          >
            {checkAll.isPending ? "Checking…" : "Check all now"}
          </Button>
        )}
      </div>

      <AddSiteForm />

      {list.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="mt-6 divide-y divide-neutral-200 border-t border-neutral-200">
          {list.map((s) => (
            <SiteRow key={s.id} site={s} status={statuses.get(s.id)} />
          ))}
        </ul>
      )}

      {checkAll.isError && <ErrorMessage error={checkAll.error} />}
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
    <form onSubmit={onSubmit} className="mt-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="example.com"
          aria-label="Website URL"
          aria-invalid={invalid}
          className="min-w-0 flex-1 border border-line bg-white px-3 py-2 text-sm outline-none focus:border-ink"
        />
        <Button type="submit" disabled={!isValidURL(url) || add.isPending}>
          {add.isPending ? "Adding…" : "Add website"}
        </Button>
      </div>
      {invalid && (
        <p className="mt-2 text-sm text-neutral-500">
          Enter a domain like <code>example.com</code> or a full URL.
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
    <div className="mt-6 border border-dashed border-line px-6 py-10 text-center">
      <p className="text-sm text-neutral-600">
        Nothing to monitor yet. Add your own website above, or try one of these:
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {SUGGESTIONS.map((url) => (
          <Button
            key={url}
            variant="secondary"
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
          className="block truncate font-medium hover:text-accent"
        >
          {site.url}
        </a>
        <p className="text-sm text-neutral-500">
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
          variant="secondary"
          onClick={() => check.mutate()}
          disabled={check.isPending}
        >
          Check
        </Button>
        <Button
          variant="secondary"
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
    <aside className="border border-line bg-white p-5 text-sm leading-relaxed text-neutral-700 lg:sticky lg:top-6 lg:w-72 lg:shrink-0">
      <SidebarSection title="How it works">
        <p>
          Adding a site publishes an event to the <code>site.added</code>{" "}
          Pub/Sub topic. The <code>monitor</code> service subscribes, pings the
          site, and stores the result in its database.
        </p>
        <p className="mt-2">
          When a site goes down or comes back up, <code>monitor</code> publishes
          to <code>uptime-transition</code>, and the <code>slack</code> service
          sends a notification.
        </p>
      </SidebarSection>

      <SidebarSection title="Cron jobs">
        <p>
          In the cloud, a cron job checks every site each hour. Cron jobs don't
          run locally, so use <em>Check all now</em> to call the same endpoint.
        </p>
      </SidebarSection>

      <SidebarSection title="Slack notifications">
        <p>Set a Slack webhook URL to get notified when a site goes down:</p>
        <pre className="mt-2 bg-paper p-2 text-xs whitespace-pre-wrap">
          encore secret set --type local SlackWebhookURL
        </pre>
      </SidebarSection>

      <SidebarSection title="Local dashboard">
        <p>
          Open <a href="http://localhost:9400">localhost:9400</a> to see traces
          of every request, including the Pub/Sub messages flowing between
          services, plus API docs and an architecture diagram.
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
    <section className="mb-5 last:mb-0 [&_a]:text-accent [&_a:hover]:underline [&_code]:bg-paper [&_code]:px-1 [&_code]:text-xs">
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-ink">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Card({ children }: { children: ReactNode }) {
  return <div className="border border-line bg-white p-6">{children}</div>;
}

function Button({
  variant = "primary",
  ...props
}: ComponentProps<"button"> & { variant?: "primary" | "secondary" }) {
  const styles =
    variant === "primary"
      ? "bg-ink text-paper enabled:hover:bg-neutral-700"
      : "border border-line bg-white enabled:hover:border-neutral-500";
  return (
    <button
      type="button"
      className={`px-4 py-2 text-sm font-medium whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50 ${styles}`}
      {...props}
    />
  );
}

function StatusBadge({ up }: { up?: boolean }) {
  const [label, styles] =
    up === true
      ? ["Up", "bg-emerald-100 text-emerald-800"]
      : up === false
        ? ["Down", "bg-red-100 text-red-800"]
        : ["…", "bg-neutral-100 text-neutral-500"];
  return (
    <span
      className={`inline-flex w-14 justify-center py-1 text-xs font-semibold uppercase tracking-wide ${styles}`}
    >
      {label}
    </span>
  );
}

function ErrorMessage({ error }: { error: Error }) {
  return <p className="mt-3 text-sm text-red-700">{error.message}</p>;
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
