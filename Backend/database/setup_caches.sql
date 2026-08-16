-- Run this in the Supabase SQL Editor to create all cache tables

-- 1. cache_flights
CREATE TABLE IF NOT EXISTS cache_flights (
    id TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    expires_at BIGINT NOT NULL
);
ALTER TABLE cache_flights DISABLE ROW LEVEL SECURITY;

-- 2. cache_buses
CREATE TABLE IF NOT EXISTS cache_buses (
    id TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    expires_at BIGINT NOT NULL
);
ALTER TABLE cache_buses DISABLE ROW LEVEL SECURITY;

-- 3. cache_trains
CREATE TABLE IF NOT EXISTS cache_trains (
    id TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    expires_at BIGINT NOT NULL
);
ALTER TABLE cache_trains DISABLE ROW LEVEL SECURITY;

-- 4. cache_hotels
CREATE TABLE IF NOT EXISTS cache_hotels (
    id TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    expires_at BIGINT NOT NULL
);
ALTER TABLE cache_hotels DISABLE ROW LEVEL SECURITY;

-- 5. cache_stays (for Live Data / Airbnb style stays)
CREATE TABLE IF NOT EXISTS cache_stays (
    id TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    expires_at BIGINT NOT NULL
);
ALTER TABLE cache_stays DISABLE ROW LEVEL SECURITY;

-- 6. cache_images
CREATE TABLE IF NOT EXISTS cache_images (
    id TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    expires_at BIGINT NOT NULL
);
ALTER TABLE cache_images DISABLE ROW LEVEL SECURITY;

-- 7. cache_itineraries
CREATE TABLE IF NOT EXISTS cache_itineraries (
    id TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    expires_at BIGINT NOT NULL
);
ALTER TABLE cache_itineraries DISABLE ROW LEVEL SECURITY;

-- 8. cache_flixbus
CREATE TABLE IF NOT EXISTS cache_flixbus (
    id TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    expires_at BIGINT NOT NULL
);
ALTER TABLE cache_flixbus DISABLE ROW LEVEL SECURITY;
