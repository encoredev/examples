import express, { Express } from "express";
import cors from "cors";
import getRequestExample from "./get-request-example";
import microserviceExample from "./microservice-example";
import authExample from "./auth-example";
import postRequestExample from "./post-request-example";
import databaseExample from "./database-example";
import validationExample from "./validation-example";
import errorHandlingExample from "./error-handling-example";
import templateExample from "./template-example";
import staticAssetsExample from "./static-assets-example";

const app: Express = express();
const port = process.env.PORT || 3000;

app
  .use(cors()) // Enable CORS, requires the `cors` package
  .use(express.json()) // Enable JSON parsing
  .set("view engine", "pug") // Set view engine to Pug
  .use(getRequestExample)
  .use(postRequestExample)
  .use(authExample)
  .use(databaseExample)
  .use(microserviceExample)
  .use(validationExample)
  .use(templateExample)
  .use(staticAssetsExample)
  .use(errorHandlingExample);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
