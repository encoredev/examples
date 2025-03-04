import { eq, sql } from 'drizzle-orm';
import { db } from '../db/db';
import { subscriptionDetails } from '../db/schema';
import Singleton from '../../shared/base/singelton';

export class SubscriptionDetailsPreparedStatements extends Singleton {
    private constructor() {
        super();
    }

    public readonly findOne = db
        .select()
        .from(subscriptionDetails)
        .where(eq(subscriptionDetails.userId, sql.placeholder('userId')))
        .prepare('find_payment');

    public readonly findBySubscriptionId = db
        .select()
        .from(subscriptionDetails)
        .where(eq(subscriptionDetails.subscriptionId, sql.placeholder('subscriptionId')))
        .prepare('find_payment_by_subscription_id');

    public readonly findPayments = db.select().from(subscriptionDetails).prepare('find_payments');

    public readonly createOne = db
        .insert(subscriptionDetails)
        .values({
            userId: sql.placeholder('userId'),
            subscriptionId: sql.placeholder('subscriptionId'),
            eventType: sql.placeholder('eventType'),
            priceId: sql.placeholder('priceId'),
            invoiceId: sql.placeholder('invoiceId'),
            isCancelled: sql.placeholder('isCancelled'),
            discountAmount: sql.placeholder('discountAmount'),
            discountPercentage: sql.placeholder('discountPercentage'),
        })
        .returning()
        .prepare('create_payment');

    public readonly updateOne = db
        .update(subscriptionDetails)
        .set(sql.placeholder('paymentData') as Partial<typeof subscriptionDetails.$inferInsert>)
        .where(eq(subscriptionDetails.id, sql.placeholder('id')))
        .returning()
        .prepare('update_payment');

    public readonly cancelSubscription = db
        .update(subscriptionDetails)
        .set({ isCancelled: true })
        .where(eq(subscriptionDetails.id, sql.placeholder('subscriptionId')))
        .returning()
        .prepare('cancel_subscription');

    public readonly deleteOne = db
        .delete(subscriptionDetails)
        .where(eq(subscriptionDetails.id, sql.placeholder('id')))
        .prepare('delete_payment');
}

export const subscriptionDetailsPreparedStatements =
    SubscriptionDetailsPreparedStatements.getInstance<SubscriptionDetailsPreparedStatements>();
