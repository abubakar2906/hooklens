CREATE TABLE IF NOT EXISTS deliveries (
  id             UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id       UUID        NOT NULL REFERENCES events(id),
  attempt_number INT         NOT NULL,
  status_code    INT,
  response_body  TEXT,
  duration_ms    INT         NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deliveries_event_id ON deliveries(event_id);

-- Pre-creating the diagnostics table now so Phase 5 only needs to write to it.
CREATE TABLE IF NOT EXISTS diagnostics (
  event_id   UUID        PRIMARY KEY REFERENCES events(id),
  analysis   TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);