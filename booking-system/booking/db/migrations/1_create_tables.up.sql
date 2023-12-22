CREATE TABLE availability (
    weekday SMALLINT NOT NULL PRIMARY KEY, -- Sunday=0, Monday=1, etc.
    start_time TIME NULL, -- null indicates not available
    end_time TIME NULL -- null indicates not available
);

CREATE TABLE booking (
    id BIGSERIAL PRIMARY KEY,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
