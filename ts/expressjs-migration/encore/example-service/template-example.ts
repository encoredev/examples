import { api } from "encore.dev/api";
import Handlebars from "handlebars";

const html = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <link rel="stylesheet" href="/assets/styles.css">
</head>
<body>
<h1>Hello {{name}}!</h1>
</body>
</html>
`;

// Making use of raw endpoints to serve dynamic templates.
// https://encore.dev/docs/ts/primitives/defining-apis#raw-endpoints
export const serveHTML = api.raw(
  { expose: true, path: "/html", method: "GET" },
  async (req, resp) => {
    const template = Handlebars.compile(html);

    resp.setHeader("Content-Type", "text/html");
    resp.end(template({ name: "Simon" }));
  },
);
