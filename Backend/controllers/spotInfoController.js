import { GoogleGenAI } from '@google/genai';
import { AsyncCache } from '../utils/cache.js';

// Cache for 40 days
const CACHE_TTL = 90 * 24 * 60 * 60 * 1000; // 90 days (3 months)
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

        // 3. Call Gemini for the missing spots in chunks
        console.log(`[Spot Info Batch] Calling Gemini for missing spots: ${missingSpots.join(', ')}`);

        const apiKeys = [
            process.env.GEMINI_KEY_1,
            process.env.GEMINI_KEY_2,
            process.env.GEMINI_KEY_3,
            process.env.GEMINI_KEY
        ].filter(Boolean);

        if (apiKeys.length === 0) {
            return res.status(500).json({ error: "GEMINI API keys missing" });
        }

        const chunkSize = 2;
        const chunks = [];
        for (let i = 0; i < missingSpots.length; i += chunkSize) {
            chunks.push(missingSpots.slice(i, i + chunkSize));
        }

        const fetchChunk = async (chunkSpots, apiKey) => {
            const ai = new GoogleGenAI({ apiKey: apiKey });
            const prompt = `You are a travel expert for India. Provide detailed, accurate visitor information for the following tourist spots located in ${locationName}, India.

SPOTS TO ANALYZE:
${chunkSpots.map((s, i) => `${i + 1}. ${s}`).join('\n')}

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
  }
}`;

            const response = await Promise.race([
                ai.models.generateContent({
                    model: 'gemini-3.6-flash',
                    contents: prompt,
                    config: { temperature: 0.2 }
                }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT_ERROR')), 15000))
            ]);

            const text = response.text || "";
            const clean = text.replace(/```json|```/g, "").trim();

            if (!clean) throw new Error("Gemini returned an empty response.");

            return JSON.parse(clean);
        };

        const chunkPromises = chunks.map((chunkSpots, index) => {
            const key = apiKeys[index % apiKeys.length];
            return fetchChunk(chunkSpots, key).catch(err => {
                console.error(`[Spot Info Batch] Error fetching chunk ${index}:`, err.message);
                return null; // Return null so Promise.all still resolves and we can handle partial failure
            });
        });

        const chunkResults = await Promise.all(chunkPromises);

        // 4. Merge results and cache successful spots
        chunkResults.forEach((parsedData, index) => {
            const chunkSpots = chunks[index];
            if (parsedData) {
                for (const spot of chunkSpots) {
                    if (parsedData[spot]) {
                        results[spot] = parsedData[spot];
                    } else {
                        results[spot] = { error: true, reason: "Not found in Gemini response" };
                    }
                }
            } else {
                for (const spot of chunkSpots) {
                    results[spot] = { error: true, reason: "Fetch failed for this chunk" };
                }
            }
        });

        for (const spot of missingSpots) {
            const data = results[spot];
            if (data && !data.error) {
                const cleanSpot = spot.toLowerCase().replace(/[^a-z0-9]+/g, '_');
                const cacheKey = `spotinfo:${cleanSpot}:${cleanLoc}`;
                await spotCache.set(cacheKey, data, CACHE_TTL);
            }
        }

        res.setHeader('X-Cache', 'MISS');
        res.json(results);
    } catch (error) {
        console.error("Error fetching spot info batch:", error.message);
        res.status(500).json({ error: "Failed to fetch spot info", details: error.message });
    }
};
