import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { IncomingMessage } from "node:http";
import type { IncomingHttpHeaders } from "http";

// Landing page with usage instructions.
export const index = api.raw(
  { expose: true, method: "GET", path: "/" },
  async (req, resp) => {
    const host = req.headers["host"] ?? "localhost:4000";
    const proto = req.headers["x-forwarded-proto"] ?? "http";
    const baseUrl = `${proto}://${host}`;
    resp.setHeader("Content-Type", "text/html");
    resp.end(slackLandingPage.replaceAll("{{baseUrl}}", baseUrl));
  },
);

const slackLandingPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Slack Bot</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #0a0a0a; color: #e5e5e5; padding: 2rem; max-width: 720px; margin: 0 auto; line-height: 1.6; }
    h1 { font-size: 1.75rem; margin-bottom: 0.5rem; color: #fff; }
    h2 { font-size: 1.1rem; margin-top: 2rem; margin-bottom: 0.75rem; color: #fff; }
    p { margin-bottom: 1rem; color: #a3a3a3; }
    code { background: #1a1a1a; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.9em; color: #e5e5e5; }
    pre { background: #1a1a1a; border: 1px solid #262626; border-radius: 8px; padding: 1rem; overflow-x: auto; margin-bottom: 1rem; }
    pre code { background: none; padding: 0; }
    .endpoint { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
    .method { font-size: 0.75rem; font-weight: 600; padding: 0.2rem 0.5rem; border-radius: 4px; font-family: monospace; }
    .post { background: #1d4ed8; color: #fff; }
    .path { font-family: monospace; color: #e5e5e5; }
    .desc { color: #737373; font-size: 0.9rem; margin-bottom: 1.25rem; }
    a { color: #60a5fa; }
    .badge { display: inline-block; background: #1d4ed8; color: #fff; font-size: 0.7rem; padding: 0.15rem 0.5rem; border-radius: 999px; margin-left: 0.5rem; font-weight: 600; vertical-align: middle; position: relative; top: -0.15em; }
    ol { margin-bottom: 1rem; padding-left: 1.5rem; color: #a3a3a3; }
    li { margin-bottom: 0.5rem; }
  </style>
</head>
<body>
  <h1>Slack Bot <span class="badge">Encore.ts</span></h1>
  <p>A Slack bot that responds to slash commands with ASCII cow art. Demonstrates Encore's secrets management and raw HTTP endpoint handling with Slack signature verification.</p>

  <p>Explore and test endpoints in the <a href="http://localhost:9400/">Local Dashboard</a> when running locally. When deployed to <a href="https://app.encore.cloud">Encore Cloud</a>, use the Service Catalog to call endpoints and view traces to see how requests flow between services.</p>

  <h2>Setup</h2>
  <p>Follow the full setup guide in the <a href="https://github.com/encoredev/examples/tree/main/ts/slack-bot">GitHub README</a> to create a Slack app and configure the slash command.</p>

  <h2>Endpoint</h2>

  <div class="endpoint">
    <span class="method post">POST</span>
    <span class="path">/cowsay</span>
    <code>slack.cowsay</code>
  </div>
  <p class="desc">Receives a Slack slash command, verifies the request signature, and responds with ASCII cow art saying whatever text was sent.</p>
  <p class="desc">This is a raw HTTP endpoint that handles Slack's request format directly. In Slack, type <code>/cowsay Hello!</code> to try it.</p>

</body>
</html>`;

// This uses Encore's built-in secrets manager, learn more: https://encore.dev/docs/ts/primitives/secrets
const slackSigningSecret = secret("SlackSigningSecret");

// cowart is the formatting string for printing the cow art.
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

// Slack slash command handler. Verifies the request signature and responds with ASCII cow art.
export const cowsay = api.raw(
  { expose: true, path: "/cowsay", method: "*" },
  async (req, resp) => {
    const body = await getBody(req);

    try {
      await verifySignature(body, req.headers);
    } catch (err) {
      const e = err as Error;
      resp.statusCode = 500;
      resp.end(e.message);
      return;
    }

    const text = new URLSearchParams(body).get("text");
    const msg = cowart(text || "Moo!");
    resp.setHeader("Content-Type", "application/json");
    resp.end(JSON.stringify({ response_type: "in_channel", text: msg }));
  },
);

// Verifies the signature of an incoming request from Slack.
// https://github.com/slackapi/bolt-js/blob/main/src/receivers/verify-request.ts
const verifySignature = async function (
  body: string,
  headers: IncomingHttpHeaders,
) {
  const requestTimestampSec = parseInt(
    headers["x-slack-request-timestamp"] as string,
  );
  const signature = headers["x-slack-signature"] as string;
  if (Number.isNaN(requestTimestampSec)) {
    throw new Error(
      `Failed to verify authenticity: header x-slack-request-timestamp did not have the expected type (${requestTimestampSec})`,
    );
  }

  // Calculate time-dependent values
  const nowMs = Date.now();
  const requestTimestampMaxDeltaMin = 5;
  const fiveMinutesAgoSec =
    Math.floor(nowMs / 1000) - 60 * requestTimestampMaxDeltaMin;

  // Enforce verification rules

  // Rule 1: Check staleness
  if (requestTimestampSec < fiveMinutesAgoSec) {
    throw new Error(
      `Failed to verify authenticity: x-slack-request-timestamp must differ from system time by no more than ${requestTimestampMaxDeltaMin} minutes or request is stale`,
    );
  }

  // Rule 2: Check signature
  // Separate parts of signature
  const [signatureVersion, signatureHash] = signature.split("=");
  // Only handle known versions
  if (signatureVersion !== "v0") {
    throw new Error(`Failed to verify authenticity: unknown signature version`);
  }
  // Compute our own signature hash
  const hmac = createHmac("sha256", slackSigningSecret());
  hmac.update(`${signatureVersion}:${requestTimestampSec}:${body}`);
  const ourSignatureHash = hmac.digest("hex");
  if (
    !signatureHash ||
    !timingSafeEqual(
      Buffer.from(signatureHash, "utf8"),
      Buffer.from(ourSignatureHash, "utf8"),
    )
  ) {
    throw new Error(`Failed to verify authenticity: signature mismatch`);
  }
};

// Extract the body from an incoming request.
function getBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    const bodyParts: any[] = [];
    req
      .on("data", (chunk) => {
        bodyParts.push(chunk);
      })
      .on("end", () => {
        resolve(Buffer.concat(bodyParts).toString());
      });
  });
}
