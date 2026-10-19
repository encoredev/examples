-- One row per completed Checkout session, written by the webhook.
CREATE TABLE payments (
    session_id     TEXT PRIMARY KEY,
    payment_intent TEXT,
    customer_email TEXT,
    amount_total   BIGINT NOT NULL,
    currency       TEXT NOT NULL,
    paid_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
