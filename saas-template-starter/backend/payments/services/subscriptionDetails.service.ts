import { BaseService } from '../../shared/base/baseService';
import {
    SubscriptionDetailsRepository,
    subscriptionDetailsRepository,
} from '../repositories/subscriptionDetails.repository';
import { SubscriptionDetail, SubscriptionDetailRequest } from '../types';

export class SubscriptionDetailService extends BaseService<SubscriptionDetail, SubscriptionDetailRequest> {
    private constructor(protected readonly repository: SubscriptionDetailsRepository) {
        super(repository);
    }

    public async findBySubscriptionId(subscriptionId: string): Promise<SubscriptionDetail> {
        return this.repository.findBySubscriptionId(subscriptionId);
    }

    public async cancelSubscription(subscriptionId: string): Promise<void> {
        return this.repository.cancelSubscription(subscriptionId);
    }
}

export const subscriptionDetailService =
    SubscriptionDetailService.getInstance<SubscriptionDetailService>(subscriptionDetailsRepository);
