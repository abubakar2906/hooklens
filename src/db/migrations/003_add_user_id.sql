-- Add user_id to endpoints table
ALTER TABLE endpoints ADD COLUMN user_id VARCHAR;

-- Index for faster lookups per user
CREATE INDEX IF NOT EXISTS idx_endpoints_user_id ON endpoints(user_id);
