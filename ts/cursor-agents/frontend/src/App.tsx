import { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import ThreadView from "./components/ThreadView";
import NotesRail from "./components/NotesRail";
import About from "./components/About";
import KeyForm from "./components/KeyForm";
import type { BlockFieldHandle } from "./components/BlockField";
import { api, errorMessage, type Thread } from "./lib/api";
import type { agent } from "./lib/client";

// Set once the visitor closes the About dialog, so it opens only on a first
// visit.
const ABOUT_SEEN = "notes-agent:about-seen";
// The visitor's own Cursor API key. It lives only in this browser.
const KEY = "notes-agent:cursor-key";

const load = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const store = (k: string, v: string | null) => {
  try {
    if (v === null) localStorage.removeItem(k);
    else localStorage.setItem(k, v);
  } catch {
    // Private mode: it lasts until the page closes.
  }
};

const SUGGESTIONS = [
  "Remember that the team offsite is on March 12 in Lisbon.",
  "What have I saved so far?",
  "Turn my notes into a short to-do list.",
];

export default function App() {
  const field = useRef<BlockFieldHandle>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [stats, setStats] = useState<agent.ChatStats | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [where, setWhere] = useState({ appId: "", cloud: "" });
  const [key, setKey] = useState<string | null>(() => load(KEY));
  const [editingKey, setEditingKey] = useState(false);
  const [about, setAbout] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);

  const refresh = useCallback(async () => {
    const [{ threads }, s] = await Promise.all([api.agent.list(), api.agent.stats()]);
    setThreads(threads);
    setStats(s);
  }, []);

  useEffect(() => {
    api.agent
      .setup()
      .then((s) => {
        setWhere({ appId: s.appId, cloud: s.cloud });
        if (load(ABOUT_SEEN) !== "1") setAbout(true);
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

  const closeAbout = () => {
    setAbout(false);
    store(ABOUT_SEEN, "1");
  };

  const saveKey = (k: string | null) => {
    store(KEY, k);
    setKey(k);
    setEditingKey(false);
  };

  const active = threads.find((t) => t.id === activeId) ?? null;
  const busy = active?.status === "running";

  const submit = async (text = draft) => {
    const prompt = text.trim();
    if (!prompt || sending || !key) return;
    setSending(true);
    setNotice(null);
    try {
      if (active) {
        await api.agent.send(active.id, { prompt, key });
      } else {
        const { threadId } = await api.agent.create({ prompt, key });
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
      />

      <main className="main">
        <header className="topbar">
          <span className="topbar-title">{active ? active.title : "New thread"}</span>
          <span className="spacer" />
          {key && (
            <button
              className="topbar-link"
              onClick={() => {
                setActiveId(null);
                setEditingKey(true);
              }}
            >
              Change key
            </button>
          )}
          <button className="topbar-link" onClick={() => setAbout(true)}>
            About this app
          </button>
        </header>

        {active ? (
          <ThreadView key={active.id} thread={active} onToolCall={() => field.current?.spawn()} />
        ) : (
          <div className="scroll">
            <div className="welcome">
              <h1>A notes agent that runs in your own cloud.</h1>
              <p>
                It runs inside an Encore service and keeps your notes in your own database.
              </p>
              {!key || editingKey ? (
                <KeyForm onSave={saveKey} onCancel={key ? () => setEditingKey(false) : undefined} />
              ) : (
                <div className="suggestions">
                  {SUGGESTIONS.map((prompt) => (
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
          <div className="composer">
            <textarea
              ref={input}
              rows={1}
              value={draft}
              placeholder={key ? (active ? "Follow up…" : "Ask the agent…") : "Add your Cursor API key to start"}
              disabled={!key}
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

      <About open={about} onClose={closeAbout} hasKey={!!key} appId={where.appId} cloud={where.cloud} />

      <NotesRail />
    </div>
  );
}
