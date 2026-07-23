import { searchAndFetchMultiple } from '../services/tinyfishService.js';
import { generateBusSearchQuery, cleanWebDataWithKey } from '../services/queryRouterService.js';

// In-memory cache for bus searches
// Key: "from_to", Value: { data, timestamp }
const busCache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

/**
 * POST /api/buses/search
 * Searches for bus schedules and prices using TinyFish and Groq
 */
export const searchBuses = async (req, res) => {
    try {
        const { from, to, date } = req.body;

        if (!from || !to) {
            return res.status(400).json({ error: "from and to locations are required" });
        }

        const cacheKey = `${from.toLowerCase()}_${to.toLowerCase()}`;
        
        // Check cache first
        const cached = busCache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
            console.log(`[Cache Hit] Buses for ${cacheKey}`);
            return res.json(cached.data);
        }

        console.log(`[Cache Miss] Fetching live buses for ${cacheKey}`);

        // Step 1: Generate the search query targeting bus aggregators
        const searchQuery = generateBusSearchQuery(from, to);

        // Steps 2 & 3: TinyFish searches and fetches TOP 2 results in parallel
        const { text } = await searchAndFetchMultiple(searchQuery);

        // Step 4: Groq cleans the data into structured bus options
        const schema = {
            buses: [
                { operatorName: "", departureTime: "", arrivalTime: "", price: 0, duration: "" }
            ]
        };

        // Use the dedicated API key for cleaning, fallback to main key
        const apiKey = process.env.GROQ_PROMPT_CLEANING_KEY || process.env.GROQ_API_KEY;
        const result = await cleanWebDataWithKey(
            text,
            schema,
            `Extract up to 5 actual bus travel options from ${from} to ${to}, India from the text. For each, provide the bus operator name (e.g., Zingbus, IntrCity, Redbus, etc.), departure time, arrival time, price in INR (number only), and estimated duration. Extract ONLY real bus operator names and schedules. 
CRITICAL RULES FOR PRICES:
1. If the scraped price is in USD ($), you MUST convert it to INR by multiplying by 96.
2. Ensure the price is a valid number. Estimate a realistic INR price (e.g., 500-2000 INR) if it is missing in the text but the operator is found.`,
            apiKey
        );

        // Ensure we have an array of buses
        const buses = Array.isArray(result?.buses) ? result.buses.slice(0, 5) : [];

        if (buses.length === 0) {
            throw new Error("No real bus options could be extracted from the search results.");
        }

        // Clean up data types
        const cleanedBuses = buses.map(bus => ({
            ...bus,
            price: typeof bus.price === 'number' ? bus.price : parseInt(String(bus.price).replace(/[^0-9]/g, '')) || 0,
        }));

        const responseData = {
            from,
            to,
            date: date || new Date().toISOString().split('T')[0], // Return provided date or today
            buses: cleanedBuses,
            fetchedAt: new Date().toISOString(),
        };

        // Save to cache
        busCache.set(cacheKey, {
            data: responseData,
            timestamp: Date.now()
        });

        res.json(responseData);
    } catch (error) {
        console.error("Error searching buses:", error.message);
        res.status(500).json({
            error: "Failed to search for buses.",
            details: error.message,
        });
    }
};
