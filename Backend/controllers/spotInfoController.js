import { GoogleGenAI } from '@google/genai';
import { AsyncCache } from '../utils/cache.js';

// Cache for 30 days
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000;
const spotCache = new AsyncCache('cache_spot_info');

export const getSpotInfoBatch = async (req, res) => {
    try {
        const { spots, locationName } = req.body;

        if (!Array.isArray(spots) || spots.length === 0 || !locationName) {
            return res.status(400).json({ error: "spots (array) and locationName are required." });
        }

        const cleanLoc = locationName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        const results = {};
        const missingSpots = [];

        // 1. Check cache for all spots
        for (const spot of spots) {
            const cleanSpot = spot.toLowerCase().replace(/[^a-z0-9]+/g, '_');
            const cacheKey = `spotinfo:${cleanSpot}:${cleanLoc}`;
            const cached = await spotCache.get(cacheKey);
            
            if (cached) {
                results[spot] = cached;
            } else {
                missingSpots.push(spot);
            }
        }

        console.log(`[Spot Info Batch] Requested: ${spots.length} | Cached: ${Object.keys(results).length} | Missing: ${missingSpots.length}`);

        // 2. If all are cached, return immediately
        if (missingSpots.length === 0) {
            res.setHeader('X-Cache', 'HIT');
            return res.json(results);
        }

        // 3. Call Gemini for the missing spots in ONE batch
        console.log(`[Spot Info Batch] Calling Gemini for missing spots: ${missingSpots.join(', ')}`);

        const apiKey = process.env.GEMINI_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "GEMINI API key missing" });
        }

        const ai = new GoogleGenAI({ apiKey: apiKey });

        const fetchSpotInfo = async (spot) => {
            const prompt = `You are a travel expert for India. Provide detailed, accurate visitor information for the tourist spot "${spot}" located in ${locationName}, India.

Return ONLY a valid JSON object. NO markdown formatting, NO backticks. Ensure prices are in INR (₹).

Format:
{
  "entryPrice": { "adult": number (or null), "child": number (or null), "free": boolean },
  "openingHours": { "open": "string", "close": "string", "closedOn": "string (or null)", "note": "string (or null)" },
  "rules": ["string array of rules"],
  "permit": { "required": boolean, "details": "string (or null)", "cost": number (or null) },
  "ageRestrictions": { "hasRestriction": boolean, "details": "string (or null)" },
  "recommendedDuration": "string",
  "photographyPolicy": { "allowed": boolean, "fee": number (or null), "dronesAllowed": boolean },
  "accessibility": "string",
  "tips": ["string array of 2 tips"]
}`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-1.5-flash',
                contents: prompt,
                config: { temperature: 0.2 }
            });
            const text = response.text || "";
            const clean = text.replace(/```json|```/g, "").trim();
            if (!clean) throw new Error(`Empty response for ${spot}`);
            return JSON.parse(clean);
        };

        const fetchPromises = missingSpots.map(spot => 
            fetchSpotInfo(spot)
                .then(data => ({ spot, data }))
                .catch(err => ({ spot, error: true, reason: err.message }))
        );

        const parallelResults = await Promise.race([
            Promise.all(fetchPromises),
            new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT_ERROR')), 15000))
        ]);

        // 4. Cache the new results and merge into final response
        for (const res of parallelResults) {
            if (!res.error && res.data) {
                const cleanSpot = res.spot.toLowerCase().replace(/[^a-z0-9]+/g, '_');
                const cacheKey = `spotinfo:${cleanSpot}:${cleanLoc}`;
                await spotCache.set(cacheKey, res.data, CACHE_TTL);
                results[res.spot] = res.data;
            } else {
                results[res.spot] = { error: true, reason: res.reason || "Not found in Gemini response" };
            }
        }

        res.setHeader('X-Cache', 'MISS');
        res.json(results);
    } catch (error) {
        console.error("Error fetching spot info batch:", error.message);
        if (error.message === 'TIMEOUT_ERROR') {
            return res.status(504).json({ error: "Gemini API timed out." });
        }
        if (error.status === 503) {
            return res.status(503).json({ error: "Gemini API is temporarily unavailable." });
        }
        res.status(500).json({ error: "Failed to fetch spot info", details: error.message });
    }
};
