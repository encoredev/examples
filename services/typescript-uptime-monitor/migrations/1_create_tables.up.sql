CREATE TABLE sites (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL UNIQUE
);

CREATE TABLE checks (
    id BIGSERIAL PRIMARY KEY,
    site_id INTEGER NOT NULL REFERENCES sites (id) ON DELETE CASCADE,
    up BOOLEAN NOT NULL,
    checked_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX checks_site_id_checked_at ON checks (site_id, checked_at DESC);
