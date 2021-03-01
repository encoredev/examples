CREATE TABLE board (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE board_column (
    id BIGSERIAL PRIMARY KEY,
    board_id BIGINT NOT NULL REFERENCES board (id),
    name TEXT NOT NULL,
    "order" INT NOT NULL
);
