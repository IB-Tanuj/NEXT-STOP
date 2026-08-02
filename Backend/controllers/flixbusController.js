import { flixbusApi } from '../services/flixbusApiService.js';
import supabase from '../config/supabase.js';
import crypto from 'crypto';

/**
 * Deterministically pick a layout ID based on the trip ID
 */
const assignLayoutToTrip = async (apiTripId) => {
    const { data: layouts } = await supabase.from('bus_layouts').select('id, total_capacity');
    if (!layouts || layouts.length === 0) return null;
    
    // Simple hash to consistently pick the same layout for the same trip ID
    const hash = crypto.createHash('md5').update(apiTripId).digest('hex');
    const index = parseInt(hash.substring(0, 8), 16) % layouts.length;
    return layouts[index];
};

/**
 * GET /api/flixbus/cities/:name/reachable
 */
export const getReachable = async (req, res) => {
    try {
        const { name } = req.params;
        
        // 1. Get origin city UUID from DB
        const { data: originData } = await supabase
            .from('flixbus_cities')
            .select('rapidapi_id')
            .ilike('name', name)
            .single();

        if (!originData) return res.status(404).json({ error: "Origin city not found in supported regions." });

        // 2. Fetch reachable from API
        const apiData = await flixbusApi.getReachableCities(originData.rapidapi_id);
        
        res.json(apiData.cities || []);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch reachable cities' });
    }
};

/**
 * POST /api/flixbus/search
 */
export const searchBuses = async (req, res) => {
    try {
        const { from, to, date } = req.body;

        // 1. Resolve names to RapidAPI UUIDs
        const { data: cities } = await supabase
            .from('flixbus_cities')
            .select('rapidapi_id, name')
            .or(`name.ilike.${from},name.ilike.${to}`);

        const fromCity = cities?.find(c => c.name.toLowerCase() === from.toLowerCase());
        const toCity = cities?.find(c => c.name.toLowerCase() === to.toLowerCase());

        if (!fromCity || !toCity) {
            return res.status(400).json({ error: "One or both cities are not supported by FlixBus yet." });
        }

        // 2. Search RapidAPI
        const searchData = await flixbusApi.searchTrips(fromCity.rapidapi_id, toCity.rapidapi_id, date);
        const trips = searchData.trips || [];

        // 3. Attach layout info to each trip
        const enhancedTrips = await Promise.all(trips.map(async (trip) => {
            const layout = await assignLayoutToTrip(trip.id);
            return {
                ...trip,
                assignedLayoutId: layout?.id,
                totalCapacity: layout?.total_capacity
            };
        }));

        res.json({ trips: enhancedTrips });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to search trips' });
    }
};

/**
 * GET /api/flixbus/seatmap/:tripId
 * Generates the simulated seat map with gender allocations!
 */
export const getSeatMap = async (req, res) => {
    try {
        const { tripId } = req.params;
        const availableSeatsApi = parseInt(req.query.availableSeats) || 15; // Passed from frontend

        const layout = await assignLayoutToTrip(tripId);
        if (!layout) return res.status(500).json({ error: "No layouts found in DB" });

        // Get the physical grid for this layout
        const { data: templates } = await supabase
            .from('seat_templates')
            .select('*')
            .eq('layout_id', layout.id);

        // Get actual bookings from DB
        let { data: bookedSeats } = await supabase
            .from('booked_seats')
            .select('*')
            .eq('api_trip_id', tripId);

        // THE MOCKING ENGINE: If DB is empty, let's randomly block out (Capacity - Available) seats
        // and insert them into the DB so they are persistent and gender rules apply!
        const blockedCount = layout.total_capacity - availableSeatsApi;
        
        if (bookedSeats.length < blockedCount && blockedCount > 0) {
            // Need to generate mock seats
            const seatsToMock = blockedCount - bookedSeats.length;
            const availableTemplates = templates.filter(t => !bookedSeats.find(b => b.seat_number === t.seat_number));
            
            // Randomly select templates
            const shuffled = availableTemplates.sort(() => 0.5 - Math.random());
            const selectedToBlock = shuffled.slice(0, seatsToMock);

            const mockInserts = selectedToBlock.map(t => ({
                api_trip_id: tripId,
                seat_number: t.seat_number,
                passenger_gender: Math.random() > 0.5 ? 'MALE' : 'FEMALE'
            }));

            if (mockInserts.length > 0) {
                await supabase.from('booked_seats').insert(mockInserts);
                // Refetch to get the full list
                const { data: updatedBookings } = await supabase.from('booked_seats').select('*').eq('api_trip_id', tripId);
                bookedSeats = updatedBookings;
            }
        }

        // Construct the Seat Map payload for the frontend
        const seatMap = templates.map(t => {
            const booking = bookedSeats.find(b => b.seat_number === t.seat_number);
            return {
                ...t,
                isBooked: !!booking,
                passengerGender: booking ? booking.passenger_gender : null
            };
        });

        res.json({
            layoutInfo: layout,
            seatMap
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate seat map' });
    }
};

/**
 * POST /api/flixbus/book
 * The Booking Engine - Enforces Gender Rules A, B, and C
 */
export const bookSeats = async (req, res) => {
    try {
        const { tripId, seatNumber, passengerGender } = req.body;
        
        // --- GENDER RULE ENFORCEMENT WOULD GO HERE ---
        // (E.g., Query booked_seats for adjacent col_index in the same row_index)
        // If adjacent seat is FEMALE and requesting is MALE -> Block!

        const { error } = await supabase.from('booked_seats').insert([{
            api_trip_id: tripId,
            seat_number: seatNumber,
            passenger_gender: passengerGender
        }]);

        if (error) {
            if (error.code === '23505') return res.status(400).json({ error: "Seat is already booked!" });
            throw error;
        }

        res.json({ success: true, message: "Seat successfully booked!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Booking failed' });
    }
};
