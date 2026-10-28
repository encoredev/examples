import { useEffect, useState } from "react";
import { ago, api } from "../lib/api";
import type { notes } from "../lib/client";

// What the agent has saved, polled so a note shows up as soon as the agent's
// save_note call lands. The notes live in their own service and database.
export default function NotesRail() {
  const [items, setItems] = useState<notes.Note[]>([]);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const { notes } = await api.notes.list();
      if (alive) setItems(notes);
    };
    load().catch(() => {});
    const t = window.setInterval(() => load().catch(() => {}), 2500);
    return () => {
      alive = false;
      window.clearInterval(t);
    };
  }, []);

  return (
    <aside className="rail">
      <div className="rail-head">
        <span className="rail-title">Notes</span>
        <span className="thread-meta">{items.length || ""}</span>
      </div>
      <div className="notes">
        {items.length === 0 && (
          <div className="empty-threads">Nothing saved yet. Tell the agent something worth remembering.</div>
        )}
        {items.map((n) => (
          <div key={n.id} className="note">
            <div className="note-head">
              <span className="note-title">{n.title}</span>
              <span className="thread-meta">{ago(n.updatedAt)}</span>
            </div>
            <div className="note-body">{n.body}</div>
          </div>
        ))}
      </div>
    </aside>
  );
}
