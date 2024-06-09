CREATE TABLE transcripts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    finished_at TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL,
    raw_transcript JSONB
);
