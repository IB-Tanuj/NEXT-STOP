-- ============================================
-- LOCK DOWN ALL PUBLIC TABLES
-- Enable RLS with NO public policies = anon key is fully blocked
-- Backend service_role_key bypasses RLS automatically
-- ============================================

-- Cache tables
ALTER TABLE cache_flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE cache_buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cache_trains ENABLE ROW LEVEL SECURITY;
ALTER TABLE cache_hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE cache_stays ENABLE ROW LEVEL SECURITY;
ALTER TABLE cache_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE cache_itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE cache_flixbus ENABLE ROW LEVEL SECURITY;

-- Best time table
ALTER TABLE best_time_to_visit ENABLE ROW LEVEL SECURITY;

-- Flixbus tables
ALTER TABLE flixbus_cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE bus_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE seat_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booked_seats ENABLE ROW LEVEL SECURITY;
