import axios from 'axios';
import { runWithKeyRotation } from './rapidApiKeyManager.js';
import { AsyncCache } from './cache.js';

const locationCache = new AsyncCache('cache_hotels');
const pendingLocationRequests = new Map();
const LOCATION_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Get the base64 locationId for a destination (city).
 * If it doesn't exist in cache, it calls the stays/auto-complete API and caches it.
 * 
 * @param {string} destination - The name of the city (e.g., "New York", "Mumbai")
 * @returns {Promise<string|null>} The base64 location ID
 */
export const getLocationId = async (destination) => {
    if (!destination) return null;
    
    // Normalize string to lowercase to avoid duplicates (e.g., "Goa" vs "goa")
    const normalizedDest = destination.trim().toLowerCase();
    const cacheKey = `loc:${normalizedDest}`;
    
    // Check if we already have it
    const cachedLocId = await locationCache.get(cacheKey);
    if (cachedLocId) {
        console.log(`[Hotel Cache] Found location ID for "${destination}" in global cache.`);
        return cachedLocId;
    }

    // Deduplicate in-flight requests
    if (pendingLocationRequests.has(cacheKey)) {
        console.log(`[Hotel Cache] Waiting for existing location request to finish for "${destination}"`);
        return await pendingLocationRequests.get(cacheKey);
    }
    
    // If not, fetch it from RapidAPI
    console.log(`[Hotel Cache] Location "${destination}" not found in cache. Fetching from API...`);
    
    const fetchPromise = (async () => {
        try {
            const options = {
                method: 'GET',
                url: `https://${process.env.RAPIDAPI_HOTEL_HOST}/stays/auto-complete`,
                // Append "India" to prefer Indian destinations (this is an India-focused travel site)
                params: { query: `${destination} India` },
                headers: {
                    'x-rapidapi-host': process.env.RAPIDAPI_HOTEL_HOST
                }
            };

            const response = await runWithKeyRotation(process.env.RAPIDAPI_HOTEL_HOST, async (apiKey) => {
                options.headers['x-rapidapi-key'] = apiKey;
                return await axios.request(options);
            });

            const data = response.data?.data;
            if (data && data.length > 0) {
                // Prefer Indian results, then fall back to first city/region match
                const indianMatch = data.find(item => item.country === 'India');
                const bestMatch = indianMatch || data.find(item => item.dest_type === 'city') || data[0];
                const locationId = bestMatch.id;
                
                if (locationId) {
                    // Save it to global cache (fire and forget)
                    locationCache.set(cacheKey, locationId, LOCATION_TTL);
                    console.log(`[Hotel Cache] Successfully cached location ID for "${destination}" (${bestMatch.name}, ${bestMatch.country}).`);
                    return locationId;
                }
            }
            
            console.warn(`[Hotel Cache] API did not return a valid location ID for "${destination}".`);
            return null;
            
        } catch (error) {
            console.error(`[Hotel Cache] Error fetching auto-complete for "${destination}":`, error.response?.data || error.message);
            throw new Error(`Failed to fetch location ID for ${destination}`);
        }
    })();

    pendingLocationRequests.set(cacheKey, fetchPromise);

    try {
        const result = await fetchPromise;
        return result;
    } finally {
        pendingLocationRequests.delete(cacheKey);
    }
};
