import axios from 'axios';
import { destinationStations } from '../utils/destinationStations.js';
import { runWithKeyRotation } from '../utils/rapidApiKeyManager.js';

// Simple in-memory cache
const cache = {};
const CACHE_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

// ── Existing: Get train info by train number ────
export const getTrainStatus = async (req, res) => {
    try {
        const { trainNo } = req.params;
        const options = {
            method: 'GET',
            url: `https://${process.env.RAPIDAPI_HOST}/api/trains-search/v1/train/${trainNo}`,
            params: { isH5: 'true', client: 'web' },
            headers: {
                'x-rapidapi-host': process.env.RAPIDAPI_HOST
            }
        };
        const response = await runWithKeyRotation(process.env.RAPIDAPI_HOST, async (apiKey) => {
            options.headers['x-rapidapi-key'] = apiKey;
            return await axios.request(options);
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching train status:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: "Failed to fetch train data.",
            details: error.response?.data || error.message
        });
    }
};

// ── NEW: Search trains between two stations ─────
export const searchTrains = async (req, res) => {
    try {
        const { from, to, destination } = req.query;

        // If 'to' is not a station code but a destination name (e.g., "goa"),
        // look up the station code from our mapping
        let toCode = to;
        if (!to && destination) {
            const dest = destinationStations[destination.toLowerCase()];
            if (!dest) {
                return res.status(400).json({
                    error: `Unknown destination: ${destination}. Supported: ${Object.keys(destinationStations).join(', ')}`
                });
            }
            toCode = dest.code;
        }

        if (!from || !toCode) {
            return res.status(400).json({
                error: "Missing required parameters. Use: ?from=NDLS&to=MAO or ?from=NDLS&destination=goa"
            });
        }

        const cacheKey = `${from}-${toCode}`;
        const now = Date.now();

        if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_DURATION)) {
            console.log(`🚂 Serving from cache: ${from} → ${toCode}`);
            return res.json(cache[cacheKey].data);
        }

        console.log(`🚂 Searching trains: ${from} → ${toCode}`);

        // Generate a date for the query (e.g., 10 days from today) for estimation
        const journeyDate = new Date();
        journeyDate.setDate(journeyDate.getDate() + 10);
        const dd = String(journeyDate.getDate()).padStart(2, '0');
        const mm = String(journeyDate.getMonth() + 1).padStart(2, '0');
        const yyyy = journeyDate.getFullYear();
        const dateStr = `${dd}-${mm}-${yyyy}`;

        const options = {
            method: 'GET',
            url: `https://${process.env.RAPIDAPI_HOST}/between/${from}/${toCode}`,
            params: { date: dateStr },
            headers: {
                'x-rapidapi-host': process.env.RAPIDAPI_HOST
            }
        };

        const response = await runWithKeyRotation(process.env.RAPIDAPI_HOST, async (apiKey) => {
            options.headers['x-rapidapi-key'] = apiKey;
            return await axios.request(options);
        });

        const responseData = {
            from: from,
            to: toCode,
            apiData: response.data,
            timestamp: new Date().toISOString()
        };

        // Save to cache
        cache[cacheKey] = {
            timestamp: now,
            data: responseData
        };

        // Return the response along with our query context
        res.json(responseData);

    } catch (error) {
        console.error("Error searching trains:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: "Failed to search trains.",
            details: error.response?.data || error.message
        });
    }
};
