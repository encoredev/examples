// An uptime monitor: it keeps a list of websites, checks whether each is up,
// and posts to Slack when one goes down or comes back up.
//
//   GET    /{{name}}/sites            list the monitored sites
//   POST   /{{name}}/sites            monitor a site, from {"url": "..."}
//   GET    /{{name}}/sites/:id        get one site
//   DELETE /{{name}}/sites/:id        stop monitoring a site
//   POST   /{{name}}/sites/:id/check  check one site now
//   POST   /{{name}}/check-all        check every site (the cron job runs this hourly)
//   GET    /{{name}}/status           each site's most recent check
//   GET    /{{name}}/ping/:url        check any URL once, without recording it
import log from "@encore.dev/sdk/log";
import { onShutdown } from "@encore.dev/sdk/shutdown";
import { checkAll, checkSite, pingUrl, status } from "./check";
import { error } from "./http";
import { addSite, deleteSite, getSite, listSites } from "./sites";
// Starts the subscription that notifies Slack.
import "./slack";

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
  routes: {
    "/{{name}}/sites": { GET: listSites, POST: addSite },
    "/{{name}}/sites/:id": { GET: getSite, DELETE: deleteSite },
    "/{{name}}/sites/:id/check": { POST: checkSite },
    // The cron job's path: checkAllJob in check.ts.
    "/{{name}}/check-all": { POST: checkAll },
    "/{{name}}/status": { GET: status },
    "/{{name}}/ping/:url": { GET: pingUrl },
  },
  fetch: () => error("not found", 404),
  error: (err) => {
    log.error(err, "request failed");
    return error("internal error", 500);
  },
});

log.info("listening", { addr: `${server.hostname}:${server.port}` });

// On shutdown, finish the requests in flight before Encore flushes telemetry.
onShutdown(() => server.stop());
