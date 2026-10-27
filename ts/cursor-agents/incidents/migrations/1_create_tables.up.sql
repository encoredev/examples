CREATE TABLE incidents (
    id          BIGSERIAL PRIMARY KEY,
    title       TEXT NOT NULL,
    service     TEXT NOT NULL,
    severity    TEXT NOT NULL CHECK (severity IN ('sev1', 'sev2', 'sev3')),
    status      TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'mitigated', 'resolved')),
    summary     TEXT NOT NULL,
    opened_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE incident_updates (
    id           BIGSERIAL PRIMARY KEY,
    incident_id  BIGINT NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    author       TEXT NOT NULL,
    body         TEXT NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE deploys (
    id           BIGSERIAL PRIMARY KEY,
    service      TEXT NOT NULL,
    commit_sha   TEXT NOT NULL,
    message      TEXT NOT NULL,
    author       TEXT NOT NULL,
    deployed_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE metrics (
    service      TEXT NOT NULL,
    minute       TIMESTAMPTZ NOT NULL,
    p95_ms       INT NOT NULL,
    error_rate   REAL NOT NULL,
    rps          INT NOT NULL,
    PRIMARY KEY (service, minute)
);
