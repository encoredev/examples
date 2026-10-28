import { useState } from "react";

// Asks for the visitor's own Cursor API key. It stays in this browser and is
// sent with each message; the server uses it for that run and never stores it.
export default function KeyForm(props: { onSave(key: string): void; onCancel?(): void }) {
  const [value, setValue] = useState("");
  return (
    <form
      className="setup"
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) props.onSave(value.trim());
      }}
    >
      <div className="setup-title">Add your Cursor API key</div>
      <p className="setup-text">
        Create one at{" "}
        <a href="https://cursor.com/dashboard/api" target="_blank" rel="noreferrer">
          cursor.com/dashboard/api
        </a>
        . It stays in this browser and goes with each message you send. The app uses it for that message and never
        stores it.
      </p>
      <div className="key-row">
        <input
          className="key-input"
          type="password"
          autoComplete="off"
          spellCheck={false}
          placeholder="Paste your key"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button className="key-save" disabled={!value.trim()}>
          Save
        </button>
        {props.onCancel && (
          <button type="button" className="ghost" onClick={props.onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
