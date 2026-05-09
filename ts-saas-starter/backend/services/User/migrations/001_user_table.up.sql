-- Migration: Create User Table
-- Description: Creates the user table with core fields and admin plugin fields

-- Up Migration
CREATE TABLE "user"
(
    -- Core user fields
    "id"               VARCHAR(255) PRIMARY KEY NOT NULL,                           -- Unique identifier for each user
    "name"             VARCHAR(255)             NOT NULL,                           -- User's chosen display name
    "email"            VARCHAR(255)             NOT NULL UNIQUE,                    -- User's email address for communication and login
    "emailVerified"    BOOLEAN                  NOT NULL DEFAULT FALSE,             -- Whether the user's email is verified
    "image"            VARCHAR(255),                                                -- User's profile image URL (optional)
    "createdAt"        TIMESTAMP                NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Timestamp of when the user account was created
    "updatedAt"        TIMESTAMP                NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Timestamp of the last update to the user's information

    -- Stripe plugin fields
    "stripeCustomerId" VARCHAR(255),                                                -- Stripe customer ID for the user (if applicable)

    -- Admin plugin fields
    "role"             VARCHAR(255)                      DEFAULT 'user',            -- User's role (user, admin, etc.). Defaults to 'user'. Admins will have the 'admin' role.
    "banned"           BOOLEAN                           DEFAULT FALSE,             -- Indicates whether the user is banned from the platform
    "banReason"        TEXT,                                                        -- The reason provided for the user's ban (if applicable)
    "banExpires"       BIGINT                                                       -- Unix timestamp when the user's ban will expire (if temporary)
);

-- Create indexes for performance
CREATE INDEX idx_user_email ON "user" ("email"); -- Index for faster email lookups during authentication
CREATE INDEX idx_user_role ON "user" ("role"); -- Index for permission checks and filtering users by role
CREATE INDEX idx_user_banned ON "user" ("banned"); -- Index for filtering banned/active users
CREATE INDEX idx_user_stripe_customer ON "user" ("stripeCustomerId"); -- Index for faster lookups by Stripe customer ID
