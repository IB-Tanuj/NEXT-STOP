import { searchAndFetch } from '../services/tinyfishService.js';
import { generateSearchQuery, cleanWebData } from '../services/queryRouterService.js';

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
