CREATE TABLE users
(
    id           BIGSERIAL PRIMARY KEY,
    admin        BOOLEAN NOT NULL DEFAULT false,
    username     VARCHAR(255) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    api_key      VARCHAR(255) NOT NULL
);

CREATE INDEX users_username_index ON users (username);
CREATE INDEX users_api_keys_index ON users (api_key);
