import { APIError } from 'encore.dev/api';
import { withErrorHandling } from '../../shared/utils/withErrorHandling';
import { SubscriptionDetail, SubscriptionDetailRequest } from '../types';
import {
    subscriptionDetailsPreparedStatements,
    SubscriptionDetailsPreparedStatements,
} from './subscriptionDetails.repository.preparedStatements';
import { BaseRepository } from '../../shared/base/baseRepository';

export class SubscriptionDetailsRepository extends BaseRepository<SubscriptionDetail, SubscriptionDetailRequest> {
    protected constructor(private readonly preparedStatements: SubscriptionDetailsPreparedStatements) {
        super();
    }

    findOne(id: string): Promise<SubscriptionDetail> {
        return withErrorHandling(async () => {
            const [payment] = await this.preparedStatements.findOne.execute({ userId: id });
            if (!payment) {
                throw APIError.notFound('Payment not found');
            }
            return payment as SubscriptionDetail;
        }, 'Error finding payment');
    }

    findBySubscriptionId(subscriptionId: string): Promise<SubscriptionDetail> {
        return withErrorHandling(
            async () => {
                const [payment] = await this.preparedStatements.findBySubscriptionId.execute({ subscriptionId });
                if (!payment) {
                    throw APIError.notFound(`No payment found for subscription ${subscriptionId}`);
                }
                return payment as SubscriptionDetail;
            },

            'Error finding payment by subscription ID'
        );
    }

    findAll(): Promise<SubscriptionDetail[]> {
        return withErrorHandling(async () => {
            const payments = await this.preparedStatements.findPayments.execute();
            return payments as SubscriptionDetail[];
        }, 'Error finding payments');
    }

    createOne(subscriptionDetails: SubscriptionDetailRequest): Promise<SubscriptionDetail> {
        return withErrorHandling(async () => {
            const [createdPayment] = await this.preparedStatements.createOne.execute({
                userId: subscriptionDetails.userId,
                subscriptionId: subscriptionDetails.subscriptionId,
                eventType: subscriptionDetails.eventType,
                priceId: subscriptionDetails.priceId,
                invoiceId: subscriptionDetails.invoiceId,
                isCancelled: false,
                discountAmount: subscriptionDetails.discountAmount,
                discountPercentage: subscriptionDetails.discountPercentage,
            });

            if (!createdPayment) {
                throw APIError.internal('Failed to create payment');
            }
            return createdPayment as SubscriptionDetail;
        }, 'Error creating payment');
    }

    updateOne(id: string, paymentData: SubscriptionDetail): Promise<void> {
        return withErrorHandling(async () => {
            const payment = await this.findOne(id);

            if (!payment) {
                throw APIError.notFound('Payment not found');
            }

            const [updatedPayment] = await this.preparedStatements.updateOne.execute({
                paymentData,
                id,
            });

            if (!updatedPayment) {
                throw APIError.internal('Failed to update payment');
            }
        }, 'Error updating payment');
    }

    cancelSubscription(subscriptionId: string): Promise<void> {
        return withErrorHandling(async () => {
            const payment = await this.findBySubscriptionId(subscriptionId);

            if (!payment) {
                throw APIError.notFound('Payment not found');
            }

            const [updatedPayment] = await this.preparedStatements.cancelSubscription.execute({
                subscriptionId,
            });

            if (!updatedPayment) {
                throw APIError.internal('Failed to cancel subscription');
            }
        }, 'Error cancelling subscription');
    }
    deleteOne(id: string): Promise<void> {
        return withErrorHandling(async () => {
            const [deletedPayment] = await this.preparedStatements.deleteOne.execute({ id });

            if (!deletedPayment) {
                throw APIError.internal('Failed to delete payment');
            }
        }, 'Error deleting payment');
    }
}

export const subscriptionDetailsRepository = SubscriptionDetailsRepository.getInstance<SubscriptionDetailsRepository>(
    subscriptionDetailsPreparedStatements
);
