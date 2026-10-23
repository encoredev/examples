-- Migration: Create Subscription Table
-- Description: Creates the subscription table for Stripe integration

-- Up Migration
CREATE TABLE "subscription"
(
    -- Primary key
    "id"                   VARCHAR(255) PRIMARY KEY NOT NULL,               -- Unique identifier for each subscription

    -- Subscription details
    "plan"                 VARCHAR(255)             NOT NULL,               -- The name of the subscription plan
    "referenceId"          VARCHAR(255)             NOT NULL,               -- The ID this subscription is associated with (user ID by default)
    "stripeCustomerId"     VARCHAR(255)             NOT NULL,               -- The Stripe customer ID
    "stripeSubscriptionId" VARCHAR(255),                                    -- The Stripe subscription ID
    "status"               VARCHAR(255)             NOT NULL,               -- The status of the subscription (active, canceled, etc.)

    -- Billing period information
    "periodStart"          TIMESTAMP,                                       -- Start date of the current billing period
    "periodEnd"            TIMESTAMP,                                       -- End date of the current billing period
    "cancelAtPeriodEnd"    BOOLEAN                           DEFAULT FALSE, -- Whether the subscription will be canceled at the end of the period

    -- Team plan information
    "seats"                INTEGER,                                         -- Number of seats for team plans

    -- Trial period information
    "trialStart"           TIMESTAMP,                                       -- Start date of the trial period
    "trialEnd"             TIMESTAMP,                                       -- End date of the trial period

    -- Timestamps
    "createdAt"            TIMESTAMP                NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"            TIMESTAMP                NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_subscription_reference ON "subscription" ("referenceId"); -- Index for looking up subscriptions by reference ID (usually user ID)
CREATE INDEX idx_subscription_customer ON "subscription" ("stripeCustomerId"); -- Index for looking up subscriptions by Stripe customer ID
CREATE INDEX idx_subscription_stripe ON "subscription" ("stripeSubscriptionId"); -- Index for looking up by Stripe subscription ID
CREATE INDEX idx_subscription_status ON "subscription" ("status"); -- Index for filtering subscriptions by status