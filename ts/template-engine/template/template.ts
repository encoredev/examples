import { api } from "encore.dev/api";
import { APICallMeta, currentRequest } from "encore.dev";
import ejs, { Options } from "ejs";

const BASE_PATH = "./template/views";
const ejsOptions: Options = { views: [BASE_PATH] };

export const serveSpecificTemplate = api.raw(
  { expose: true, path: "/person", method: "GET" },
  async (req, resp) => {
    const viewPath = `${BASE_PATH}/person.html`;
    const html = await ejs.renderFile(
      viewPath,
      // Supplying data to the view
      { name: "Simon" },
      ejsOptions,
    );
    resp.setHeader("content-type", "text/html");
    resp.end(html);
  },
);

export const servePathTemplate = api.raw(
  { expose: true, path: "/!path", method: "GET" },
  async (req, resp) => {
    const { path } = (currentRequest() as APICallMeta).pathParams;
    const viewPath = `${BASE_PATH}/${path ?? "index"}.html`;
    const html = await ejs.renderFile(viewPath, ejsOptions);
    resp.setHeader("content-type", "text/html");
    resp.end(html);
  },
);

const inlineHTML = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="/public/styles.css" >
  </head>
  <body>
    <h1>Static Inline HTML Example</h1>
    <h1>Name: <%= name %>!</h1>
  </body>
</html>
`;

export const serveInlineHTML = api.raw(
  { expose: true, path: "/html", method: "GET" },
  async (req, resp) => {
    const html = ejs.render(inlineHTML, { name: "Simon" });
    resp.setHeader("Content-Type", "text/html");
    resp.end(html);
  },
);

// Serve all files in the ./assets directory under the /public path prefix.
export const assets = api.static({
  expose: true,
  path: "/public/*path",
  dir: "./assets",
});
