import { BaseService } from '../../shared/base/baseService';
import { Tier } from '../../users/types';
import {
    SubscriptionPricingRepository,
    subscriptionPricingRepository,
} from '../repositories/subscriptionPricing.repository';
import { SubscriptionPrice, SubscriptionPriceRequest } from '../types';

export class SubscriptionPricingService extends BaseService<SubscriptionPrice, SubscriptionPriceRequest> {
    private constructor(protected readonly repository: SubscriptionPricingRepository) {
        super(repository);
    }

    public async findByTier(tier: Tier): Promise<SubscriptionPrice> {
        return this.repository.findByTier(tier);
    }

    public async findByPriceId(priceId: string): Promise<SubscriptionPrice> {
        return this.repository.findByPriceId(priceId);
    }
}

export const subscriptionPriceService =
    SubscriptionPricingService.getInstance<SubscriptionPricingService>(subscriptionPricingRepository);
