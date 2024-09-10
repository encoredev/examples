import { SQLDatabase } from "encore.dev/storage/sqldb";
import { Sequelize } from "sequelize";

// Define a database named 'encore_sequelize_test', using the database migrations
// in the "./migrations" folder. Encore automatically provisions,
// migrates, and connects to the database.
const DB = new SQLDatabase('encore_sequelize_test', {
  migrations: './migrations',
});

const sequelize = new Sequelize(DB.connectionString);

export { sequelize };
