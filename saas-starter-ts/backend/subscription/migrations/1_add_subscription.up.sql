
CREATE TABLE subscription (
    stripe_id TEXT PRIMARY KEY,
    stripe_customer_id TEXT NOT NULL,
    price_id TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);
