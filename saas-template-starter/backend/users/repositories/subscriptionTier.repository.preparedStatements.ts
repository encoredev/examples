import { eq, sql } from 'drizzle-orm';
import { db } from '../db/db';
import { subscriptionTiers } from '../db/schema';
import Singleton from '../../shared/base/singelton';

export class SubscriptionTierPreparedStatements extends Singleton {
    private constructor() {
        super();
    }

    public readonly findOne = db
        .select()
        .from(subscriptionTiers)
        .where(eq(subscriptionTiers.userId, sql.placeholder('userId')))
        .prepare('find_subscription_tier');

    public readonly findAll = db.select().from(subscriptionTiers).prepare('find_subscription_tiers');

    public readonly createSubscriptionTier = db
        .insert(subscriptionTiers)
        .values({
            tier: sql.placeholder('tier'),
        })
        .returning()
        .prepare('create_subscription');

    public readonly updateOne = db
        .update(subscriptionTiers)
        .set(sql.placeholder('subscriptionTierData') as Partial<typeof subscriptionTiers.$inferInsert>)
        .where(eq(subscriptionTiers.userId, sql.placeholder('userId')))
        .returning()
        .prepare('update_subscription_tier');

    public readonly deleteOne = db
        .delete(subscriptionTiers)
        .where(eq(subscriptionTiers.userId, sql.placeholder('userId')))
        .prepare('delete_subscription_tier');
}

export const subscriptionTierPreparedStatements =
    SubscriptionTierPreparedStatements.getInstance<SubscriptionTierPreparedStatements>();
