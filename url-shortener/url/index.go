package url

import (
	"net/http"
	"strings"
)

// Landing page with usage instructions.
//
//encore:api public raw path=/!path
func Index(w http.ResponseWriter, req *http.Request) {
	host := req.Host
	if host == "" {
		host = "localhost:4000"
	}
	proto := req.Header.Get("X-Forwarded-Proto")
	if proto == "" {
		proto = "http"
	}
	baseUrl := proto + "://" + host

	w.Header().Set("Content-Type", "text/html")
	w.Write([]byte(strings.ReplaceAll(urlLandingPage, "{{baseUrl}}", baseUrl)))
}

const urlLandingPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>URL Shortener</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #0a0a0a; color: #e5e5e5; padding: 2rem; max-width: 720px; margin: 0 auto; line-height: 1.6; }
    h1 { font-size: 1.75rem; margin-bottom: 0.5rem; color: #fff; }
    h2 { font-size: 1.1rem; margin-top: 2rem; margin-bottom: 0.75rem; color: #fff; }
    p { margin-bottom: 1rem; color: #a3a3a3; }
    code { background: #1a1a1a; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.9em; color: #e5e5e5; }
    pre { background: #1a1a1a; border: 1px solid #262626; border-radius: 8px; padding: 1rem; overflow-x: auto; margin-bottom: 1rem; }
    pre code { background: none; padding: 0; }
    .endpoint { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
    .method { font-size: 0.75rem; font-weight: 600; padding: 0.2rem 0.5rem; border-radius: 4px; font-family: monospace; }
    .post { background: #1d4ed8; color: #fff; }
    .get { background: #15803d; color: #fff; }
    .path { font-family: monospace; color: #e5e5e5; }
    .desc { color: #737373; font-size: 0.9rem; margin-bottom: 1.25rem; }
    a { color: #60a5fa; }
    .badge { display: inline-block; background: #15803d; color: #fff; font-size: 0.7rem; padding: 0.15rem 0.5rem; border-radius: 999px; margin-left: 0.5rem; font-weight: 600; vertical-align: middle; position: relative; top: -0.15em; }
  </style>
</head>
<body>
  <h1>URL Shortener <span class="badge">Encore.go</span></h1>
  <p>A URL shortening service with a Postgres database. Shorten URLs, then retrieve them by their short ID. Demonstrates Encore's built-in database management with automatic migrations.</p>

  <p>Explore and test endpoints in the <a href="http://localhost:9400/">Local Dashboard</a> when running locally. When deployed to <a href="https://app.encore.cloud">Encore Cloud</a>, use the Service Catalog to call endpoints and view traces to see how requests flow between services.</p>

  <h2>Setup</h2>
  <p>No configuration needed. The Postgres database is provisioned automatically when you run <code>encore run</code>.</p>

  <h2>Endpoints</h2>

  <div class="endpoint">
    <span class="method post">POST</span>
    <span class="path">/url</span>
    <code>url.Shorten</code>
  </div>
  <p class="desc">Shorten a URL. Returns a short ID you can use to retrieve it.</p>
  <pre><code>curl -X POST {{baseUrl}}/url \
  -H "Content-Type: application/json" \
  -d '{"URL": "https://encore.dev"}'</code></pre>

  <div class="endpoint">
    <span class="method get">GET</span>
    <span class="path">/url/:id</span>
    <code>url.Get</code>
  </div>
  <p class="desc">Retrieve the original URL by its short ID.</p>
  <pre><code>curl {{baseUrl}}/url/&lt;short_id&gt;</code></pre>

</body>
</html>`
