-- Migration: Create Session Table
-- Description: Creates the session table with core fields and admin plugin field

-- Up Migration
CREATE TABLE "session"
(
    -- Core session fields
    "id"             VARCHAR(255) PRIMARY KEY NOT NULL,                           -- Unique identifier for each session
    "userId"         VARCHAR(255)             NOT NULL,                           -- The id of the user who owns this session
    "token"          VARCHAR(255)             NOT NULL UNIQUE,                    -- The unique session token used for authentication
    "expiresAt"      TIMESTAMP                NOT NULL,                           -- The time when the session expires
    "ipAddress"      VARCHAR(45),                                                 -- The IP address of the device that created the session
    "userAgent"      TEXT,                                                        -- The user agent information of the device
    "createdAt"      TIMESTAMP                NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Timestamp of when the session was created
    "updatedAt"      TIMESTAMP                NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Timestamp of when the session was last updated

    -- Admin plugin field
    "impersonatedBy" VARCHAR(255),                                                -- The ID of the admin that is impersonating this session

    -- Foreign key constraint
    FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_session_token ON "session" ("token"); -- For quick session lookup by token
CREATE INDEX idx_session_userId ON "session" ("userId"); -- For finding all sessions belonging to a user
CREATE INDEX idx_session_expiresAt ON "session" ("expiresAt"); -- For cleaning up expired sessions
CREATE INDEX idx_session_impersonatedBy ON "session" ("impersonatedBy"); -- For auditing admin impersonation