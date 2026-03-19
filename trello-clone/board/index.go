package board

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
	w.Write([]byte(strings.ReplaceAll(trelloLandingPage, "{{baseUrl}}", baseUrl)))
}

const trelloLandingPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trello Clone</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #0a0a0a; color: #e5e5e5; padding: 2rem; max-width: 720px; margin: 0 auto; line-height: 1.6; }
    h1 { font-size: 1.75rem; margin-bottom: 0.5rem; color: #fff; }
    h2 { font-size: 1.1rem; margin-top: 2rem; margin-bottom: 0.75rem; color: #fff; }
    h3 { font-size: 0.95rem; margin-top: 1.5rem; margin-bottom: 0.5rem; color: #d4d4d4; }
    p { margin-bottom: 1rem; color: #a3a3a3; }
    code { background: #1a1a1a; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.9em; color: #e5e5e5; }
    pre { background: #1a1a1a; border: 1px solid #262626; border-radius: 8px; padding: 1rem; overflow-x: auto; margin-bottom: 1rem; }
    pre code { background: none; padding: 0; }
    .endpoint { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
    .method { font-size: 0.75rem; font-weight: 600; padding: 0.2rem 0.5rem; border-radius: 4px; font-family: monospace; }
    .post { background: #1d4ed8; color: #fff; }
    .get { background: #15803d; color: #fff; }
    .put { background: #b45309; color: #fff; }
    .path { font-family: monospace; color: #e5e5e5; }
    .desc { color: #737373; font-size: 0.9rem; margin-bottom: 1.25rem; }
    a { color: #60a5fa; }
    .badge { display: inline-block; background: #15803d; color: #fff; font-size: 0.7rem; padding: 0.15rem 0.5rem; border-radius: 999px; margin-left: 0.5rem; font-weight: 600; vertical-align: middle; position: relative; top: -0.15em; }
  </style>
</head>
<body>
  <h1>Trello Clone <span class="badge">Encore.go</span></h1>
  <p>A microservices-based Trello clone with boards, columns, and cards. Demonstrates multi-service architecture with separate databases per service and cross-service communication.</p>

  <p>Explore and test endpoints in the <a href="http://localhost:9400/">Local Dashboard</a> when running locally. When deployed to <a href="https://app.encore.cloud">Encore Cloud</a>, use the Service Catalog to call endpoints and view traces to see how requests flow between services.</p>

  <h2>Setup</h2>
  <p>No configuration needed. The Postgres databases are provisioned automatically when you run <code>encore run</code>. Each service (board, card) gets its own database.</p>

  <h2>Try it</h2>
  <p>Create a board, add columns, then add cards to the columns:</p>

  <pre><code># 1. Create a board
curl -X POST {{baseUrl}}/board.Create \
  -d '{"Name": "My Board"}'

# 2. Add columns to the board
curl -X POST {{baseUrl}}/board.CreateColumn \
  -d '{"BoardID": 1, "Name": "To Do"}'

curl -X POST {{baseUrl}}/board.CreateColumn \
  -d '{"BoardID": 1, "Name": "In Progress"}'

curl -X POST {{baseUrl}}/board.CreateColumn \
  -d '{"BoardID": 1, "Name": "Done"}'

# 3. Add a card to a column
curl -X POST {{baseUrl}}/board.AddCard \
  -d '{"BoardID": 1, "ColumnID": 1, "Title": "My first task"}'

# 4. View the full board with columns and cards
curl {{baseUrl}}/board.Get -d '{"ID": 1}'</code></pre>

  <h2>Endpoints</h2>

  <h3>Boards</h3>

  <div class="endpoint">
    <span class="method post">POST</span>
    <span class="path">/board.Create</span>
    <code>board.Create</code>
  </div>
  <p class="desc">Create a new board.</p>

  <div class="endpoint">
    <span class="method post">POST</span>
    <span class="path">/board.List</span>
    <code>board.List</code>
  </div>
  <p class="desc">List all boards.</p>

  <div class="endpoint">
    <span class="method post">POST</span>
    <span class="path">/board.Get</span>
    <code>board.Get</code>
  </div>
  <p class="desc">Get a board with its columns and cards.</p>

  <h3>Columns</h3>

  <div class="endpoint">
    <span class="method post">POST</span>
    <span class="path">/board.CreateColumn</span>
    <code>board.CreateColumn</code>
  </div>
  <p class="desc">Add a column to a board.</p>

  <div class="endpoint">
    <span class="method post">POST</span>
    <span class="path">/board.AddCard</span>
    <code>board.AddCard</code>
  </div>
  <p class="desc">Add a card to a column on a board.</p>

  <h3>Cards</h3>

  <div class="endpoint">
    <span class="method post">POST</span>
    <span class="path">/card.Get</span>
    <code>card.Get</code>
  </div>
  <p class="desc">Get a specific card by ID.</p>

  <div class="endpoint">
    <span class="method post">POST</span>
    <span class="path">/card.Update</span>
    <code>card.Update</code>
  </div>
  <p class="desc">Update a card's title, description, or move it to another column.</p>

</body>
</html>`
