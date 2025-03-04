/**
 * Represents a user in the system
 */
export enum Tier {
    FREE = 'FREE',
    PRO = 'PRO',
    PREMIUM = 'PREMIUM',
    ENTERPRISE = 'ENTERPRISE',
}

/**
 * Represents a user in the system
 */
export interface User {
    /** Unique identifier for the user */
    id: string;
    /** User's first name */
    firstName: string;
    /** User's last name */
    lastName: string;
    /** User's email address */
    email: string;
    /** Flag indicating if the user has been soft deleted */
    isDeleted: boolean;
    /** Timestamp when the user was created */
    createdAt: Date;
    /** Timestamp when the user was last updated */
    updatedAt: Date;
}

/**
 * Request object for creating or updating a user
 */
export interface UserRequest {
    id: string;
    /** User's first name */
    firstName: string;
    /** User's last name */
    lastName: string;
    /** User's email address */
    email: string;
}

/**
 * Represents a subscription tier for a user
 */
export interface SubscriptionTier {
    // Unique identifier for the subscription tier
    userId: string;
    // The tier the user is subscribed to
    tier: Tier;
    // Timestamp when the subscription tier was created
    createdAt: Date;
    // Timestamp when the subscription tier was last updated
    updatedAt: Date;
}

/**
 * Request object for creating or updating a subscription tier
 */
export interface SubscriptionTierRequest {
    // Unique identifier for the subscription tier pointing to the user
    userId: string;
    // The tier the user is subscribed
    tier: Tier;
}
