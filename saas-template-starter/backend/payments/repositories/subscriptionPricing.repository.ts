import { APIError } from 'encore.dev/api';
import { withErrorHandling } from '../../shared/utils/withErrorHandling';
import { BaseRepository } from '../../shared/base/baseRepository';
import {
    subscriptionPricingPreparedStatements,
    SubscriptionPricingPreparedStatements,
} from './subscriptionPricing.repository.preparedStatements';
import { SubscriptionPrice, SubscriptionPriceRequest } from '../types';
import { Tier } from '../../users/types';

export class SubscriptionPricingRepository extends BaseRepository<SubscriptionPrice, SubscriptionPriceRequest> {
    protected constructor(private readonly preparedStatements: SubscriptionPricingPreparedStatements) {
        super();
    }

    findOne(id: string): Promise<SubscriptionPrice> {
        return withErrorHandling(async () => {
            const [subscriptionPrice] = await this.preparedStatements.findOne.execute({ id });
            if (!subscriptionPrice) {
                throw APIError.notFound('Subscription price not found');
            }
            return subscriptionPrice as SubscriptionPrice;
        }, 'Error finding subscription price');
    }

    findByPriceId(priceId: string): Promise<SubscriptionPrice> {
        return withErrorHandling(async () => {
            const [subscriptionPrice] = await this.preparedStatements.findByPriceId.execute({ priceId });
            if (!subscriptionPrice) {
                throw APIError.notFound(`No price found for price ID ${priceId}`);
            }
            return subscriptionPrice as SubscriptionPrice;
        }, 'Error finding subscription price by price ID');
    }

    findByTier(tier: Tier): Promise<SubscriptionPrice> {
        return withErrorHandling(async () => {
            const [subscriptionPrice] = await this.preparedStatements.findByTier.execute({ tier });
            if (!subscriptionPrice) {
                throw APIError.notFound(`No price found for tier ${tier}`);
            }
            return subscriptionPrice as SubscriptionPrice;
        }, 'Error finding subscription price by tier');
    }

    findAll(): Promise<SubscriptionPrice[]> {
        return withErrorHandling(async () => {
            const prices = await this.preparedStatements.findAll.execute();
            return prices as SubscriptionPrice[];
        }, 'Error finding all subscription prices');
    }

    createOne(data: SubscriptionPriceRequest): Promise<SubscriptionPrice> {
        return withErrorHandling(async () => {
            const [created] = await this.preparedStatements.createOne.execute({
                priceId: data.priceId,
                tier: data.tier,
                price: data.price,
                currency: data.currency,
            });

            if (!created) {
                throw APIError.internal('Failed to create subscription price');
            }
            return created as SubscriptionPrice;
        }, 'Error creating subscription price');
    }

    override updateOne(tier: Tier, subscriptionPriceData: SubscriptionPriceRequest): Promise<void> {
        return withErrorHandling(async () => {
            // First check if the price exists
            const subscriptionPrice = await this.findByTier(tier);

            if (!subscriptionPrice) {
                throw APIError.notFound('Subscription price not found');
            }

            const [updated] = await this.preparedStatements.updateOne.execute({
                subscriptionPriceData,
                id: subscriptionPrice.id,
            });

            if (!updated) {
                throw APIError.internal('Failed to update subscription price');
            }
        }, 'Error updating subscription price');
    }

    deleteOne(priceId: string): Promise<void> {
        return withErrorHandling(async () => {
            const [deleted] = await this.preparedStatements.deleteOne.execute({ priceId });

            if (!deleted) {
                throw APIError.notFound('Subscription price not found or could not be deleted');
            }
        }, 'Error deleting subscription price');
    }
}

export const subscriptionPricingRepository = SubscriptionPricingRepository.getInstance<SubscriptionPricingRepository>(
    subscriptionPricingPreparedStatements
);
