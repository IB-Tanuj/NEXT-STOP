import axios from 'axios';
import { runWithKeyRotation } from '../utils/rapidApiKeyManager.js';

// Simple in-memory cache to save quota
const cache = {};
const CACHE_DURATION = 3 * 60 * 60 * 1000; // 3 hours

export const searchHotels = async (req, res) => {
    try {
        const { 
            locationId, 
            daysOfStay, 
            transportMode, 
            travelDurationHours,
            distanceKms,
            adults = 2 // Default to 2 adults if not provided
        } = req.query;

        if (!locationId || !daysOfStay) {
            return res.status(400).json({ error: "locationId and daysOfStay are required." });
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

        if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_DURATION)) {
            console.log(`🏨 Serving hotels from cache for location ${locationId}`);
            return res.json(cache[cacheKey].data);
        }

        console.log(`🏨 Searching hotels for location ${locationId} (${checkinStr} to ${checkoutStr}) for ${adults} adults`);

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

        cache[cacheKey] = {
            timestamp: now,
            data: responseData
        };

        res.json(responseData);

    } catch (error) {
        console.error("Error searching hotels:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: "Failed to search hotels.",
            details: error.response?.data || error.message
        });
    }
};
