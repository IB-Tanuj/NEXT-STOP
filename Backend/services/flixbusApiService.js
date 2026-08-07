import dotenv from 'dotenv';
dotenv.config();
import cache from '../utils/cache.js';

// Cache TTL constants
const TTL_REACHABLE = 24 * 60 * 60 * 1000;  // 24 hours
const TTL_SEARCH    = 10 * 60 * 1000;        // 10 minutes
const TTL_TIMETABLE = 10 * 60 * 1000;        // 10 minutes

// Key Rotation Logic
const getApiKey = () => {
    // Default to the 2nd key since the 1st one is exhausted for the month.
    global.activeFlixbusKeyIndex = global.activeFlixbusKeyIndex || 2;
    if (global.activeFlixbusKeyIndex === 1) return process.env.RAPIDAPI_KEY;
    return process.env.RAPIDAPI_KEY_2 || process.env.RAPIDAPI_KEY;
};

const getApiHost = () => {
    return process.env.RAPID_HOST_2 || 'flixbus-api2.p.rapidapi.com';
};

const rotateKey = () => {
    console.log(`[API WARNING] Key ${global.activeFlixbusKeyIndex} rate limited. Rotating key...`);
    global.activeFlixbusKeyIndex = global.activeFlixbusKeyIndex === 1 ? 2 : 1;
};

// Generic Fetch Wrapper
const fetchFromFlixbus = async (endpoint, retries = 1) => {
    const currentHost = getApiHost();
    const url = `https://${currentHost}${endpoint}`;
    
    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': getApiKey(),
                'x-rapidapi-host': currentHost,
                'Content-Type': 'application/json'
            }
        });

        if (res.status === 429 && retries > 0) {
            rotateKey();
            return fetchFromFlixbus(endpoint, retries - 1);
        }

        if (!res.ok) {
            throw new Error(`Flixbus API Error: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error(`[Flixbus API] Request failed for ${url}:`, error.message);
        throw error;
    }
};

export const flixbusApi = {
    searchTrips: async (fromId, toId, date) => {
        const cacheKey = `search:${fromId}:${toId}:${date}`;
        const cached = cache.get(cacheKey);
        if (cached) {
            console.log(`[CACHE HIT] searchTrips ${cacheKey}`);
            return cached;
        }

        const result = await fetchFromFlixbus(`/search?currency=EUR&date=${date}&locale=en&children=0&adult=1&bikes=0&toCityId=${toId}&fromCityId=${fromId}`);
        cache.set(cacheKey, result, TTL_SEARCH);
        console.log(`[CACHE SET] searchTrips ${cacheKey} (TTL: 10min)`);
        return result;
    },

    getReachableCities: async (cityId) => {
        const cacheKey = `reachable:${cityId}`;
        const cached = cache.get(cacheKey);
        if (cached) {
            console.log(`[CACHE HIT] getReachableCities ${cacheKey}`);
            return cached;
        }

        const result = await fetchFromFlixbus(`/cities/${cityId}/reachable?language=en-gl&limit=100`);
        cache.set(cacheKey, result, TTL_REACHABLE);
        console.log(`[CACHE SET] getReachableCities ${cacheKey} (TTL: 24h)`);
        return result;
    },

    getTimetable: async (cityId, date) => {
        const cacheKey = `timetable:${cityId}:${date}`;
        const cached = cache.get(cacheKey);
        if (cached) {
            console.log(`[CACHE HIT] getTimetable ${cacheKey}`);
            return cached;
        }

        const result = await fetchFromFlixbus(`/timetable?cityId=${cityId}&date=${date}`);
        cache.set(cacheKey, result, TTL_TIMETABLE);
        console.log(`[CACHE SET] getTimetable ${cacheKey} (TTL: 10min)`);
        return result;
    }
};
