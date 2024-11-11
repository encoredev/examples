import { SQLDatabase } from "encore.dev/storage/sqldb";
import knex from "knex";
import {UserDto} from "./user.interface";

// Create SQLDatabase instance with migrations configuration
const SiteDB = new SQLDatabase("siteDB", {
  migrations: "./migrations",
});

// Initialize Knex with the database connection string
export const orm = knex({
  client: "pg",
  connection: SiteDB.connectionString,
});

export const users = () => orm<UserDto>("users");