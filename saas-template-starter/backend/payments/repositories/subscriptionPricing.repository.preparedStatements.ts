import { eq, sql } from 'drizzle-orm';
import { db } from '../db/db';
import { subscriptionPriceTags } from '../db/schema';
import Singleton from '../../shared/base/singelton';

export class SubscriptionPricingPreparedStatements extends Singleton {
    private constructor() {
        super();
    }

    public readonly findOne = db
        .select()
        .from(subscriptionPriceTags)
        .where(eq(subscriptionPriceTags.tier, sql.placeholder('tier')))
        .prepare('find_subscription_price_by_id');

    public readonly findByTier = db
        .select()
        .from(subscriptionPriceTags)
        .where(eq(subscriptionPriceTags.tier, sql.placeholder('tier')))
        .prepare('find_subscription_price_by_tier');

    public readonly findByPriceId = db
        .select()
        .from(subscriptionPriceTags)
        .where(eq(subscriptionPriceTags.priceId, sql.placeholder('priceId')))
        .prepare('find_subscription_price_by_price_id');

    public readonly findAll = db.select().from(subscriptionPriceTags).prepare('find_all_subscription_prices');

    public readonly createOne = db
        .insert(subscriptionPriceTags)
        .values({
            priceId: sql.placeholder('priceId'),
            tier: sql.placeholder('tier'),
            price: sql.placeholder('price'),
            currency: sql.placeholder('currency'),
        })
        .returning()
        .prepare('create_subscription_price');

    public readonly updateOne = db
        .update(subscriptionPriceTags)
        .set(sql.placeholder('subscriptionPriceData') as Partial<typeof subscriptionPriceTags.$inferInsert>)
        .where(eq(subscriptionPriceTags.id, sql.placeholder('id')))
        .returning()
        .prepare('update_subscription_price');

    public readonly deleteOne = db
        .delete(subscriptionPriceTags)
        .where(eq(subscriptionPriceTags.priceId, sql.placeholder('priceId')))
        .returning()
        .prepare('delete_subscription_price');
}

export const subscriptionPricingPreparedStatements =
    SubscriptionPricingPreparedStatements.getInstance<SubscriptionPricingPreparedStatements>();
