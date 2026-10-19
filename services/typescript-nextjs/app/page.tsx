// The guestbook page: a Server Component that reads the entries straight from
// the service's Postgres database while rendering, and a form whose Server
// Action writes a new one. Both run on the server, inside this Encore service.
import { sign } from "./actions";

// Render at request time, so each load shows the entries as they are now (and
// `next build` doesn't query the database while prerendering).
export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  // Imported on first use: see "Building" in the README.
  const { listEntries, MAX_MESSAGE, MAX_NAME } = await import("@/db");
  const entries = await listEntries();

  return (
    <main>
      <h1>Guestbook</h1>
      <p className="lede">
        Rendered on the server from this service&apos;s Postgres database. The entries are
        also served as JSON at <a href="/api/entries">/api/entries</a>.
      </p>

      <form action={sign}>
        <input name="name" placeholder="Your name" maxLength={MAX_NAME} required />
        <textarea name="message" placeholder="Say hello" maxLength={MAX_MESSAGE} required />
        <button type="submit">Sign the guestbook</button>
        {error && <p className="error">{error}</p>}
      </form>

      {entries.length === 0 ? (
        <p className="empty">No entries yet. Be the first to sign.</p>
      ) : (
        <ul className="entries">
          {entries.map((e) => (
            <li key={e.id}>
              <p className="message">{e.message}</p>
              <p className="meta">
                {e.name} · <time dateTime={e.createdAt}>{e.createdAt.slice(0, 16).replace("T", " ")} UTC</time>
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
