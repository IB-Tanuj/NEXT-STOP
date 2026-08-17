CREATE TABLE cache_spot_info (
  id TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  expires_at BIGINT NOT NULL
);
