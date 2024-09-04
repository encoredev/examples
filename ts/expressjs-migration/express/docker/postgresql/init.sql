-- Insert initial record in Enquiry Table
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create Table
CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Insert initial record in Enquiry Table
INSERT INTO users (id, name)
VALUES (1, 'Simon');
