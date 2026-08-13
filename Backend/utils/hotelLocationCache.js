import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { runWithKeyRotation } from './rapidApiKeyManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const CACHE_FILE = path.join(DATA_DIR, 'hotel_locations.json');

/**
 * Load locations from the JSON file
 */
const loadLocations = () => {
    try {
        if (fs.existsSync(CACHE_FILE)) {
            const data = fs.readFileSync(CACHE_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (err) {
        console.error('[Hotel Cache] Failed to load hotel locations file:', err.message);
    }
    return {};
};

/**
 * Save locations to the JSON file
 */
const saveLocations = (locations) => {
    try {
        fs.writeFileSync(CACHE_FILE, JSON.stringify(locations, null, 2), 'utf8');
    } catch (err) {
        console.error('[Hotel Cache] Failed to save hotel locations file:', err.message);
    }
};

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
    
    const locations = loadLocations();
    
    // Check if we already have it
    if (locations[normalizedDest]) {
        console.log(`[Hotel Cache] Found location ID for "${destination}" in local cache.`);
        return locations[normalizedDest];
    }
    
    // If not, fetch it from RapidAPI
    console.log(`[Hotel Cache] Location "${destination}" not found in cache. Fetching from API...`);
    
    try {
        const options = {
            method: 'GET',
            url: `https://${process.env.RAPIDAPI_HOTEL_HOST}/stays/auto-complete`,
            params: { query: destination },
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
            // Find the first city or district (usually index 0 is most relevant)
            const bestMatch = data.find(item => item.dest_type === 'city') || data[0];
            const locationId = bestMatch.id;
            
            if (locationId) {
                // Save it to cache
                locations[normalizedDest] = locationId;
                saveLocations(locations);
                console.log(`[Hotel Cache] Successfully cached location ID for "${destination}".`);
                return locationId;
            }
        }
        
        console.warn(`[Hotel Cache] API did not return a valid location ID for "${destination}".`);
        return null;
        
    } catch (error) {
        console.error(`[Hotel Cache] Error fetching auto-complete for "${destination}":`, error.response?.data || error.message);
        throw new Error(`Failed to fetch location ID for ${destination}`);
    }
};
