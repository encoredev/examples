import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Mode } from "../lib/api";

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

const Step = (props: { n: number; title: string; done?: string; children?: ReactNode }) => (
  <li className={`about-step ${props.done ? "done" : ""}`}>
    <span className="about-num">{props.done ? "✓" : props.n}</span>
    <div className="about-step-body">
      <h3>{props.title}</h3>
      {props.done ? <p>{props.done}</p> : props.children}
    </div>
  </li>
);

// What to do with your own copy of the desk: add the key, move it into your
// own AWS or GCP, and change it into the agent you need. Steps that are
// already done say so. Opens on the first visit; the topbar reopens it.
export default function About(props: {
  open: boolean;
  onClose(): void;
  mode: Mode | null;
  appId: string;
  cloud: string;
}) {
  const { open, onClose, mode, appId, cloud } = props;
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
        <h2>Your On-call Desk</h2>
        <p className="about-lead">
          This is your own copy of an example agent built with the Cursor SDK and Encore. It triages incidents: it
          reads them, checks recent deploys and metrics with its tools, and posts what it finds. The agent, its
          Postgres, Pub/Sub topic and cron job are all declared in this one Encore app.
        </p>

        <ol className="about-steps">
          <Step
            n={1}
            title="Add your Cursor API key"
            done={mode === "live" ? "The agent has its key and runs for real." : undefined}
          >
            <p>
              Create one at{" "}
              <a href="https://cursor.com/dashboard/api" target="_blank" rel="noreferrer">
                cursor.com/dashboard/api
              </a>
              . {mode === "replay" ? "Until then the desk replays recorded runs." : "The agent needs it to run."}
            </p>
            {local ? (
              <>
                <Command text="encore secret set --type dev,local CursorApiKey" />
                <p>Then restart <code>encore run</code>.</p>
              </>
            ) : (
              <p>
                Add it as <code>CursorApiKey</code> under{" "}
                <a href={`${app}/secrets`} target="_blank" rel="noreferrer">
                  Secrets
                </a>{" "}
                in the Encore dashboard, then redeploy.
              </p>
            )}
          </Step>

          <Step
            n={2}
            title="Run it in your own AWS or GCP"
            done={
              cloud === "aws" || cloud === "gcp"
                ? `It already runs in your ${cloud.toUpperCase()} account.`
                : undefined
            }
          >
            <p>
              Connect your AWS or GCP account and create an environment in it. Encore provisions the agent's databases,
              Pub/Sub topic, cron job and secret there, and redeploys on every push.
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
              Change the tools in <code>agent/tools.ts</code> and the brief in <code>agent/runtime.ts</code> into the
              agent your team needs, then <code>git push encore</code> to deploy it.
            </p>
          </Step>
        </ol>

        <div className="about-foot">
          <button ref={close} className="about-close" onClick={onClose}>
            Explore the desk
          </button>
        </div>
      </div>
    </dialog>
  );
}
