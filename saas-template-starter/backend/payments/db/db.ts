import { SQLDatabase } from 'encore.dev/storage/sqldb';
import { drizzle } from 'drizzle-orm/node-postgres';
import { seed } from 'drizzle-seed';
import { subscriptionDetails } from './schema';

const DB = new SQLDatabase('payments', {
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

// Seed the database with 100 subscriptionsDetails
// await seed(db, { subscriptionDetails }, { count: 100 }).refine((func) => ({
//     subscriptionDetails: {
//         columns: {
//             id: func.uuid(),
//             discountAmount: func.int({ minValue: 0, maxValue: 100 }),
//             discountPercentage: func.int({ minValue: 0, maxValue: 100 }),
//         },
//     },
// }));

export { db };
