import { api } from "encore.dev/api";
import { IncomingMessage } from "http";
import { connectDB } from "./db";
import { helloProvider } from "./modules/hello.provider";


connectDB()


function getBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    const bodyParts: any[] = [];
    req
      .on("data", (chunk) => {
        bodyParts.push(chunk);
      })
      .on("end", () => {
        resolve(Buffer.concat(bodyParts).toString());
      });
  });
}
// Welcome to Encore!
// This is a simple "Hello World" project to get you started.
//
// To run it, execute "encore run" in your favorite shell.

// ==================================================================

// This is a simple REST API that responds with a personalized greeting.
// To call it, run in your terminal:
// console.log(UserModel)
//
//	curl http://localhost:4000/hello/World
//
export const get = api.raw(
  { expose: true, method: "GET", path: "/list" },
  async (req, resp) => {
    try {
        console.log("hello I am update")
      const response = await helloProvider.getEntityList()
      resp.end( JSON.stringify(response))
    } catch (error) {
      console.log(error)
      return  {message:"hello"}  
    }
  }
);

export const post = api.raw(
  {expose:true, method:"POST", path:"/"},
  async (req, resp) => {
    const body:
   string
    = await getBody(req);
    try {

    const response = await helloProvider.createNewEntity(JSON.parse(body))
      resp.setHeader("Content-Type", "application/json");
      resp.end(JSON.stringify(response ));
    } catch (err) {
      console.log(err)
      const e = err as Error;
      resp.statusCode = 500;
      resp.end(e.message);
      return;
    }

  },
)

interface Response {
  message: string;
}

// ==================================================================

// Encore comes with a built-in development dashboard for
// exploring your API, viewing documentation, debugging with
// distributed tracing, and more. Visit your API URL in the browser:
//
//     http://localhost:9400
//

// ==================================================================

// Next steps
//
// 1. Deploy your application to the cloud
//
//     git add -A .
//     git commit -m 'Commit message'
//     git push encore
//
// 2. To continue exploring Encore, check out these topics in docs:
//
//    Building a REST API:   https://encore.dev/docs/ts/tutorials/rest-api
//    Creating Services:      https://encore.dev/docs/ts/primitives/services
//    Creating APIs:         https://encore.dev/docs/ts/primitives/defining-apis
//    Using SQL Databases:        https://encore.dev/docs/ts/primitives/databases
//    Using Pub/Sub:         https://encore.dev/docs/ts/primitives/pubsub
//    Authenticating users:  https://encore.dev/docs/ts/develop/auth
//    Using Cron Jobs: https://encore.dev/docs/ts/primitives/cron-jobs
//    Using Secrets: https://encore.dev/docs/ts/primitives/secrets
