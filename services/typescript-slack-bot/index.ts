// A Slack bot that brings cowsay to Slack: the /cowsay slash command answers
// with ASCII cow art saying the command's text.
//
//   GET  /{{name}}         usage instructions
//   POST /{{name}}/cowsay  the slash command's request URL, called by Slack
//
// Every slash command request is checked against the Slack app's signing
// secret, kept in the SlackSigningSecret secret, before it is answered.
import { secret } from "@encore.dev/sdk/config";
import log from "@encore.dev/sdk/log";
import { onShutdown } from "@encore.dev/sdk/shutdown";
import { createHmac, timingSafeEqual } from "node:crypto";

const service = "{{name}}";

// The Slack app's Signing Secret, from its Basic Information page. Slack signs
// every request with it.
const signingSecret = secret("SlackSigningSecret");

// How far a request's timestamp may be from now, so that a request captured on
// the way can't be replayed later.
const maxClockSkewSec = 5 * 60;

// The cow saying msg, in a code block so Slack keeps it monospaced.
const cowart = (msg: string) => `
\`\`\`
+-${"-".repeat(msg.length)}-+
| ${msg} |
+-${"-".repeat(msg.length)}-+
      \\  __n__n__
  .------\`-\\00/-'
 /  ##  ## (oo)
/ \\## __   ./
   |//YY \\|/
   |||   |||
\`\`\`
`;

function index(): Response {
  return new Response(
    `Slack bot: cowsay for Slack.

Point a Slack slash command's Request URL at POST /${service}/cowsay, then type
"/cowsay Hello!" in Slack. Requests are verified with the Slack app's
signing secret (the SlackSigningSecret secret).
`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
}

// The slash command: verifies the request came from Slack and answers in the
// channel with the cow saying the command's text.
async function cowsay(req: Request): Promise<Response> {
  const body = Buffer.from(await req.arrayBuffer());

  const key = signingSecret();
  if (key === "") {
    log.error("SlackSigningSecret is not set, so no request can be verified");
    return new Response("the bot is not configured\n", { status: 500 });
  }
  const problem = verify(req.headers, body, key, Date.now());
  if (problem) {
    log.warn("rejected a slash command", { reason: problem });
    return new Response(`${problem}\n`, { status: 401 });
  }

  const text = new URLSearchParams(body.toString("utf8")).get("text");
  return Response.json({ response_type: "in_channel", text: cowart(text || "Moo!") });
}

// Checks a request is from Slack, as
// https://api.slack.com/authentication/verifying-requests-from-slack describes:
// its X-Slack-Signature is "v0=" and the hex HMAC-SHA256, keyed with the
// signing secret, of "v0:{X-Slack-Request-Timestamp}:{body}". Returns why it
// is not, or undefined if it is.
function verify(headers: Headers, body: Buffer, key: string, nowMs: number): string | undefined {
  const ts = headers.get("x-slack-request-timestamp") ?? "";
  if (!/^\d+$/.test(ts)) {
    return "missing or malformed X-Slack-Request-Timestamp";
  }
  if (Math.abs(Math.floor(nowMs / 1000) - Number(ts)) > maxClockSkewSec) {
    return "the request is not recent";
  }

  const sig = headers.get("x-slack-signature") ?? "";
  if (!sig.startsWith("v0=")) {
    return "missing or unknown X-Slack-Signature";
  }
  const got = Buffer.from(sig.slice(3), "utf8");
  const want = Buffer.from(
    createHmac("sha256", key).update(`v0:${ts}:`).update(body).digest("hex"),
    "utf8",
  );
  if (got.length !== want.length || !timingSafeEqual(got, want)) {
    return "signature mismatch";
  }
  return undefined;
}

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
  // Slack's slash command bodies are a few hundred bytes.
  maxRequestBodySize: 64 * 1024,
  routes: {
    [`/${service}`]: { GET: index },
    [`/${service}/`]: { GET: index },
    [`/${service}/cowsay`]: { POST: cowsay },
  },
  fetch: () => new Response("not found\n", { status: 404 }),
});

// On shutdown, finish the requests in flight before Encore exits.
onShutdown(() => server.stop());

log.info("listening", { service, addr: `${server.hostname}:${server.port}` });
