import { SQLDatabase } from "encore.dev/storage/sqldb";

export const db = new SQLDatabase('subscription', {
  migrations: './migrations'
})
