import axios from 'axios';
import { runWithKeyRotation } from '../utils/rapidApiKeyManager.js';
import { getLocationId } from '../utils/hotelLocationCache.js';

import { AsyncCache } from '../utils/cache.js';

// Global cache to save quota
const cache = new AsyncCache('cache_hotels');
const pendingHotelRequests = new Map();
const CACHE_DURATION = 3 * 60 * 60 * 1000; // 3 hours

export const searchHotels = async (req, res) => {
    try {
        const { 
            destination, 
            daysOfStay, 
            transportMode, 
            travelDurationHours,
            distanceKms,
            adults = 2 // Default to 2 adults if not provided
        } = req.query;

        if (!destination || !daysOfStay) {
            return res.status(400).json({ error: "destination and daysOfStay are required." });
        }

        // Fetch the location ID using our smart cache
        const locationId = await getLocationId(destination);
        if (!locationId) {
            return res.status(404).json({ error: `Could not find a valid location ID for destination: ${destination}` });
        }

        // --- Smart Date Logic ---
        let durationHours = parseFloat(travelDurationHours);
        
        // If it's a personal vehicle and we don't have duration but have distance, estimate duration (avg 60 km/h)
        if (transportMode === 'personal' && isNaN(durationHours) && distanceKms) {
            durationHours = parseFloat(distanceKms) / 60;
        }

        const today = new Date();
        let checkinDate = new Date(today); // Default to today

        if (transportMode === 'flight') {
            checkinDate = today;
        } else if (['train', 'bus', 'personal'].includes(transportMode)) {
            if (!isNaN(durationHours) && durationHours > 14) {
                // It's an overnight journey! They need the hotel starting tomorrow.
                checkinDate.setDate(today.getDate() + 1);
            } else {
                checkinDate = today;
            }
        }

        const checkoutDate = new Date(checkinDate);
        checkoutDate.setDate(checkinDate.getDate() + parseInt(daysOfStay));

        // Format dates as YYYY-MM-DD
        const formatDate = (date) => date.toISOString().split('T')[0];
        const checkinStr = formatDate(checkinDate);
        const checkoutStr = formatDate(checkoutDate);

        const cacheKey = `${locationId}-${checkinStr}-${checkoutStr}-${adults}`;
        const now = Date.now();

        const cached = await cache.get(cacheKey);
        if (cached) {
            console.log(`🏨 Serving hotels from cache for location ${locationId}`);
            return res.json(cached);
        }

        // Deduplicate in-flight requests
        if (pendingHotelRequests.has(cacheKey)) {
            console.log(`🏨 Waiting for existing hotel search to finish for ${locationId}`);
            const result = await pendingHotelRequests.get(cacheKey);
            return res.json(result);
        }

        console.log(`🏨 Searching hotels for location ${locationId} (${checkinStr} to ${checkoutStr}) for ${adults} adults`);

        const fetchPromise = (async () => {
            const options = {
                method: 'GET',
                url: `https://${process.env.RAPIDAPI_HOTEL_HOST}/stays/search`,
                params: {
                    locationId: locationId,
                    checkinDate: checkinStr,
                    checkoutDate: checkoutStr,
                    units: 'metric',
                    temperature: 'c',
                    adults: adults
                },
                headers: {
                    'x-rapidapi-host': process.env.RAPIDAPI_HOTEL_HOST
                }
            };

            const response = await runWithKeyRotation(process.env.RAPIDAPI_HOTEL_HOST, async (apiKey) => {
                options.headers['x-rapidapi-key'] = apiKey;
                return await axios.request(options);
            });

            const responseData = {
                query: {
                    locationId,
                    checkinDate: checkinStr,
                    checkoutDate: checkoutStr,
                    inferredFrom: { transportMode, durationHours }
                },
                apiData: response.data,
                timestamp: new Date().toISOString()
            };

            // Save to cache (fire and forget). Use await to ensure we catch size limit errors
            try {
                await cache.set(cacheKey, responseData, CACHE_DURATION);
            } catch (cacheErr) {
                console.error("🏨 Error saving hotel search to cache:", cacheErr.message);
            }

            return responseData;
        })();

        pendingHotelRequests.set(cacheKey, fetchPromise);

        try {
            const result = await fetchPromise;
            return res.json(result);
        } finally {
            pendingHotelRequests.delete(cacheKey);
        }

    } catch (error) {
        console.error("Error searching hotels:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: "Failed to search hotels.",
            details: error.response?.data || error.message
        });
    }
};
