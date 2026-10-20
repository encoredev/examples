// A webhook processor: it receives webhooks, verifies their signatures, and
// queues them on a Pub/Sub topic. Two subscriptions handle each one
// independently (fan-out): one stores every event, the other keeps the
// important ones as notifications.
//
//   POST /{{name}}/webhooks/:source    receive a webhook from stripe, github or any other source
//   GET  /{{name}}/events              the 50 most recent events
//   GET  /{{name}}/events/:id          one event
//   GET  /{{name}}/notifications       the 50 most recent important events
//   GET  /{{name}}/notifications/stats how many notifications there are of each event type
import log from "@encore.dev/sdk/log";
import { onShutdown } from "@encore.dev/sdk/shutdown";
import { getEvent, listEvents, listNotifications, notificationStats } from "./events";
import { receive } from "./receive";

const service = "{{name}}";

// The largest webhook body accepted.
const maxBodySize = 1 << 20;

// Encore's local run supplies ENCORE_LISTEN_ADDR as host:port. Run on its own,
// this falls back to PORT and then to 8080.
function listenAddr(): { hostname?: string; port: number } {
  const addr = process.env.ENCORE_LISTEN_ADDR;
  if (addr) {
    const at = addr.lastIndexOf(":");
    return { hostname: addr.slice(0, at) || undefined, port: Number(addr.slice(at + 1)) };
  }
  return { port: Number(process.env.PORT ?? 8080) };
}

const server = Bun.serve({
  ...listenAddr(),
  maxRequestBodySize: maxBodySize,
  routes: {
    "/{{name}}/webhooks/:source": {
      POST: (req) => receive(req, req.params.source),
    },
    "/{{name}}/events": {
      GET: async () => Response.json({ events: await listEvents() }),
    },
    "/{{name}}/events/:id": {
      GET: async (req) => {
        const id = Number(req.params.id);
        if (!Number.isSafeInteger(id)) {
          return Response.json({ error: "the event id must be a number" }, { status: 400 });
        }
        const event = await getEvent(id);
        return event
          ? Response.json(event)
          : Response.json({ error: "event not found" }, { status: 404 });
      },
    },
    "/{{name}}/notifications": {
      GET: async () => Response.json({ notifications: await listNotifications() }),
    },
    "/{{name}}/notifications/stats": {
      GET: async () => Response.json({ stats: await notificationStats() }),
    },
  },
  fetch: () => Response.json({ error: "not found" }, { status: 404 }),
  error: (err) => {
    log.error("request failed", { error: String(err) });
    return Response.json({ error: "internal error" }, { status: 500 });
  },
});

log.info("listening", { service, addr: `${server.hostname}:${server.port}` });

// On shutdown, finish the requests in flight before Encore cleans up.
onShutdown(() => server.stop());
