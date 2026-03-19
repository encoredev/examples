package slack

import (
	"net/http"
	"strings"
)

// Landing page with usage instructions.
//
//encore:api public raw path=/
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
	w.Write([]byte(strings.ReplaceAll(slackLandingPage, "{{baseUrl}}", baseUrl)))
}

const slackLandingPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Slack Bot</title>
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
    .path { font-family: monospace; color: #e5e5e5; }
    .desc { color: #737373; font-size: 0.9rem; margin-bottom: 1.25rem; }
    a { color: #60a5fa; }
    .badge { display: inline-block; background: #15803d; color: #fff; font-size: 0.7rem; padding: 0.15rem 0.5rem; border-radius: 999px; margin-left: 0.5rem; font-weight: 600; vertical-align: middle; position: relative; top: -0.15em; }
    ol { margin-bottom: 1rem; padding-left: 1.5rem; color: #a3a3a3; }
    li { margin-bottom: 0.5rem; }
  </style>
</head>
<body>
  <h1>Slack Bot <span class="badge">Encore.go</span></h1>
  <p>A Slack bot that responds to slash commands with ASCII cow art. Demonstrates Encore's secrets management and raw HTTP endpoint handling with Slack signature verification.</p>

  <p>Explore and test endpoints in the <a href="http://localhost:9400/">Local Dashboard</a> when running locally. When deployed to <a href="https://app.encore.cloud">Encore Cloud</a>, use the Service Catalog to call endpoints and view traces to see how requests flow between services.</p>

  <h2>Setup</h2>
  <ol>
    <li>Create a <a href="https://api.slack.com/apps">Slack app</a> and add a Slash Command pointing to <code>{{baseUrl}}/cowsay</code></li>
    <li>Copy the Signing Secret from your Slack app's Basic Information page</li>
    <li>Set the secret:
      <pre><code>encore secret set --type dev,local,pr,prod SlackSigningSecret</code></pre>
    </li>
  </ol>

  <h2>Endpoint</h2>

  <div class="endpoint">
    <span class="method post">POST</span>
    <span class="path">/cowsay</span>
    <code>slack.Cowsay</code>
  </div>
  <p class="desc">Receives a Slack slash command, verifies the request signature, and responds with ASCII cow art saying whatever text was sent.</p>
  <p class="desc">This is a raw HTTP endpoint that handles Slack's request format directly. In Slack, type <code>/cowsay Hello!</code> to try it.</p>

</body>
</html>`
