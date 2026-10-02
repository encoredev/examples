-- Migration: Create Verification Table
-- Description: Creates the verification table for managing verification tokens (email verification, password resets, etc.)

-- Up Migration
CREATE TABLE "verification"
(
    -- Core verification fields
    "id"         VARCHAR(255) PRIMARY KEY NOT NULL,                           -- Unique identifier for each verification
    "identifier" VARCHAR(255)             NOT NULL,                           -- The identifier for the verification request (typically email address or user ID)
    "value"      TEXT                     NOT NULL,                           -- The verification token/code/value to be verified
    "expiresAt"  TIMESTAMP                NOT NULL,                           -- The time when the verification request expires
    "createdAt"  TIMESTAMP                NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Timestamp of when the verification request was created
    "updatedAt"  TIMESTAMP                NOT NULL DEFAULT CURRENT_TIMESTAMP  -- Timestamp of when the verification request was updated
);

-- Create indexes for performance
CREATE INDEX idx_verification_identifier ON "verification" ("identifier"); -- For looking up verifications by identifier (e.g., email)
CREATE INDEX idx_verification_value ON "verification" ("value"); -- For looking up verifications by token value
CREATE INDEX idx_verification_expiresAt ON "verification" ("expiresAt");-- For cleaning up expired verification requests

-- Create a compound index for lookups by both identifier and value
CREATE INDEX idx_verification_identifier_value ON "verification" ("identifier", "value");