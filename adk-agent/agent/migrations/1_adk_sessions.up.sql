-- Schema for ADK's session/database store (google.golang.org/adk/v2 v2.6.0),
-- generated from database.AutoMigrate. Encore runs migrations; the app role
-- has no DDL rights, so AutoMigrate is not called at runtime.
CREATE TABLE sessions (
    app_name TEXT NOT NULL,
    user_id TEXT NOT NULL,
    id TEXT NOT NULL,
    state JSONB,
    create_time TIMESTAMP(6) WITH TIME ZONE,
    update_time TIMESTAMP(6) WITH TIME ZONE,
    PRIMARY KEY (app_name, user_id, id)
);

CREATE TABLE events (
    id TEXT NOT NULL,
    app_name TEXT NOT NULL,
    user_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    invocation_id TEXT,
    author TEXT,
    actions BYTEA,
    long_running_tool_ids_json JSONB,
    routes_json JSONB,
    output_json JSONB,
    node_info_json JSONB,
    requested_input_json JSONB,
    branch TEXT,
    isolation_scope TEXT,
    "timestamp" TIMESTAMP(6) WITH TIME ZONE,
    content JSONB,
    grounding_metadata JSONB,
    custom_metadata JSONB,
    usage_metadata JSONB,
    citation_metadata JSONB,
    input_transcription JSONB,
    output_transcription JSONB,
    partial BOOLEAN,
    turn_complete BOOLEAN,
    error_code TEXT,
    error_message TEXT,
    interrupted BOOLEAN,
    PRIMARY KEY (id, app_name, user_id, session_id),
    FOREIGN KEY (app_name, user_id, session_id) REFERENCES sessions (app_name, user_id, id) ON DELETE CASCADE
);

CREATE TABLE app_states (
    app_name TEXT PRIMARY KEY,
    state JSONB,
    update_time TIMESTAMP(6) WITH TIME ZONE
);

CREATE TABLE user_states (
    app_name TEXT NOT NULL,
    user_id TEXT NOT NULL,
    state JSONB,
    update_time TIMESTAMP(6) WITH TIME ZONE,
    PRIMARY KEY (app_name, user_id)
);
