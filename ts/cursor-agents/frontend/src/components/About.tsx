import { useEffect, useRef } from "react";
import { CODE_URL, DEPLOY_URL } from "../lib/api";
import { AwsMark, GcpMark } from "./CloudMarks";

const LOCAL_STEPS = `encore app create my-agent --example=ts/cursor-agents
cd my-agent
encore secret set --type dev,local CursorApiKey
encore run`;

// What this app is and the two ways to make it yours: deploy it to your own
// cloud, or run it locally and change it into the agent you need. Opens on
// first visit to the demo or a local run; the topbar's About reopens it.
export default function About(props: { open: boolean; onClose(): void }) {
  const { open, onClose } = props;
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
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
        <h2>On-call Desk</h2>
        <p className="about-lead">
          An example agent built with the Cursor SDK and Encore. It triages incidents: it reads them, checks recent
          deploys and metrics with its tools, and posts what it finds. The agent, its Postgres, Pub/Sub topic and cron
          job are all declared in one Encore app.
        </p>

        <div className="about-paths">
          <section className="about-path">
            <h3>Deploy it to your cloud</h3>
            <p>
              Clone this app into your Encore account and deploy it, then connect AWS or GCP to run it in your own
              cloud. Add your Cursor API key when asked.
            </p>
            <a className="deploy about-deploy" href={DEPLOY_URL} target="_blank" rel="noreferrer">
              Deploy to
              <AwsMark className="deploy-aws" />
              <span className="deploy-or">or</span>
              <GcpMark className="deploy-gcp" />
              <span className="deploy-arrow">→</span>
            </a>
          </section>

          <section className="about-path">
            <h3>Run it locally and make it yours</h3>
            <pre>{LOCAL_STEPS}</pre>
            <p>
              Then change the tools in <code>agent/tools.ts</code> and the brief in <code>agent/runtime.ts</code> into
              the agent your team needs.
            </p>
          </section>
        </div>

        <div className="about-foot">
          <a href={CODE_URL} target="_blank" rel="noreferrer">
            Read the code →
          </a>
          {/* Focused on open, rather than the first link, so nothing in the
              dialog shows a focus ring before the visitor does anything. */}
          <button className="about-close" onClick={onClose} autoFocus>
            Explore the demo
          </button>
        </div>
      </div>
    </dialog>
  );
}
