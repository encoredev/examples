import { SQLDatabase } from 'encore.dev/storage/sqldb';
import knex from 'knex';

// Define a database named 'appDB', using the database migrations
// in the "./migrations" folder. Encore automatically provisions,
// migrates, and connects to the database.
const DB = new SQLDatabase('appDB', {
  migrations: './migrations',
});

// Use Knex.js to connect to the database
const ORM = knex({
  client: 'pg',
  connection: DB.connectionString,
});

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () => ORM,
  },
];
