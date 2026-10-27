import { api } from "encore.dev/api";
import { CronJob } from "encore.dev/cron";
import { Subscription } from "encore.dev/pubsub";
import { incidentOpened } from "../incidents/incidents";
import { incidents } from "~encore/clients";
import { db } from "./db";
import { openThread } from "./api";
import { mode } from "./runtime";

// The agent isn't only something you chat with. These are the two ways it
// starts work on its own.

// 1. Every new incident gets a triage run. Encore delivers the message from
// SNS/SQS on AWS or Pub/Sub on GCP, and retries if the handler throws. Delivery
// is at least once, so a message can arrive twice: an incident that already
// has a triage thread is skipped, and a unique index on threads settles two
// deliveries racing (the loser throws, and its retry is then skipped).
const _ = new Subscription(incidentOpened, "agent-triage", {
  handler: async ({ incidentId }) => {
    // Only a live agent triages. Without a key there is nothing to run, and
    // throwing here would just make Pub/Sub redeliver forever.
    if (mode() !== "live") return;
    const seen = await db.queryRow`
      SELECT 1 AS seen FROM threads WHERE trigger = 'incident' AND incident_id = ${incidentId}`;
    if (seen) return;
    const { incident } = await incidents.get({ id: incidentId });
    await openThread({
      title: `Triage #${incident.id}: ${incident.title}`,
      prompt: `Incident #${incident.id} was just opened on ${incident.service} (${incident.severity}). Triage it.`,
      trigger: "incident",
      incidentId: incident.id,
    });
  },
});

// 2. A morning handoff, written by the agent before the humans log on.
export const handoff = api({}, async (): Promise<void> => {
  if (mode() !== "live") return;
  await openThread({
    title: "Morning handoff",
    prompt:
      "Write the on-call handoff: every unresolved incident, what is known, and what the next person should check first.",
    trigger: "schedule",
  });
});

const __ = new CronJob("morning-handoff", {
  title: "Morning on-call handoff",
  schedule: "0 8 * * 1-5",
  endpoint: handoff,
});
