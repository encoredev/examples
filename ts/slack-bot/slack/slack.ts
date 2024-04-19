import {api} from "encore.dev/api";
import {secret} from "encore.dev/config";
import {IncomingMessage} from "node:http";
import {createHmac} from "node:crypto";
import {IncomingHttpHeaders} from "http"; // This uses Encore's built-in secrets manager, learn more: https://encore.dev/docs/ts/primitives/secrets

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
  {expose: true, path: "/cowsay", method: "*"},
  async (req, resp) => {

    const body = await getBody(req);
    const isValid = await verifySignature(body, req.headers);

    if (!isValid) {
      resp.statusCode = 500;
      resp.end("Invalid signature");
      return;
    }

    const text = new URLSearchParams(body).get("text");
    const msg = cowart(text || "Moo!");
    resp.setHeader("Content-Type", "application/json");
    resp.end(JSON.stringify({response_type: "in_channel", text: msg}));
  },
);

// Verifies the signature of an incoming request from Slack.
const verifySignature = async function (body: string, headers: IncomingHttpHeaders) {
  const signature = headers['x-slack-signature'] as string;
  const timestamp = headers['x-slack-request-timestamp'] as string;
  try {
    const hmac = createHmac('sha256', slackSigningSecret())
    const [version, hash] = signature.split('=')
    hmac.update(`${version}:${timestamp}:${body}`)
    return hmac.digest('hex') === hash;
  } catch (err) {
    return false;
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
