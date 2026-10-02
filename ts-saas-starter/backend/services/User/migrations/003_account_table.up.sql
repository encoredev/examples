-- Migration: Create Account Table
-- Description: Creates the account table for authentication providers and credentials

-- Up Migration
CREATE TABLE "account"
(
    -- Core account fields
    "id"                    VARCHAR(255) PRIMARY KEY NOT NULL,                           -- Unique identifier for each account
    "userId"                VARCHAR(255)             NOT NULL,                           -- The id of the user who owns this account
    "accountId"             VARCHAR(255)             NOT NULL,                           -- The id of the account as provided by the SSO or equal to userId for credential accounts
    "providerId"            VARCHAR(255)             NOT NULL,                           -- The id of the provider (e.g., 'google', 'github', 'credentials')
    "accessToken"           TEXT,                                                        -- The access token of the account returned by the provider
    "refreshToken"          TEXT,                                                        -- The refresh token of the account returned by the provider
    "accessTokenExpiresAt"  TIMESTAMP,                                                   -- The time when the access token expires
    "refreshTokenExpiresAt" TIMESTAMP,                                                   -- The time when the refresh token expires
    "scope"                 TEXT,                                                        -- The scope of the account returned by the provider
    "idToken"               TEXT,                                                        -- The id token returned from the provider
    "password"              VARCHAR(255),                                                -- The password of the account (hashed), mainly used for email and password authentication
    "createdAt"             TIMESTAMP                NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Timestamp of when the account was created
    "updatedAt"             TIMESTAMP                NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Timestamp of when the account was last updated

    -- Foreign key constraint
    FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE
);

-- Create a unique constraint on providerId and accountId
-- This prevents duplicate accounts for the same provider and external account
CREATE UNIQUE INDEX idx_account_provider_account ON "account" ("providerId", "accountId");

-- Create indexes for performance
CREATE INDEX idx_account_userId ON "account" ("userId"); -- For finding all accounts belonging to a user
CREATE INDEX idx_account_providerId ON "account" ("providerId"); -- For finding accounts by provider
CREATE INDEX idx_account_accessTokenExpiresAt ON "account" ("accessTokenExpiresAt"); -- For token refresh operations