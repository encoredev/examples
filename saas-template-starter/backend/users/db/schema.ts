import { relations } from 'drizzle-orm';
import * as p from 'drizzle-orm/pg-core';
import { pgEnum } from 'drizzle-orm/pg-core';

// Define the Tier enum
export const tierEnum = pgEnum('tier', ['FREE', 'PRO', 'PREMIUM', 'ENTERPRISE']);

export const users = p.pgTable('users', {
    id: p.text().primaryKey(),
    firstName: p.text('first_name').notNull(),
    lastName: p.text('last_name').notNull(),
    email: p.text().unique().notNull(),
    isDeleted: p.boolean('is_deleted').default(false).notNull(),
    createdAt: p.timestamp('created_at').defaultNow().notNull(),
    updatedAt: p
        .timestamp('updated_at')
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
});

export const subscriptionTiers = p.pgTable('subscription_tiers', {
    userId: p.uuid().defaultRandom().primaryKey(),
    tier: tierEnum().default('FREE').notNull(),
    createdAt: p.timestamp('created_at').defaultNow(),
    updatedAt: p
        .timestamp('updated_at')
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const subscriptionTierUsersAssignment = p.pgTable('subscription_tier_users_assignment', {
    userId: p
        .text()
        .notNull()
        .references(() => users.id),
    subscriptionTierId: p
        .uuid()
        .notNull()
        .references(() => subscriptionTiers.userId),
});

export const usersSubscriptionTiersRelations = relations(users, ({ one }) => ({
    subscriptionTier: one(subscriptionTiers, {
        fields: [users.id],
        references: [subscriptionTiers.userId],
        relationName: 'subscriptionTier_to_user',
    }),
}));

export const subscriptionTiersRelations = relations(subscriptionTiers, ({ one }) => ({
    user: one(users, {
        fields: [subscriptionTiers.userId],
        references: [users.id],
        relationName: 'user_to_subscriptionTier',
    }),
}));
