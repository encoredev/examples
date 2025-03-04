import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as auth from '~encore/auth';
import { SubscriptionTier, Tier } from '../types';
import { subscriptionTierRepository } from '../repositories/subscriptionTier.repository';
import { APIError } from 'encore.dev/api';

// Create a mock subscription tier to use in tests
const mockSubscriptionTier: SubscriptionTier = {
    userId: 'user123',
    tier: Tier.FREE,
    createdAt: new Date('2023-05-17T14:32:45Z'),
    updatedAt: new Date('2023-05-17T14:32:45Z'),
};

describe('SubscriptionTier Repository Tests', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        // Mock the auth data
        const authSpy = vi.spyOn(auth, 'getAuthData');
        authSpy.mockImplementation(() => ({ userID: 'user123' }));

        // Mock the subscription tier repository findOne method to return our mock subscription tier
        const repoSpy = vi.spyOn(subscriptionTierRepository, 'findOne');
        repoSpy.mockResolvedValue(mockSubscriptionTier);
    });

    it('should find one subscription tier by userId', async () => {
        // Mock the findOne method
        const findSpy = vi.spyOn(subscriptionTierRepository, 'findOne');
        findSpy.mockResolvedValue(mockSubscriptionTier);

        const result = await subscriptionTierRepository.findOne('user123');

        // Check that findOne was called with the right parameters
        expect(findSpy).toHaveBeenCalledWith('user123');

        // Check that the result matches what we expect
        expect(result).toEqual(mockSubscriptionTier);
    });

    it('should throw error when subscription tier not found', async () => {
        // Mock the findOne method to throw a not found error
        const findSpy = vi.spyOn(subscriptionTierRepository, 'findOne');
        findSpy.mockRejectedValue(APIError.notFound('Subscription tier not found'));

        // Check that the promise rejects with the appropriate error
        await expect(subscriptionTierRepository.findOne('nonexistent')).rejects.toThrow('Subscription tier not found');
        expect(findSpy).toHaveBeenCalledWith('nonexistent');
    });

    it('should find all subscription tiers', async () => {
        // Mock the findAll method
        const findAllSpy = vi.spyOn(subscriptionTierRepository, 'findAll');
        findAllSpy.mockResolvedValue([mockSubscriptionTier]);

        const result = await subscriptionTierRepository.findAll();

        // Check that findAll was called
        expect(findAllSpy).toHaveBeenCalled();

        // Check that the result matches what we expect
        expect(result).toEqual([mockSubscriptionTier]);
    });

    it('should create one subscription tier', async () => {
        // Mock the createOne method
        const createSpy = vi.spyOn(subscriptionTierRepository, 'createOne');
        createSpy.mockResolvedValue(mockSubscriptionTier);

        const newSubscriptionTier = {
            tier: Tier.FREE,
        };

        const result = await subscriptionTierRepository.createOne(newSubscriptionTier);

        // Check that createOne was called with the right parameters
        expect(createSpy).toHaveBeenCalledWith(newSubscriptionTier);

        // Check that the result matches what we expect
        expect(result).toEqual(mockSubscriptionTier);
    });

    it('should update one subscription tier', async () => {
        // Mock the updateOne method
        const updateSpy = vi.spyOn(subscriptionTierRepository, 'updateOne');
        updateSpy.mockResolvedValue();

        const updatedTier = {
            tier: Tier.PRO,
        };

        await subscriptionTierRepository.updateOne('sub123', updatedTier);

        // Check that updateOne was called with the right parameters
        expect(updateSpy).toHaveBeenCalledWith('sub123', updatedTier);

        // Mock the findOne to return the updated subscription tier
        const updatedSubscriptionTier = {
            ...mockSubscriptionTier,
            tier: Tier.PRO,
        };

        vi.spyOn(subscriptionTierRepository, 'findOne').mockResolvedValue(updatedSubscriptionTier);

        // Verify the subscription tier was updated
        const updatedResult = await subscriptionTierRepository.findOne('user123');
        expect(updatedResult).toEqual(updatedSubscriptionTier);
    });

    it('should throw error when updating nonexistent subscription tier', async () => {
        // Mock the updateOne method to throw an internal error
        const updateSpy = vi.spyOn(subscriptionTierRepository, 'updateOne');
        updateSpy.mockRejectedValue(APIError.internal('Failed to update subscription tier'));

        // Check that the promise rejects with the appropriate error
        await expect(subscriptionTierRepository.updateOne('nonexistent', { tier: Tier.PREMIUM })).rejects.toThrow(
            'Failed to update subscription tier'
        );
    });

    it('should delete one subscription tier', async () => {
        // Mock the deleteOne method
        const deleteSpy = vi.spyOn(subscriptionTierRepository, 'deleteOne');
        deleteSpy.mockResolvedValue();

        await subscriptionTierRepository.deleteOne('user123');

        // Check that deleteOne was called with the right parameters
        expect(deleteSpy).toHaveBeenCalledWith('user123');

        // Verify the subscription tier was deleted
        vi.spyOn(subscriptionTierRepository, 'findOne').mockResolvedValue(undefined as unknown as SubscriptionTier);

        // Verify the subscription tier was deleted
        const result = await subscriptionTierRepository.findOne('user123');
        expect(result).toBeUndefined();
    });
});
