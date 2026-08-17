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

        const prompt = `You are a travel expert for India. Provide detailed, accurate visitor information for the following tourist spots located in ${locationName}, India.

SPOTS TO ANALYZE:
${missingSpots.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Return ONLY a valid JSON object where the keys are the EXACT spot names listed above, and the value is the spot info object. NO markdown formatting, NO backticks. Ensure prices are in INR (₹).

Format:
{
  "Spot Name 1": {
    "entryPrice": { "adult": number (or null), "child": number (or null), "free": boolean },
    "openingHours": { "open": "string", "close": "string", "closedOn": "string (or null)", "note": "string (or null)" },
    "rules": ["string array of rules"],
    "permit": { "required": boolean, "details": "string (or null)", "cost": number (or null) },
    "ageRestrictions": { "hasRestriction": boolean, "details": "string (or null)" },
    "recommendedDuration": "string",
    "photographyPolicy": { "allowed": boolean, "fee": number (or null), "dronesAllowed": boolean },
    "accessibility": "string",
    "tips": ["string array of 2 tips"]
  },
  "Spot Name 2": { ... }
}`;

        const response = await ai.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: prompt,
            config: { temperature: 0.2 }
        });

        const text = response.text || "";
        const clean = text.replace(/```json|```/g, "").trim();

        if (!clean) throw new Error("Gemini returned an empty response.");

        const parsedData = JSON.parse(clean);

        // 4. Cache the new results and merge into final response
        for (const spot of missingSpots) {
            const data = parsedData[spot];
            if (data) {
                const cleanSpot = spot.toLowerCase().replace(/[^a-z0-9]+/g, '_');
                const cacheKey = `spotinfo:${cleanSpot}:${cleanLoc}`;
                await spotCache.set(cacheKey, data, CACHE_TTL);
                results[spot] = data;
            } else {
                // Gemini didn't return data for this spot for some reason
                results[spot] = { error: true, reason: "Not found in Gemini response" };
            }
        }

        res.setHeader('X-Cache', 'MISS');
        res.json(results);
    } catch (error) {
        console.error("Error fetching batch spot info:", error.message);
        res.status(500).json({
            error: "Failed to generate AI spot info.",
            details: error.message
        });
    }
};
