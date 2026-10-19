// Transactional email through Resend. Sending an email publishes it on a
// Pub/Sub topic and returns at once; a subscription to the topic, in this same
// service, delivers it through Resend in the background, so a failed send is
// retried without the caller waiting for it.
//
//   POST /{{name}}/send   queue an email from {"to": "...", "subject": "...", "html": "..."}
import { secret } from "@encore.dev/sdk/config";
import log from "@encore.dev/sdk/log";
import { Subscription, Topic } from "@encore.dev/sdk/pubsub";
import { onShutdown } from "@encore.dev/sdk/shutdown";
import { Resend } from "resend";

const service = "{{name}}";

// The Resend API key, from https://resend.com/api-keys. Without it, emails
// are logged rather than sent.
const resendApiKey = secret("ResendApiKey");

// The sender. onboarding@resend.dev is Resend's test address, which works
// with any API key but only delivers to your own account's address. To send
// from your own address, verify its domain at https://resend.com/domains.
const fromAddress = "Encore <onboarding@resend.dev>";

// An email waiting to be sent.
interface EmailEvent {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

const emails = new Topic<EmailEvent>("{{kebab}}-emails", {
  deliveryGuarantee: "at-least-once",
});

// The Resend client, made again when the key changes.
let client: { key: string; resend: Resend } | undefined;

function resend(): Resend | undefined {
  const key = resendApiKey();
  if (!key) {
    return undefined;
  }
  if (client?.key !== key) {
    client = { key, resend: new Resend(key) };
  }
  return client.resend;
}

// Sends each queued email. A handler that throws has its message redelivered
// later, so a failed send is retried.
const sendEmail = new Subscription(emails, "{{kebab}}-send-email", {
  handler: async (msg) => {
    const email = JSON.parse(msg.data.toString()) as EmailEvent;
    const from = email.from ?? fromAddress;

    const r = resend();
    if (!r) {
      log.info("ResendApiKey is not set; not sending the email", {
        to: email.to,
        from,
        subject: email.subject,
      });
      return;
    }

    const { data, error } = await r.emails.send({
      from,
      to: email.to,
      subject: email.subject,
      html: email.html,
    });
    if (error) {
      throw new Error(`Resend: ${error.message}`);
    }
    log.info("email sent", { to: email.to, id: data?.id ?? "" });
  },
});

async function send(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = undefined;
  }
  const { to, subject, html } = (body ?? {}) as Record<string, unknown>;
  if (
    typeof to !== "string" ||
    !to.includes("@") ||
    typeof subject !== "string" ||
    subject.trim() === "" ||
    typeof html !== "string"
  ) {
    return error(
      'the body must be JSON like {"to": "ada@example.com", "subject": "Hello", "html": "<p>Hi!</p>"}',
      400,
    );
  }

  await emails.publish({ to, subject, html });
  return Response.json({ message: `Email queued for ${to}` }, { status: 202 });
}

function error(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
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
  routes: {
    "/{{name}}/send": { POST: send },
  },
  fetch: () => error("not found", 404),
  error(err) {
    log.error(err, "request failed");
    return error("internal error", 500);
  },
});

// On shutdown, finish the requests in flight. Encore then waits for the
// subscription's handlers to finish.
onShutdown(() => server.stop());

console.log(`${service} listening on ${server.hostname}:${server.port}`);
