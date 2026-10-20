import { secret } from "@encore.dev/sdk/config";
import { createHmac, timingSafeEqual } from "node:crypto";
import { webhooks } from "./events";

// The signing secrets of the senders whose signatures are checked. A source
// whose secret is not set has its webhooks accepted without a check.

// The Stripe webhook endpoint's signing secret (whsec_...), from the
// endpoint's page in the Stripe dashboard.
const stripeSecret = secret("WebhookSecretStripe");

// The secret entered in the GitHub webhook's settings.
const githubSecret = secret("WebhookSecretGitHub");

// How old a Stripe signature may be, in seconds, as in Stripe's SDKs: an
// older one may be a replay.
const stripeToleranceSeconds = 5 * 60;

/** Accepts a webhook from `source`, checks its signature if the source's
 * secret is set, and publishes it to be processed. */
export async function receive(req: Request, source: string): Promise<Response> {
  const body = Buffer.from(await req.arrayBuffer());

  if (!verify(source, req.headers, body)) {
    return Response.json({ error: "invalid signature" }, { status: 401 });
  }

  // Store a body that is not a JSON object as {"raw": "..."}.
  const text = body.toString("utf-8");
  let payload: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(text);
    payload = isObject(parsed) ? parsed : { raw: text };
  } catch {
    payload = { raw: text };
  }

  await webhooks.publish({
    source,
    event_type: eventType(source, req.headers, payload),
    payload,
    received_at: new Date().toISOString(),
  });
  return Response.json({ status: "accepted" });
}

/** Whether a webhook's signature is valid, or needs no check: for a source
 * other than stripe and github, or one whose secret is not set. */
function verify(source: string, headers: Headers, body: Buffer): boolean {
  switch (source) {
    case "stripe": {
      const key = valueOf(() => stripeSecret());
      return !key || verifyStripe(headers.get("stripe-signature"), body, key);
    }
    case "github": {
      const key = valueOf(() => githubSecret());
      return !key || verifyGitHub(headers.get("x-hub-signature-256"), body, key);
    }
    default:
      return true;
  }
}

/** The value `read` returns, or "" when the secret it reads is not set. */
function valueOf(read: () => string): string {
  try {
    return read();
  } catch {
    return "";
  }
}

/** Checks an X-Hub-Signature-256 header, "sha256=<hex>": the HMAC-SHA256 of
 * the body. */
function verifyGitHub(signature: string | null, body: Buffer, key: string): boolean {
  if (!signature?.startsWith("sha256=")) return false;
  return hmacEqual(signature.slice("sha256=".length), key, body);
}

/** Checks a Stripe-Signature header, "t=<unix time>,v1=<hex>": the
 * HMAC-SHA256 of "<t>.<body>", with any number of v1 signatures (several
 * while a secret is being rolled). The timestamp must be recent. */
function verifyStripe(header: string | null, body: Buffer, key: string): boolean {
  let timestamp = "";
  const signatures: string[] = [];
  for (const part of (header ?? "").split(",")) {
    const at = part.indexOf("=");
    const [name, value] = [part.slice(0, at), part.slice(at + 1)];
    if (name === "t") timestamp = value;
    if (name === "v1") signatures.push(value);
  }
  const unix = Number(timestamp);
  if (!timestamp || !Number.isInteger(unix)) return false;
  if (Math.abs(Date.now() / 1000 - unix) > stripeToleranceSeconds) return false;

  const signed = Buffer.concat([Buffer.from(`${timestamp}.`), body]);
  return signatures.some((sig) => hmacEqual(sig, key, signed));
}

/** Whether `hexSig` is the HMAC-SHA256 of `msg` under `key`, compared in
 * constant time. */
function hmacEqual(hexSig: string, key: string, msg: Buffer): boolean {
  const expected = createHmac("sha256", key).update(msg).digest();
  const sig = Buffer.from(hexSig, "hex");
  return sig.length === expected.length && timingSafeEqual(sig, expected);
}

/** A webhook's event type: GitHub sends it in a header, Stripe in the
 * payload's "type", and other senders often in "event" or "event_type". */
function eventType(source: string, headers: Headers, payload: Record<string, unknown>): string {
  if (source === "github") {
    const type = headers.get("x-github-event");
    if (type) return type;
  }
  if (source === "stripe" && typeof payload.type === "string") return payload.type;
  if (typeof payload.event === "string") return payload.event;
  if (typeof payload.event_type === "string") return payload.event_type;
  return "unknown";
}

function isObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}
