import { tierEnum } from '../users/db/schema';
import { Tier } from '../users/types';

/**
 * Represents detailed information about a user's subscription
 */
export interface SubscriptionDetail {
    /** Unique identifier for the subscription */
    id: string;
    /** Identifier of the user who owns this subscription */
    userId: string;
    /** Identifier of the subscription in the payment provider system */
    subscriptionId: string;
    /** Type of subscription event (e.g., "created", "updated", "cancelled") */
    eventType: string;
    /** Identifier of the price/plan associated with this subscription */
    priceId: string;
    /** Identifier of the invoice related to this subscription */
    invoiceId: string;
    /** Flag indicating if the subscription has been cancelled */
    isCancelled: boolean;
    /** Amount of discount applied to the subscription in currency units */
    discountAmount: number;
    /** Percentage discount applied to the subscription */
    discountPercentage: number;
    /** Timestamp when the subscription was created */
    createdAt: Date;
    /** Timestamp when the subscription was last updated */
    updatedAt: Date;
}

/**
 * Request object for creating or updating a subscription detail
 */
export interface SubscriptionDetailRequest {
    /** Identifier of the user who owns this subscription */
    userId: string;
    /** Identifier of the subscription in the payment provider system */
    subscriptionId: string;
    /** Type of subscription event (e.g., "created", "updated", "cancelled") */
    eventType: string;
    /** Identifier of the price/plan associated with this subscription */
    priceId: string;
    /** Identifier of the invoice related to this subscription */
    invoiceId: string;
    /** Amount of discount applied to the subscription in currency units */
    discountAmount: number;
    /** Percentage discount applied to the subscription */
    discountPercentage: number;
}

/**
 * Represents pricing information for a subscription tier
 */
export interface SubscriptionPrice {
    /** Unique identifier for the subscription price */
    id: string;
    /** Identifier of the price in the payment provider system */
    priceId: string;
    /** Tier level associated with this subscription price */
    tier: (typeof tierEnum.enumValues)[number];
    /** Price amount in the smallest currency unit (e.g., cents) */
    price: number;
    /** Currency code (e.g., USD, EUR) */
    currency: string;
    /** Timestamp when the price was created */
    createdAt: Date;
    /** Timestamp when the price was last updated */
    updatedAt: Date;
}

/**
 * Request object for creating or updating a subscription price
 */
export interface SubscriptionPriceRequest {
    /** Identifier of the price in the payment provider system */
    priceId: string;
    /** Tier level associated with this subscription price */
    tier: Tier;
    /** Price amount in the smallest currency unit (e.g., cents) */
    price: number;
    /** Currency code (e.g., USD, EUR) */
    currency: string;
}

/**
 * Represents pricing information for a product
 */
export interface ProductPrice {
    /** Unique identifier for the product price */
    id: string;
    /** Identifier of the price in the payment provider system */
    priceId: string;
    /** Identifier of the product this price is for */
    productId: string;
    /** Price amount in the smallest currency unit (e.g., cents) */
    price: number;
    /** Currency code (e.g., USD, EUR) */
    currency: string;
    /** Timestamp when the price was created */
    createdAt: Date;
    /** Timestamp when the price was last updated */
    updatedAt: Date;
}

/**
 * Request object for creating or updating a product price
 */
export interface ProductPriceRequest {
    /** Identifier of the price in the payment provider system */
    priceId: string;
    /** Identifier of the product this price is for */
    productId: string;
    /** Price amount in the smallest currency unit (e.g., cents) */
    price: number;
    /** Currency code (e.g., USD, EUR) */
    currency: string;
}
