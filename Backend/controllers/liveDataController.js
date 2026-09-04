import { searchAndFetch, searchAndFetchMultiple } from '../services/tinyfishService.js';
import { generateSearchQuery, generateStaySearchQuery, cleanWebData, cleanWebDataWithKey } from '../services/queryRouterService.js';

import { AsyncCache } from '../utils/cache.js';

// Global cache for stay searches
const stayCache = new AsyncCache('cache_stays');
const pendingStayRequests = new Map();
const CACHE_TTL = 90 * 60 * 1000; // 90 minutes

/**
 * POST /api/live/activity-price
 * Fetches live pricing for a specific activity at a location
 */
export const getActivityPrice = async (req, res) => {
    try {
        const { activityName, location } = req.body;

        if (!activityName || !location) {
            return res.status(400).json({ error: "activityName and location are required" });
        }

        // Step 1: Groq generates the search query
        const searchQuery = await generateSearchQuery({
            type: "price, timing, and duration",
            name: activityName,
            location,
        });

        // Steps 2 & 3: TinyFish searches the web and fetches the page
        const { text } = await searchAndFetch(searchQuery);

        // Step 4: Groq cleans the raw text into structured JSON
        const schema = {
            activityName: "",
            location: "",
            livePrice: "",
            timing: "",
            duration: "",
        };

        const result = await cleanWebData(
            text,
            schema,
            `Extract the current price, timing, and duration for "${activityName}" in ${location}.`
        );

        res.json({
            ...result,
            activityName: result.activityName || activityName,
            location: result.location || location,
            fetchedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Error fetching live activity price:", error.message);
        res.status(500).json({
            error: "Failed to fetch live activity price.",
            details: error.message,
        });
    }
};

/**
 * POST /api/live/verify-restaurant
 * Verifies if a restaurant exists and pulls live info
 */
export const verifyRestaurant = async (req, res) => {
    try {
        const { restaurantName, location } = req.body;

        if (!restaurantName || !location) {
            return res.status(400).json({ error: "restaurantName and location are required" });
        }

        // Step 1: Groq generates the search query
        const searchQuery = await generateSearchQuery({
            type: "restaurant rating, cuisine, and price range",
            name: restaurantName,
            location,
        });

        // Steps 2 & 3: TinyFish searches and fetches
        const { text } = await searchAndFetch(searchQuery);

        // Step 4: Groq cleans the data
        const schema = {
            restaurantName: "",
            exists: true,
            status: "",
            rating: "",
            cuisine: "",
            priceRange: "",
        };

        const result = await cleanWebData(
            text,
            schema,
            `Verify if "${restaurantName}" in ${location} exists. Extract its rating, cuisine type, and price range.`
        );

        res.json({
            ...result,
            restaurantName: result.restaurantName || restaurantName,
            location,
            fetchedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Error verifying restaurant:", error.message);
        res.status(500).json({
            error: "Failed to verify restaurant.",
            details: error.message,
        });
    }
};

/**
 * POST /api/live/stay-price
 * Fetches current room rates for a stay recommendation
 */
export const getStayPrice = async (req, res) => {
    try {
        const { stayName, location, stayType } = req.body;

        if (!stayName || !location) {
            return res.status(400).json({ error: "stayName and location are required" });
        }

        // Step 1: Groq generates the search query
        const searchQuery = await generateSearchQuery({
            type: `${stayType || 'hotel'} room price per night`,
            name: stayName,
            location,
        });

        // Steps 2 & 3: TinyFish searches and fetches
        const { text } = await searchAndFetch(searchQuery);

        // Step 4: Groq cleans the data
        const schema = {
            stayName: "",
            currentPrice: "",
            rating: "",
            highlight: "",
        };

        const result = await cleanWebData(
            text,
            schema,
            `Extract the current price per night for "${stayName}" (${stayType || 'hotel'}) in ${location}.`
        );

        res.json({
            ...result,
            stayName: result.stayName || stayName,
            location,
            fetchedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Error fetching stay price:", error.message);
        res.status(500).json({
            error: "Failed to fetch live stay price.",
            details: error.message,
        });
    }
};

/**
 * POST /api/live/search-stays
 * Searches for up to 5 real stay options at a location using TinyFish pipeline + custom key
 */
export const searchStays = async (req, res) => {
    try {
        const { location, stayType } = req.body;

        if (!location || !stayType) {
            return res.status(400).json({ error: "location and stayType are required" });
        }

        const cacheKey = `${location.toLowerCase()}_${stayType.toLowerCase()}`;
        
        // Check cache first
        const cached = await stayCache.get(cacheKey);
        if (cached) {
            console.log(`[Cache Hit] Stays for ${cacheKey}`);
            return res.json(cached);
        }

        // If a request for this key is already in progress, wait for it to finish instead of making duplicate API calls
        if (pendingStayRequests.has(cacheKey)) {
            console.log(`[Cache Pending] Waiting for existing request to finish for ${cacheKey}`);
            const data = await pendingStayRequests.get(cacheKey);
            return res.json(data);
        }

        console.log(`[Cache Miss] Fetching live stays for ${cacheKey}`);

        // Create the promise for the actual work
        const fetchPromise = (async () => {
            // Step 1: Hardcoded search query template (no Groq tokens used here)
            const searchQuery = generateStaySearchQuery(location, stayType);

            // Steps 2 & 3: TinyFish searches and fetches TOP 2 results in parallel
            const { text } = await searchAndFetchMultiple(searchQuery);

            // Step 4: Groq cleans the data into up to 5 structured stay options
            const schema = {
                stays: [
                    { name: "", pricePerNight: 0, rating: "", maxCapacity: 0, highlight: "" }
                ]
            };

            // Use the new dedicated API key for cleaning, or fallback to main key if it's missing
            const apiKey = process.env.GROQ_PROMPT_CLEANING_KEY || process.env.GROQ_API_KEY;
            const result = await cleanWebDataWithKey(
                text,
                schema,
                `Extract up to 5 actual ${stayType} accommodation options in ${location}, India from the text. For each, provide the name, price per night in INR (number only), rating out of 5, maximum room capacity (number of people), and a 3-word highlight. Extract ONLY real hotel names. 
CRITICAL RULES FOR PRICES:
1. If the scraped price is in USD ($), you MUST convert it to INR by multiplying by 96.
2. If the number is suspiciously low (e.g., under 300), assume it was USD and multiply it by 96. 
3. If a real hotel is found but its price is missing in the text, estimate a highly realistic INR price based on its star rating, location, and the user's ${stayType} preference.
4. If ${stayType} is 'budget', ensure prices are generally under 2500 INR. If ${stayType} is 'hostel', ensure prices are under 1000 INR. Ignore luxury hotels if the user wants budget.`,
                apiKey
            );

            // Ensure we have an array of stays
            const stays = Array.isArray(result?.stays) ? result.stays.slice(0, 5) : [];

            // If no stays found, it will just return an empty array without throwing a 500 error

            // Ensure pricePerNight is always a number
            const cleanedStays = stays.map(stay => ({
                ...stay,
                pricePerNight: typeof stay.pricePerNight === 'number' ? stay.pricePerNight : parseInt(String(stay.pricePerNight).replace(/[^0-9]/g, '')) || 0,
                maxCapacity: typeof stay.maxCapacity === 'number' ? stay.maxCapacity : parseInt(String(stay.maxCapacity).replace(/[^0-9]/g, '')) || 2,
            }));

            const responseData = {
                stays: cleanedStays,
                fetchedAt: new Date().toISOString(),
            };

            // Save to cache (fire and forget)
            stayCache.set(cacheKey, responseData, CACHE_TTL);

            return responseData;
        })();

        // Store the promise so subsequent parallel requests can wait on it
        pendingStayRequests.set(cacheKey, fetchPromise);

        try {
            const responseData = await fetchPromise;
            res.json(responseData);
        } finally {
            // Always remove the pending promise once it's done or fails
            pendingStayRequests.delete(cacheKey);
        }
    } catch (error) {
        console.error("Error searching stays:", error.message);
        res.status(500).json({
            error: "Failed to search for stays.",
            details: error.message,
        });
    }
};
