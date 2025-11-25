-- Add user_id to customers table to link Polar customers to auth users
ALTER TABLE customers ADD COLUMN user_id TEXT;

-- Create index for faster lookups
CREATE INDEX idx_customers_user_id ON customers(user_id);

