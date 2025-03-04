import { api } from 'encore.dev/api';
import { subscriptionTierService } from '../services/subscriptionTier.service';
import { SubscriptionTierRequest } from '../types';

/**
 * This endpoint is used to update subscriptionTier of a user.
 * It is not exposed to the frontend, so it is not a public endpoint.
 */
export const updateSubscriptionTier = api<SubscriptionTierRequest>(
    { expose: false, method: 'PUT', path: '/subscriptionTier', auth: false },
    async (req): Promise<void> => {
        return subscriptionTierService.updateOne(req.userId, req);
    }
);
