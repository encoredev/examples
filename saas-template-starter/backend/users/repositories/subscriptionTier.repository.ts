import { APIError } from 'encore.dev/api';
import { SubscriptionTier, SubscriptionTierRequest, Tier } from '../types';
import {
    subscriptionTierPreparedStatements,
    SubscriptionTierPreparedStatements,
} from './subscriptionTier.repository.preparedStatements';
import { withErrorHandling } from '../../shared/utils/withErrorHandling';
import { BaseRepository } from '../../shared/base/baseRepository';

export class SubscriptionTierRepository extends BaseRepository<SubscriptionTier, SubscriptionTierRequest> {
    private constructor(private readonly preparedStatements: SubscriptionTierPreparedStatements) {
        super();
    }

    public async findOne(userId: string): Promise<SubscriptionTier> {
        return withErrorHandling(async () => {
            const [subscriptionTier] = await this.preparedStatements.findOne.execute({
                userId,
            });
            if (!subscriptionTier) {
                throw APIError.notFound('Subscription tier not found');
            }
            return subscriptionTier as SubscriptionTier;
        }, 'Error finding subscription tier');
    }

    public async findAll(): Promise<SubscriptionTier[]> {
        return withErrorHandling(async () => {
            const subscriptionTiers = await this.preparedStatements.findAll.execute();
            return subscriptionTiers as SubscriptionTier[];
        }, 'Error finding subscription tiers');
    }

    public async createOne(newSubscriptionTierRequest: SubscriptionTierRequest): Promise<SubscriptionTier> {
        return withErrorHandling(async () => {
            const [subscriptionTier] = await this.preparedStatements.createSubscriptionTier.execute({
                tier: newSubscriptionTierRequest.tier,
            });
            return subscriptionTier as SubscriptionTier;
        }, 'Error creating subscription tier');
    }

    async updateOne(userId: string, subscriptionTierData: SubscriptionTierRequest): Promise<void> {
        return withErrorHandling(async () => {
            const [subscriptionTier] = await this.preparedStatements.updateOne.execute({
                userId,
                subscriptionTierData,
            });
            if (!subscriptionTier) {
                throw APIError.internal('Failed to update subscription tier');
            }
        }, 'Error updating subscription tier');
    }
    deleteOne(userId: string): Promise<void> {
        return withErrorHandling(async () => {
            const [subscriptionTier] = await this.preparedStatements.deleteOne.execute({ userId });
            if (!subscriptionTier) {
                throw APIError.internal('Failed to delete subscription tier');
            }
        }, 'Error deleting subscription tier');
    }
}

export const subscriptionTierRepository = SubscriptionTierRepository.getInstance<SubscriptionTierRepository>(
    subscriptionTierPreparedStatements
);
