import express, {
  Express,
  request,
  Request,
  response,
  Response,
} from "express";
import { RawRequest, RawResponse } from "encore.dev/api";

// Extending Express.js request and response objects to work with the Encore-provided types
Object.setPrototypeOf(request, RawRequest.prototype);
Object.setPrototypeOf(response, RawResponse.prototype);

const app: Express = express();

app.use(express.json()).set("view engine", "pug");

app.get("/express", (_: Request, res: Response) => {
  res.json({ message: "Hello from Express.js" });
});

app.get("/html", (_, res) => {
  res.render("index", { title: "Hey", message: "Hello there!" });
});

// No need to an app.listen function as Encore will handle that for us

export default app;
