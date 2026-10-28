import { Service } from "encore.dev/service";

// Notes the agent keeps for you. Its own service and database, which the agent
// reaches through typed API calls like any other part of the app.
export default new Service("notes");
