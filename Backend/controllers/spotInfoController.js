import { GoogleGenAI } from '@google/genai';
import { AsyncCache } from '../utils/cache.js';

// Cache for 30 days
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000;
const spotCache = new AsyncCache('cache_spot_info');

export const getSpotInfo = async (req, res) => {
    try {
        const { spotName, locationName } = req.body;

        if (!spotName || !locationName) {
            return res.status(400).json({ error: "Both spotName and locationName are required." });
        }

        // Cache Key Example: spotinfo:hawa_mahal:rajasthan
        const cleanSpot = spotName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        const cleanLoc = locationName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        const cacheKey = `spotinfo:${cleanSpot}:${cleanLoc}`;

        console.log(`[Spot Info Cache] Key: ${cacheKey}`);

        // ── Check backend cache ──
        const cached = await spotCache.get(cacheKey);
        if (cached) {
            console.log(`[Spot Info Cache] HIT — returning cached result`);
            res.setHeader('X-Cache', 'HIT');
            return res.json(cached);
        }

        console.log(`[Spot Info Cache] MISS — calling Gemini API`);

        const apiKey = process.env.GEMINI_KEY;
        if (!apiKey) {
            console.error("GEMINI_KEY is not defined in backend environment variables.");
            return res.status(500).json({ error: "Backend configuration error: GEMINI API key missing" });
        }

        const ai = new GoogleGenAI({ apiKey: apiKey });

        const prompt = `You are a travel expert for India. Provide detailed, accurate visitor information for the following tourist spot:

Spot: ${spotName}
Location: ${locationName}, India

Return ONLY a valid JSON object matching the following structure. NO markdown formatting, NO backticks, NO text outside the JSON. Ensure prices are in INR (₹).

{
  "entryPrice": { "adult": number (or null if free), "child": number (or null if free), "free": boolean },
  "openingHours": { "open": "string", "close": "string", "closedOn": "string (or null)", "note": "string (or null)" },
  "rules": ["string array of rules (e.g., dress code, no plastics)"],
  "permit": { "required": boolean, "details": "string (or null)", "cost": number (or null) },
  "ageRestrictions": { "hasRestriction": boolean, "details": "string (or null)" },
  "recommendedDuration": "string (e.g., '~2 hours')",
  "photographyPolicy": { "allowed": boolean, "fee": number (or null), "dronesAllowed": boolean },
  "accessibility": "string (e.g., 'Wheelchair accessible' or 'Steep climb required')",
  "tips": ["string array of 2 helpful tips"]
}

If a specific field's data is unknown or inapplicable, use null (or empty arrays for lists), but preserve the structure.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: prompt,
            config: {
                temperature: 0.2, // Low temp for factual data
            }
        });

        const text = response.text || "";
        const clean = text.replace(/```json|```/g, "").trim();

        if (!clean) {
            throw new Error("Gemini returned an empty response.");
        }

        const parsedData = JSON.parse(clean);

        // ── Store in backend cache ──
        await spotCache.set(cacheKey, parsedData, CACHE_TTL);
        console.log(`[Spot Info Cache] Stored result.`);

        res.setHeader('X-Cache', 'MISS');
        res.json(parsedData);
    } catch (error) {
        console.error("Error fetching spot info:", error.message);
        res.status(500).json({
            error: "Failed to generate AI spot info.",
            details: error.message
        });
    }
};
