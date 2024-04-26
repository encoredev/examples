import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { IncomingMessage } from "node:http";
import type { IncomingHttpHeaders } from "http";

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
