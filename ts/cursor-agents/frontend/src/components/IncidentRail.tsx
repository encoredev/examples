import { useEffect, useState } from "react";
import { ago, api, type Thread } from "../lib/api";
import type { incidents } from "../lib/client";

// The system the agent works on, polled so its updates show up as they land.
// Opening a test incident goes through the real path: the incidents service
// publishes to Pub/Sub, the agent service's subscription starts a triage run.

type Detail = { incident: incidents.Incident; updates: incidents.IncidentUpdate[] };

const DRILLS = [
  {
    title: "Webhook deliveries failing for Shopify partners",
    service: "notify",
    severity: "sev2" as const,
    summary: "Partners report missing order webhooks since this morning. Retries are piling up.",
  },
  {
    title: "Search p95 latency doubled",
    service: "search",
    severity: "sev3" as const,
    summary: "Dashboards show search p95 climbing after the last deploy. No customer reports yet.",
  },
  {
    title: "Checkout errors on Apple Pay",
    service: "checkout",
    severity: "sev1" as const,
    summary: "Spike in 5xx on POST /checkout for Apple Pay sessions. Revenue impact likely.",
  },
];

export default function IncidentRail(props: {
  // Opening incidents and asking for triage need a live agent.
  live: boolean;
  threads: Thread[];
  onOpenThread(id: string): void;
  onAwaitTriage(incidentId: number): void;
  onAsk(prompt: string): void;
}) {
  const { live, threads, onOpenThread, onAwaitTriage, onAsk } = props;
  const [items, setItems] = useState<Detail[]>([]);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const { incidents: list } = await api.incidents.list({});
      const details = await Promise.all(list.map((i) => api.incidents.get(i.id)));
      if (alive) setItems(details);
    };
    load().catch(() => {});
    const t = window.setInterval(() => load().catch(() => {}), 2500);
    return () => {
      alive = false;
      window.clearInterval(t);
    };
  }, []);

  const openDrill = async () => {
    setOpening(true);
    try {
      const drill = DRILLS[Math.floor(Math.random() * DRILLS.length)];
      const incident = await api.incidents.open(drill);
      onAwaitTriage(incident.id);
    } finally {
      setOpening(false);
    }
  };

  return (
    <aside className="rail">
      <div className="rail-head">
        <span className="rail-title">Incidents</span>
        {live && (
          <button className="ghost" onClick={openDrill} disabled={opening}>
            {opening ? "Opening…" : "Open a test incident"}
          </button>
        )}
      </div>
      <div className="incidents">
        {items.map(({ incident: i, updates }) => {
          const triage = threads.find((t) => t.incidentId === i.id);
          return (
            <div key={i.id} className={`incident ${i.status}`}>
              <div className="incident-head">
                <span className={`sev ${i.severity}`}>{i.severity}</span>
                <span className="thread-meta">#{i.id}</span>
                <span className={`status ${i.status}`}>{i.status}</span>
              </div>
              <div className="incident-title">{i.title}</div>
              <div className="incident-service">
                {i.service} · opened {ago(i.openedAt)} ago
              </div>
              {i.status !== "resolved" && updates.length > 0 && (
                <div className="updates">
                  {updates.slice(-2).map((u) => (
                    <div key={u.id} className={`update ${u.author === "on-call agent" ? "agent" : ""}`}>
                      <span className="update-author">
                        {u.author} · {ago(u.createdAt)}
                      </span>
                      {u.body}
                    </div>
                  ))}
                </div>
              )}
              {i.status !== "resolved" && triage && (
                <button className="triage-link" onClick={() => onOpenThread(triage.id)}>
                  View triage →
                </button>
              )}
              {i.status !== "resolved" && !triage && live && (
                <button className="triage-link" onClick={() => onAsk(`Triage incident #${i.id}.`)}>
                  Ask the agent to triage →
                </button>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
