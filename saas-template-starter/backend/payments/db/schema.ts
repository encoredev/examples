import { relations } from 'drizzle-orm';
import * as p from 'drizzle-orm/pg-core';
import { pgEnum } from 'drizzle-orm/pg-core';
import { users } from '../../users/db/schema';

export const tierEnum = pgEnum('tier', ['FREE', 'PRO', 'PREMIUM', 'ENTERPRISE']);

export const subscriptionPriceTags = p.pgTable('subscription_price_tags', {
    id: p.uuid().defaultRandom().primaryKey(),
    priceId: p.text('price_id').notNull(),
    tier: tierEnum().default('FREE').notNull(),
    price: p.integer().notNull(),
    currency: p.text().notNull(),
    createdAt: p.timestamp('created_at').defaultNow().notNull(),
    updatedAt: p
        .timestamp('updated_at')
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
});

export const productPriceTags = p.pgTable('product_price_tags', {
    id: p.uuid().defaultRandom().primaryKey(),
    priceId: p.text('price_id').notNull(),
    productId: p.text('product_id').notNull(),
    price: p.integer().notNull(),
    currency: p.text().notNull(),
    createdAt: p.timestamp('created_at').defaultNow().notNull(),
    updatedAt: p
        .timestamp('updated_at')
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
});

export const subscriptionDetails = p.pgTable('subscription_details', {
    id: p.uuid().defaultRandom().primaryKey(),
    userId: p.text('user_id').notNull(),
    subscriptionId: p.text('subscription_id').notNull(),
    eventType: p.text('event_type').notNull(),
    priceId: p.text('price_id').notNull(),
    invoiceId: p.text('invoice_id').notNull(),
    isCancelled: p.boolean('is_cancelled').default(false).notNull(),
    discountAmount: p.integer('discount_amount').default(0).notNull(),
    discountPercentage: p.integer('discount_percentage').default(0).notNull(),
    createdAt: p.timestamp('created_at').defaultNow().notNull(),
    updatedAt: p
        .timestamp('updated_at')
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
});

// Keep the ORM-level relations for type safety
export const subscriptionDetailsRelations = relations(subscriptionDetails, ({ one }) => ({
    user: one(users, {
        fields: [subscriptionDetails.userId],
        references: [users.id],
    }),
}));

export const usersSubscriptionDetailsRelations = relations(users, ({ many }) => ({
    subscriptionDetails: many(subscriptionDetails),
}));
