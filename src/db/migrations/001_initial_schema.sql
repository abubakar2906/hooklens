CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS _migrations (
  id        SERIAL PRIMARY KEY,
  filename  VARCHAR NOT NULL UNIQUE,
  run_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS endpoints (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  url           VARCHAR     NOT NULL,
  provider_type VARCHAR     NOT NULL CHECK (provider_type IN ('paystack', 'flutterwave', 'monnify', 'generic')),
  secret        VARCHAR,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  endpoint_id UUID        NOT NULL REFERENCES endpoints(id),
  payload     JSONB       NOT NULL,
  headers     JSONB       NOT NULL,
  status      VARCHAR     NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_endpoint_id ON events(endpoint_id);
CREATE INDEX IF NOT EXISTS idx_events_status      ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_created_at  ON events(created_at DESC);