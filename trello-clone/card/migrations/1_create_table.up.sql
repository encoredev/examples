CREATE TABLE card (
    id BIGSERIAL PRIMARY KEY,
    board_id BIGINT NOT NULL,
    column_id BIGINT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    "order" BIGINT NOT NULL,
    created TIMESTAMP WITH TIME ZONE NOT NULL
);