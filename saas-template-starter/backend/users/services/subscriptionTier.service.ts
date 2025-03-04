import { BaseService } from '../../shared/base/baseService';
import { SubscriptionTierRepository, subscriptionTierRepository } from '../repositories/subscriptionTier.repository';
import { SubscriptionTier, SubscriptionTierRequest } from '../types';

export class SubscriptionTierService extends BaseService<SubscriptionTier, SubscriptionTierRequest> {
    private constructor(protected readonly repository: SubscriptionTierRepository) {
        super(repository);
    }
}

export const subscriptionTierService =
    SubscriptionTierService.getInstance<SubscriptionTierService>(subscriptionTierRepository);
