import { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import ThreadView from "./components/ThreadView";
import IncidentRail from "./components/IncidentRail";
import type { BlockFieldHandle } from "./components/BlockField";
import { api, DEPLOY_URL, errorMessage, type Mode, type Thread } from "./lib/api";
import type { agent } from "./lib/client";

const SUGGESTIONS = [
  "Why is checkout slow right now? Check the recent deploys.",
  "Go through every open incident and post a status update on each.",
  "Write a handoff for the next on-call: what is open and what to check first.",
];

export default function App() {
  const field = useRef<BlockFieldHandle>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [stats, setStats] = useState<agent.DeskStats | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);
  const [recorded, setRecorded] = useState<string[]>([]);
  const awaiting = useRef<number | null>(null);
  const input = useRef<HTMLTextAreaElement>(null);

  const refresh = useCallback(async () => {
    const [{ threads }, s] = await Promise.all([api.agent.list(), api.agent.stats()]);
    setThreads(threads);
    setStats(s);
    // A test incident was opened: jump to its triage thread once Pub/Sub has
    // delivered it and the agent service has started the run.
    if (awaiting.current !== null) {
      const t = threads.find((x) => x.incidentId === awaiting.current);
      if (t) {
        awaiting.current = null;
        setActiveId(t.id);
      }
    }
  }, []);

  useEffect(() => {
    api.agent
      .setup()
      .then((s) => {
        setMode(s.mode);
        setRecorded(s.prompts);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    refresh().catch(() => {});
    const t = window.setInterval(() => refresh().catch(() => {}), 2000);
    return () => window.clearInterval(t);
  }, [refresh]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setActiveId(null);
        input.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => setNotice(null), [activeId]);

  const active = threads.find((t) => t.id === activeId) ?? null;
  const busy = active?.status === "running";
  const suggestions = mode === "replay" && recorded.length > 0 ? recorded : SUGGESTIONS;

  const submit = async (text = draft) => {
    const prompt = text.trim();
    if (!prompt || sending) return;
    setSending(true);
    setNotice(null);
    try {
      if (active) {
        await api.agent.send(active.id, { prompt });
      } else {
        const { threadId } = await api.agent.create({ prompt });
        setActiveId(threadId);
      }
      setDraft("");
      field.current?.spawn(1);
      await refresh();
    } catch (err) {
      setNotice(errorMessage(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="app">
      <Sidebar
        field={field}
        threads={threads}
        stats={stats}
        activeId={activeId}
        onSelect={setActiveId}
        showDeploy={mode === "replay" || mode === "setup"}
      />

      <main className="main">
        <header className="topbar">
          <span className="topbar-title">{active ? active.title : "New thread"}</span>
        </header>

        {active ? (
          <ThreadView key={active.id} thread={active} onToolCall={() => field.current?.spawn()} />
        ) : (
          <div className="scroll">
            <div className="welcome">
              <h1>An on-call agent that runs in your own cloud.</h1>
              <p>
                The agent loop runs inside an Encore service. Its tools call your APIs, its memory lives in your
                Postgres, and Pub/Sub and Cron put it to work without anyone asking.
              </p>
              {mode === "setup" ? (
                <div className="setup">
                  <div className="setup-title">Add a Cursor API key to start</div>
                  <ol>
                    <li>
                      Create a key at{" "}
                      <a href="https://cursor.com/dashboard/api" target="_blank" rel="noreferrer">
                        cursor.com/dashboard/api
                      </a>
                      .
                    </li>
                    <li>
                      Running locally: <code>encore secret set --type dev,local CursorApiKey</code>, then restart{" "}
                      <code>encore run</code>.
                    </li>
                    <li>
                      Deployed: add <code>CursorApiKey</code> under Settings → Secrets in the Encore Cloud dashboard
                      and redeploy.
                    </li>
                  </ol>
                </div>
              ) : (
                <div className="suggestions">
                  {suggestions.map((prompt) => (
                    <button key={prompt} className="suggestion" onClick={() => submit(prompt)}>
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="composer-wrap">
          {notice && <div className="notice">{notice}</div>}
          {mode === "replay" && (
            <div className="demo-note">
              This demo replays recorded runs, and the tool calls run for real.{" "}
              <a href={DEPLOY_URL} target="_blank" rel="noreferrer">
                Deploy your own
              </a>{" "}
              to ask it anything.
            </div>
          )}
          <div className="composer">
            <textarea
              ref={input}
              rows={1}
              value={draft}
              placeholder={active ? "Follow up…" : "Ask the on-call agent…"}
              disabled={mode === "setup"}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
            />
            <div className="composer-bar">
              <span className="composer-hint">
                {busy ? "The agent is working. You can send when it finishes." : "Enter to send · Shift+Enter for a new line"}
              </span>
              <button className="send" disabled={!draft.trim() || sending || busy} onClick={() => submit()}>
                Send ↵
              </button>
            </div>
          </div>
        </div>
      </main>

      <IncidentRail
        live={mode === "live"}
        threads={threads}
        onOpenThread={setActiveId}
        onAwaitTriage={(id) => (awaiting.current = id)}
        onAsk={(p) => {
          setActiveId(null);
          submit(p);
        }}
      />
    </div>
  );
}
