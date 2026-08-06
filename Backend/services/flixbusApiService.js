import dotenv from 'dotenv';
dotenv.config();



// Key Rotation Logic
const getApiKey = () => {
    // If the 1st key hits limit, we swap to the 2nd.
    global.activeFlixbusKeyIndex = global.activeFlixbusKeyIndex || 1;
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
        // e.g., /search?currency=EUR&date=2026-08-01&locale=en&children=0&adult=1&bikes=0&toCityId=...&fromCityId=...
        return fetchFromFlixbus(`/search?currency=EUR&date=${date}&locale=en&children=0&adult=1&bikes=0&toCityId=${toId}&fromCityId=${fromId}`);
    },

    getReachableCities: async (cityId) => {
        return fetchFromFlixbus(`/cities/${cityId}/reachable?language=en-gl&limit=100`);
    },

    getTimetable: async (cityId, date) => {
        return fetchFromFlixbus(`/timetable?cityId=${cityId}&date=${date}`);
    }
};
