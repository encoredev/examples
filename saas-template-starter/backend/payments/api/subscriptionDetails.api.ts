import { api, APIError } from 'encore.dev/api';
import { secret } from 'encore.dev/config';
import { getAuthData } from '~encore/auth';
import Stripe from 'stripe';
import { users } from '~encore/clients';

import { subscriptionPriceService } from '../services/subscriptionPricing.service';
import { subscriptionDetailService } from '../services/subscriptionDetails.service';

import { getRawRequestBody } from '../../shared/utils/getRawRequestBody';

import { Tier } from '../../users/types';
import { SubscriptionDetailRequest } from '../types';

const stripeSecreetKey = secret('StripeSecretKey');
const stripe = new Stripe(stripeSecreetKey());

/**
 * API endpoint to create a new subscription checkout session through Stripe
 */
export const checkoutStripeSession = api.raw(
    { expose: true, method: 'POST', path: '/create-subscription/:tier' },
    async (req, res) => {
        try {
            // Extract path parameters
            const pathSegments = req.url?.split('/') || [];
            const tier = pathSegments[pathSegments.length - 1];

            // Parse request body (for JSON data)
            let body = await getRawRequestBody(req);

            // Parse JSON body if it exists
            const bodyData = body ? JSON.parse(body) : {};

            // Access headers
            const userAgent = req.headers['user-agent'];

            // Now you have access to all parameters:
            console.log('tier:', tier);
            console.log('bodyData:', bodyData);
            console.log('userAgent:', userAgent);

            // TODO: Create Stripe checkout session with these parameters
            const subscriptionPricing = await subscriptionPriceService.findByTier(tier as Tier);
            const session = await stripe.checkout.sessions.create({
                line_items: [
                    {
                        price: subscriptionPricing.priceId,
                        quantity: 1,
                    },
                ],
                mode: 'subscription',
                success_url: 'https://example.com/success', // TODO: Update with your success URL
                cancel_url: 'https://example.com/cancel', // TODO: Update with your cancel URL
                automatic_tax: { enabled: true },
            });

            // Return the session URL to the client
            res.writeHead(301, { Location: session.url! });
        } catch (error) {
            console.error('Error creating checkout session:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(
                JSON.stringify({
                    success: false,
                    error: 'Failed to create checkout session',
                })
            );
        }
    }
);

/**
 * This endpoint is used to cancel a subscription.
 */
export const cancelSubscription = api(
    { expose: true, method: 'POST', path: '/cancel-subscription/:subscriptionId', auth: true },
    async (params: { subscriptionId: string }) => {
        const userID = getAuthData()!.userID;
        const subscriptionDetails = await subscriptionDetailService.findBySubscriptionId(params.subscriptionId);

        if (subscriptionDetails.userId !== userID) {
            throw APIError.unauthenticated('You can only cancel your own subscription');
        }

        await stripe.subscriptions.update(params.subscriptionId, {
            cancel_at_period_end: true,
        });

        return subscriptionDetailService.cancelSubscription(params.subscriptionId);
    }
);

/**
 * API endpoint to handle Stripe webhook events
 */
export const stripeWebhook = api.raw({ expose: true, method: 'POST', path: '/stripe-webhook' }, async (req, res) => {
    const body = await getRawRequestBody(req);
    const bodyData = body ? JSON.parse(body) : {};
    try {
        // Parse the webhook event from the request body
        const event = stripe.webhooks.constructEvent(
            bodyData,
            req.headers['stripe-signature'] as string,
            stripeSecreetKey()
        );

        // Handle the event
        switch (event.type) {
            case 'invoice.payment_succeeded':
                const succeededInvoice = event.data.object as Stripe.Invoice;
                const userEmail = succeededInvoice.customer_email;
                const subscriptionId = succeededInvoice.subscription;

                if (!userEmail || !subscriptionId) {
                    throw APIError.internal('Missing required data in payment succeeded event');
                }

                const user = await users.findUserByEmail({ email: userEmail });

                if (!user) {
                    throw APIError.notFound('User not found');
                }

                const priceId = succeededInvoice.lines.data[0]?.price?.id || null;

                // Extract discount information
                let discountAmount = 0;
                let discountPercentage = 0;

                if (succeededInvoice.discount) {
                    const discount = succeededInvoice.discount;
                    if (discount.coupon.percent_off) {
                        discountPercentage = discount.coupon.percent_off;
                        discountAmount = (succeededInvoice.amount_paid * discountPercentage) / 100;
                    } else if (discount.coupon.amount_off) {
                        discountAmount = discount.coupon.amount_off;
                    }
                }

                if (typeof subscriptionId === 'string') {
                    const newSubscriptionDetails: SubscriptionDetailRequest = {
                        userId: user.id,
                        subscriptionId: subscriptionId,
                        eventType: event.type,
                        priceId: priceId!,
                        invoiceId: succeededInvoice.id,
                        discountAmount,
                        discountPercentage: discountPercentage,
                    };

                    await subscriptionDetailService.createOne(newSubscriptionDetails); // Create new subscription details for the user
                    const subscriptionPricing = await subscriptionPriceService.findByPriceId(priceId!); // Find subscription pricing by price ID
                    await users.updateSubscriptionTier({ userId: user.id, tier: subscriptionPricing.tier as Tier }); // Update user's subscription tier
                } else {
                    throw APIError.internal('Invalid subscription ID');
                }
        }

        // Return a 200 response to acknowledge receipt of the event
        res.writeHead(200);
        res.end();
    } catch (error) {
        console.error('Error handling Stripe webhook event:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(
            JSON.stringify({
                success: false,
                error: 'Failed to handle Stripe webhook event',
            })
        );
    }
});
