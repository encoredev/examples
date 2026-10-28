import { useEffect, useRef, useState, type ReactNode } from "react";
import { AwsMark, GcpMark } from "./CloudMarks";

const DASHBOARD = "https://app.encore.dev";

// A command with a copy button. The text stays selectable if the clipboard is
// out of reach (an insecure origin).
const Command = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {}
  };
  return (
    <div className="about-cmd">
      <pre>{text}</pre>
      <button className="about-copy" onClick={copy}>
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
};

const Step = (props: { n: number; title: ReactNode; done?: string; children?: ReactNode }) => (
  <li className={`about-step ${props.done ? "done" : ""}`}>
    <span className="about-num">{props.done ? "✓" : props.n}</span>
    <div className="about-step-body">
      <h3>{props.title}</h3>
      {props.done ? <p>{props.done}</p> : props.children}
    </div>
  </li>
);

// What to do with your own copy of the app: add a key, move it into your own
// AWS or GCP, and change it into the agent you need. Steps that are
// already done say so. Opens on the first visit; the topbar reopens it.
export default function About(props: {
  open: boolean;
  onClose(): void;
  hasKey: boolean;
  appId: string;
  cloud: string;
}) {
  const { open, onClose, hasKey, appId, cloud } = props;
  const ref = useRef<HTMLDialogElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const local = cloud === "local";
  const app = appId ? `${DASHBOARD}/${appId}` : DASHBOARD;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      // Focus the close button rather than the first link, so nothing in the
      // dialog shows a focus ring before the visitor does anything.
      close.current?.focus({ focusVisible: false } as FocusOptions);
    }
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="about"
      onClose={onClose}
      // A click on the backdrop lands on the dialog itself.
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <div className="about-body">
        <h2>Notes Agent</h2>
        <p className="about-lead">
          Your own copy of a notes agent, built with the Cursor SDK and Encore. Tell it something to remember, or
          ask what you've saved.
        </p>

        {/* No auth: deployed, every endpoint is public. The Cursor key stays in
            each visitor's browser, so the open risk is reading, not spending. */}
        <div className="about-warn" role="alert">
          <strong>{local ? "Deployed, this app is public." : "This app is public."}</strong> It has no login, so
          anyone with its URL can read its conversations and notes. Your Cursor key stays in your browser, so they
          can't use it. Add{" "}
          <a href="https://encore.dev/docs/ts/develop/auth" target="_blank" rel="noreferrer">
            authentication
          </a>{" "}
          before you save anything private.
        </div>

        <ol className="about-steps">
          <Step
            n={1}
            title="Add your Cursor API key"
            done={hasKey ? "Your key is saved in this browser." : undefined}
          >
            <p>
              Create one at{" "}
              <a href="https://cursor.com/dashboard/api" target="_blank" rel="noreferrer">
                cursor.com/dashboard/api
              </a>{" "}
              and paste it into the box on the start screen. It stays in this browser and goes with each message;
              the app never stores it.
            </p>
          </Step>

          <Step
            n={2}
            title={
              <span className="about-cloud-title" aria-label="Run it in your own AWS or GCP">
                Run it in your own <AwsMark className="about-aws" /> or <GcpMark className="about-gcp" />
              </span>
            }
            done={
              cloud === "aws" || cloud === "gcp"
                ? `It already runs in your ${cloud.toUpperCase()} account.`
                : undefined
            }
          >
            <p>
              Connect your AWS or GCP account and create an environment in it. Encore provisions both services and
              their databases there, and redeploys on every push.
            </p>
            <a className="about-link" href={`${app}/envs/create`} target="_blank" rel="noreferrer">
              Create an environment →
            </a>
          </Step>

          <Step n={3} title="Make it your agent">
            {!local && appId && (
              <>
                <p>Clone the app to work on it locally:</p>
                <Command text={`encore app clone ${appId} my-agent\ncd my-agent\nencore run`} />
              </>
            )}
            <p>
              Point the tools in <code>agent/tools.ts</code> at your own services and rewrite the brief in{" "}
              <code>agent/runtime.ts</code>, then <code>git push encore</code> to deploy it.
            </p>
          </Step>
        </ol>

        <div className="about-foot">
          <button ref={close} className="about-close" onClick={onClose}>
            Explore the app
          </button>
        </div>
      </div>
    </dialog>
  );
}
