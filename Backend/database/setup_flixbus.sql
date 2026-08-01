-- Run this entirely in the Supabase SQL Editor

-- 1. Create flixbus_cities table
CREATE TABLE IF NOT EXISTS flixbus_cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rapidapi_id UUID UNIQUE NOT NULL,
    name TEXT NOT NULL,
    country TEXT,
    lat NUMERIC,
    lon NUMERIC,
    is_supported BOOLEAN DEFAULT true
);

-- 2. Create bus_layouts table
CREATE TABLE IF NOT EXISTS bus_layouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    total_capacity INTEGER NOT NULL
);

-- 3. Create seat_templates table (The physical grid)
CREATE TABLE IF NOT EXISTS seat_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    layout_id UUID REFERENCES bus_layouts(id) ON DELETE CASCADE,
    seat_number TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Classic', 'Panorama', 'Single-Bed', 'Double-Bed'
    row_index INTEGER NOT NULL,
    col_index INTEGER NOT NULL
);

-- 4. Create trip_bookings table (The overall booking PNR)
CREATE TABLE IF NOT EXISTS trip_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_trip_id TEXT NOT NULL,
    user_id TEXT, -- Assuming you have a users table, else just text for now
    status TEXT DEFAULT 'CONFIRMED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create booked_seats table (The gender rules engine)
CREATE TABLE IF NOT EXISTS booked_seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_trip_id TEXT NOT NULL,
    seat_number TEXT NOT NULL,
    passenger_gender TEXT NOT NULL, -- 'MALE' or 'FEMALE'
    booking_id UUID REFERENCES trip_bookings(id) ON DELETE CASCADE,
    UNIQUE(api_trip_id, seat_number) -- A specific seat on a specific trip can only be booked once
);

-- Add Row Level Security (RLS) policies if needed, but for now we disable them so the backend service role can access everything freely
ALTER TABLE flixbus_cities DISABLE ROW LEVEL SECURITY;
ALTER TABLE bus_layouts DISABLE ROW LEVEL SECURITY;
ALTER TABLE seat_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE trip_bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE booked_seats DISABLE ROW LEVEL SECURITY;
