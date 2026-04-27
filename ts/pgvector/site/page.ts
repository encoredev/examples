import { api } from "encore.dev/api";

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>pgvector + Encore</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #EEEEE1; color: #111111; line-height: 1.6; }
    .wrap { max-width: 960px; margin: 0 auto; padding: 40px 20px; }
    h1 { font-size: 24px; font-weight: 600; margin-bottom: 4px; letter-spacing: -0.02em; }
    .subtitle { color: #666; margin-bottom: 24px; font-size: 14px; }
    .layout { display: flex; gap: 32px; }
    .main { flex: 1; min-width: 0; }
    .sidebar { width: 260px; flex-shrink: 0; align-self: flex-start; position: sticky; top: 40px; }
    .card { background: #fff; border: 1px solid #ccc; padding: 20px; margin-bottom: 16px; }
    .card h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; font-weight: 600; }
    .info { border: 1px solid #ccc; padding: 16px; font-size: 12px; line-height: 1.7; background: #fff; }
    .info h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; margin-bottom: 6px; margin-top: 14px; }
    .info h3:first-child { margin-top: 0; }
    .info p { color: #555; margin-bottom: 8px; }
    .info code { background: #EEEEE1; padding: 1px 4px; font-size: 11px; }
    .info ul { padding-left: 14px; color: #555; margin-bottom: 8px; }
    .info li { margin-bottom: 2px; }
    .info a { color: #4651FF; text-decoration: none; }
    .info a:hover { text-decoration: underline; }
    label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 4px; }
    input, textarea { width: 100%; padding: 7px 10px; border: 1px solid #ccc; font-size: 13px; margin-bottom: 6px; background: #fff; font-family: inherit; }
    textarea { resize: vertical; min-height: 80px; }
    button { background: #111; color: #EEEEE1; border: none; padding: 8px 16px; font-size: 13px; cursor: pointer; font-weight: 500; width: 100%; }
    button:hover { background: #333; }
    button:disabled { background: #999; cursor: not-allowed; }
    .status { margin-top: 10px; padding: 10px; font-size: 12px; display: none; }
    .status.success { display: block; background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
    .status.error { display: block; background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
    .results { margin-top: 12px; }
    .result { border: 1px solid #ccc; padding: 12px; margin-bottom: 8px; background: #fff; font-size: 13px; }
    .result-meta { display: flex; justify-content: space-between; font-size: 11px; color: #666; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.04em; }
    .result-similarity { color: #4651FF; font-weight: 600; }
    .empty { font-size: 12px; color: #888; padding: 8px 0; }
    .seed { display: inline-block; font-size: 12px; color: #4651FF; cursor: pointer; margin-top: 4px; background: none; border: none; padding: 0; width: auto; text-decoration: underline; }
    .seed:hover { background: none; color: #2c34c2; }
    @media (max-width: 768px) { .layout { flex-direction: column; } .sidebar { width: 100%; } }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>pgvector + Encore</h1>
    <p class="subtitle">Semantic search with Postgres &mdash; no separate vector database needed</p>
    <div class="layout">
      <div class="main">
        <div class="card">
          <h2>Add a document</h2>
          <form id="add-form">
            <label for="content">Content</label>
            <textarea id="content" name="content" placeholder="The mitochondrion is the powerhouse of the cell." required></textarea>
            <button type="submit">Embed and store</button>
          </form>
          <button type="button" class="seed" id="seed">Or load some sample documents &rarr;</button>
          <div id="add-status" class="status"></div>
        </div>

        <div class="card">
          <h2>Search</h2>
          <form id="search-form">
            <label for="query">Query</label>
            <input type="text" id="query" name="query" placeholder="cellular energy production" required>
            <button type="submit">Search</button>
          </form>
          <div id="search-status" class="status"></div>
          <div id="results" class="results"></div>
        </div>
      </div>
      <div class="sidebar">
        <div class="info">
          <h3>What is pgvector?</h3>
          <p><a href="https://github.com/pgvector/pgvector">pgvector</a> is a Postgres extension that adds a <code>vector</code> column type and similarity search. Your relational data and embeddings live in one database.</p>
          <h3>How it works</h3>
          <p>The <code>documents</code> service embeds text with OpenAI's <code>text-embedding-3-small</code> model and stores it in a <code>vector(1536)</code> column. Search uses cosine distance via the <code>&lt;=&gt;</code> operator, accelerated by an HNSW index.</p>
          <h3>Encore integration</h3>
          <ul>
            <li>Postgres provisioned automatically</li>
            <li>Migration enables the <code>vector</code> extension</li>
            <li>OpenAI key stored as a secret</li>
            <li>Type-safe SQL via tagged templates</li>
          </ul>
          <h3>Next steps</h3>
          <ul>
            <li>Chunk long documents before embedding</li>
            <li>Add hybrid search (vector + full-text)</li>
            <li>Filter by metadata in the WHERE clause</li>
            <li>Deploy to production</li>
          </ul>
          <h3>Local dashboard</h3>
          <p>Open <a href="http://localhost:9400">localhost:9400</a> to explore your API docs, traces, and database. See the embedding call and SQL query in the trace view.</p>
        </div>
      </div>
    </div>
  </div>
  <script>
    const SAMPLES = [
      "The mitochondrion is the membrane-bound organelle that produces most of the cell's ATP through respiration.",
      "Photosynthesis converts light energy into chemical energy stored in glucose molecules in plant cells.",
      "Postgres is a relational database known for reliability, extensibility, and strong SQL standards compliance.",
      "Redis is an in-memory key-value store often used for caching, session storage, and real-time leaderboards.",
      "The Eiffel Tower was completed in 1889 and stands 330 meters tall on the Champ de Mars in Paris.",
      "Mount Everest, on the border of Nepal and Tibet, is the highest mountain above sea level at 8,849 meters."
    ];

    function showStatus(el, message, kind) {
      el.textContent = message;
      el.className = 'status ' + kind;
    }
    function clearStatus(el) {
      el.className = 'status';
      el.textContent = '';
    }

    async function addDocument(content) {
      const res = await fetch('/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add document');
      return data;
    }

    document.getElementById('add-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button[type="submit"]');
      const status = document.getElementById('add-status');
      const textarea = document.getElementById('content');
      btn.disabled = true;
      btn.textContent = 'Embedding...';
      clearStatus(status);
      try {
        const data = await addDocument(textarea.value);
        showStatus(status, data.message, 'success');
        textarea.value = '';
      } catch (err) {
        showStatus(status, err.message, 'error');
      }
      btn.disabled = false;
      btn.textContent = 'Embed and store';
    });

    document.getElementById('seed').addEventListener('click', async () => {
      const btn = document.getElementById('seed');
      const status = document.getElementById('add-status');
      btn.disabled = true;
      btn.textContent = 'Loading samples...';
      clearStatus(status);
      try {
        for (const content of SAMPLES) {
          await addDocument(content);
        }
        showStatus(status, 'Loaded ' + SAMPLES.length + ' sample documents', 'success');
      } catch (err) {
        showStatus(status, err.message, 'error');
      }
      btn.disabled = false;
      btn.textContent = 'Or load some sample documents →';
    });

    document.getElementById('search-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button');
      const status = document.getElementById('search-status');
      const results = document.getElementById('results');
      btn.disabled = true;
      btn.textContent = 'Searching...';
      clearStatus(status);
      results.innerHTML = '';
      try {
        const res = await fetch('/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: document.getElementById('query').value, limit: 5 })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Search failed');
        if (!data.results.length) {
          results.innerHTML = '<div class="empty">No documents yet &mdash; add some above.</div>';
        } else {
          results.innerHTML = data.results.map(r =>
            '<div class="result">' +
              '<div class="result-meta">' +
                '<span>#' + r.id + '</span>' +
                '<span class="result-similarity">' + (r.similarity * 100).toFixed(1) + '% match</span>' +
              '</div>' +
              '<div>' + escapeHtml(r.content) + '</div>' +
            '</div>'
          ).join('');
        }
      } catch (err) {
        showStatus(status, err.message, 'error');
      }
      btn.disabled = false;
      btn.textContent = 'Search';
    });

    function escapeHtml(s) {
      return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }
  </script>
</body>
</html>`;

export const page = api.raw(
  { expose: true, method: "GET", path: "/" },
  async (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.end(html);
  }
);
