-- Run this entirely in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS best_time_to_visit (
    location TEXT PRIMARY KEY,
    best TEXT NOT NULL,
    avoid TEXT,
    current TEXT,
    summary TEXT,
    months JSONB,
    tips JSONB
);

-- Disable RLS for now so the backend service role can access everything freely
ALTER TABLE best_time_to_visit DISABLE ROW LEVEL SECURITY;
