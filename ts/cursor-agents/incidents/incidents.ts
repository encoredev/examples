import { api, APIError, Query } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { Topic } from "encore.dev/pubsub";

const db = new SQLDatabase("incidents", { migrations: "./migrations" });

export type Severity = "sev1" | "sev2" | "sev3";
export type Status = "open" | "investigating" | "mitigated" | "resolved";

export interface Incident {
  id: number;
  title: string;
  service: string;
  severity: Severity;
  status: Status;
  summary: string;
  openedAt: Date;
  updatedAt: Date;
}

export interface IncidentUpdate {
  id: number;
  author: string;
  body: string;
  createdAt: Date;
}

export interface Deploy {
  id: number;
  service: string;
  commitSha: string;
  message: string;
  author: string;
  deployedAt: Date;
}

export interface MetricPoint {
  minute: Date;
  p95Ms: number;
  errorRate: number;
  rps: number;
}

// Published whenever an incident is opened. The agent service subscribes and
// starts a triage run, so nobody has to page the agent by hand.
export interface IncidentOpenedEvent {
  incidentId: number;
}

export const incidentOpened = new Topic<IncidentOpenedEvent>("incident-opened", {
  deliveryGuarantee: "at-least-once",
});

interface IncidentRow {
  id: number;
  title: string;
  service: string;
  severity: Severity;
  status: Status;
  summary: string;
  opened_at: Date;
  updated_at: Date;
}

const toIncident = (r: IncidentRow): Incident => ({
  id: Number(r.id),
  title: r.title,
  service: r.service,
  severity: r.severity,
  status: r.status,
  summary: r.summary,
  openedAt: r.opened_at,
  updatedAt: r.updated_at,
});

// Lists incidents, most recently updated first.
export const list = api(
  { expose: true, method: "GET", path: "/incidents" },
  async (p: { status?: Query<Status> }): Promise<{ incidents: Incident[] }> => {
    const rows = await db.rawQueryAll<IncidentRow>(
      `SELECT * FROM incidents WHERE ($1::text IS NULL OR status = $1)
       ORDER BY (status = 'resolved'), updated_at DESC`,
      p.status ?? null,
    );
    return { incidents: rows.map(toIncident) };
  },
);

// Returns one incident with its timeline.
export const get = api(
  { expose: true, method: "GET", path: "/incidents/:id" },
  async ({ id }: { id: number }): Promise<{ incident: Incident; updates: IncidentUpdate[] }> => {
    const row = await db.queryRow<IncidentRow>`SELECT * FROM incidents WHERE id = ${id}`;
    if (!row) throw APIError.notFound(`incident ${id} not found`);
    const updates: IncidentUpdate[] = [];
    for await (const u of db.query<{ id: number; author: string; body: string; created_at: Date }>`
      SELECT id, author, body, created_at FROM incident_updates
      WHERE incident_id = ${id} ORDER BY created_at`) {
      updates.push({ id: Number(u.id), author: u.author, body: u.body, createdAt: u.created_at });
    }
    return { incident: toIncident(row), updates };
  },
);

interface OpenParams {
  title: string;
  service: string;
  severity: Severity;
  summary: string;
}

// Opens an incident and announces it on the incident-opened topic.
export const open = api(
  { expose: true, method: "POST", path: "/incidents" },
  async (p: OpenParams): Promise<Incident> => {
    const row = await db.queryRow<IncidentRow>`
      INSERT INTO incidents (title, service, severity, summary)
      VALUES (${p.title}, ${p.service}, ${p.severity}, ${p.summary})
      RETURNING *`;
    const incident = toIncident(row!);
    await incidentOpened.publish({ incidentId: incident.id });
    return incident;
  },
);

// Appends a note to an incident's timeline.
export const addUpdate = api(
  { expose: true, method: "POST", path: "/incidents/:id/updates" },
  async ({ id, author, body }: { id: number; author: string; body: string }): Promise<IncidentUpdate> => {
    const u = await db.queryRow<{ id: number; created_at: Date }>`
      INSERT INTO incident_updates (incident_id, author, body)
      VALUES (${id}, ${author}, ${body})
      RETURNING id, created_at`;
    await db.exec`UPDATE incidents SET updated_at = now() WHERE id = ${id}`;
    return { id: Number(u!.id), author, body, createdAt: u!.created_at };
  },
);

// Moves an incident to a new status.
export const setStatus = api(
  { expose: true, method: "POST", path: "/incidents/:id/status" },
  async ({ id, status }: { id: number; status: Status }): Promise<Incident> => {
    const row = await db.queryRow<IncidentRow>`
      UPDATE incidents SET status = ${status}, updated_at = now()
      WHERE id = ${id} RETURNING *`;
    if (!row) throw APIError.notFound(`incident ${id} not found`);
    return toIncident(row);
  },
);

// Lists recent deploys, optionally for one service.
export const deploys = api(
  { expose: true, method: "GET", path: "/deploys" },
  async (p: { service?: Query<string> }): Promise<{ deploys: Deploy[] }> => {
    const rows = await db.rawQueryAll<{
      id: number;
      service: string;
      commit_sha: string;
      message: string;
      author: string;
      deployed_at: Date;
    }>(
      `SELECT * FROM deploys WHERE ($1::text IS NULL OR service = $1)
       ORDER BY deployed_at DESC LIMIT 20`,
      p.service ?? null,
    );
    return {
      deploys: rows.map((r) => ({
        id: Number(r.id),
        service: r.service,
        commitSha: r.commit_sha,
        message: r.message,
        author: r.author,
        deployedAt: r.deployed_at,
      })),
    };
  },
);

// Returns per-minute latency, error rate and throughput for a service.
export const metrics = api(
  { expose: true, method: "GET", path: "/metrics/:service" },
  async ({ service, minutes }: { service: string; minutes?: Query<number> }): Promise<{ points: MetricPoint[] }> => {
    const rows = await db.rawQueryAll<{ minute: Date; p95_ms: number; error_rate: number; rps: number }>(
      `SELECT minute, p95_ms, error_rate, rps FROM metrics
       WHERE service = $1 AND minute > now() - ($2 || ' minutes')::interval
       ORDER BY minute`,
      service,
      String(minutes ?? 60),
    );
    return {
      points: rows.map((r) => ({ minute: r.minute, p95Ms: r.p95_ms, errorRate: r.error_rate, rps: r.rps })),
    };
  },
);
