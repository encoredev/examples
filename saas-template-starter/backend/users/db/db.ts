import { SQLDatabase } from 'encore.dev/storage/sqldb';
import { drizzle } from 'drizzle-orm/node-postgres';
import { seed } from 'drizzle-seed';
import { users } from './schema';

const DB = new SQLDatabase('users', {
    migrations: {
        path: 'migrations',
        source: 'drizzle',
    },
});

// Initialize Drizzle ORM with the connection string
if (!DB.connectionString) {
    throw new Error('Failed to initialize database connection string');
}

// Initialize Drizzle ORM with the connection string
const db = drizzle(DB.connectionString);

// Seed the database with 100 users
// await seed(db, { users }, { count: 100 }).refine((funcs) => ({
//     users: {
//         columns: {
//             id: funcs.string({ isUnique: true }),
//         }
//     }
// }));

export { db };
