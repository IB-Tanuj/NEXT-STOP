import { GoogleGenAI } from '@google/genai';
import { buildCacheKey, bucketize, get as cacheGet, set as cacheSet, getStats } from '../utils/itineraryCache.js';
import { saveGeminiResult, getGeminiResult } from '../utils/geminiLogger.js';

const GEMINI_MODEL = "gemini-3.6-flash";

function getGeminiClient() {
    const apiKey = process.env.GEMINI_EXTRA;
    if (!apiKey) {
        throw new Error("GEMINI_EXTRA is not defined in environment variables.");
    }
    return new GoogleGenAI({ apiKey });
}

export const generateTripPlan = async (req, res) => {
    try {
        const { location, days, budget, stayType, transport, spots } = req.body;

        if (!location) {
            return res.status(400).json({ error: "Location is required" });
        }

        const cacheKey = `trip_plan:${location.toLowerCase()}`;
        
        // Check permanent cache in Supabase
        const cachedGemini = await getGeminiResult(cacheKey);
        if (cachedGemini && cachedGemini.output_result) {
            console.log(`[Gemini Permanent Cache] HIT for trip plan: ${cacheKey}`);
            return res.json(cachedGemini.output_result);
        }

        const prompt = `Generate a JSON trip plan for:
Location: ${location}

RULES:
1. Return ONLY raw JSON. No markdown formatting (\`\`\`). No text before or after.
2. STRICT ITEM LIMITS: Exactly 4 activities, 2 festivals, 6 foods, 2 emergency numbers. DO NOT EXCEED THIS.
3. STRICT LENGTH LIMITS: All "description" fields MUST be under 5 words. Be extremely brief.

JSON SCHEMA:
{
  "activities": [{"id": "1", "name": "", "description": "", "bestTime": ""}],
  "festivals": [{"id": "1", "name": "", "date": "", "description": ""}],
  "foodRecommendations": [{"name": "", "type": "", "mustTry": true, "description": ""}],
  "localEmergency": [{"label": "", "number": ""}]
}`;

        const ai = getGeminiClient();

        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
            config: {
                temperature: 0.7,
                maxOutputTokens: 2000,
                systemInstruction: "Return ONLY valid JSON. Do not include markdown or explanations.",
            },
        });

        const text = response.text || "";
        const clean = text.replace(/```json|```/g, "").trim();

        if (!clean) {
            throw new Error("Gemini returned an empty response.");
        }

        const parsedData = JSON.parse(clean);

        // Permanently save to gemini_results
        saveGeminiResult('trip_plan', prompt, parsedData, null, {
            location, days: days || 3, budget: budget || 0, stayType: stayType || 'budget', transport: transport || 'train',
        }, cacheKey);

        res.json(parsedData);
    } catch (error) {
        console.error("Error generating trip plan:", error.message);
        const status = error.code === 'ECONNABORTED' ? 504 : 500;
        res.status(status).json({
            error: "Failed to generate AI trip plan.",
            details: error.message
        });
    }
};

export const generateItinerary = async (req, res) => {
    try {
        const { location, days, budget, stayType, transport, selectedActivities, selectedFestivals } = req.body;

        if (!location) {
            return res.status(400).json({ error: "Location is required" });
        }

        // ── Build cache key (budget is bucketed to ₹500 increments) ──
        const cacheKey = buildCacheKey({ location, days, budget, stayType, transport, selectedActivities, selectedFestivals });
        const bucketedBudget = bucketize(Number(budget) || 0);

        console.log(`[Itinerary Cache] Key: ${cacheKey}`);

        // ── Check backend in-memory cache ──
        const cached = await cacheGet(cacheKey);
        if (cached) {
            console.log(`[Itinerary Cache] HIT — returning in-memory cached result (0 tokens)`);
            res.setHeader('X-Cache', 'HIT');
            return res.json(cached);
        }

        // ── Check permanent cache in Supabase ──
        const cachedGemini = await getGeminiResult(`itinerary:${cacheKey}`);
        if (cachedGemini && cachedGemini.output_result) {
            console.log(`[Gemini Permanent Cache] HIT for itinerary: itinerary:${cacheKey}`);
            cacheSet(cacheKey, cachedGemini.output_result); // populate in-memory cache
            res.setHeader('X-Cache', 'HIT');
            return res.json(cachedGemini.output_result);
        }

        console.log(`[Itinerary Cache] MISS — calling Gemini API`);

        const activitiesText = selectedActivities?.length > 0 ? selectedActivities.map(a => a.name).join(", ") : "none specified";
        const festivalsText = selectedFestivals?.length > 0 ? selectedFestivals.map(f => f.name).join(", ") : "none specified";

        const prompt = `You are a travel planning expert for India. Generate ONLY a detailed day-by-day itinerary for:

Location: ${location}
Duration: ${days || 3} days
Budget: ₹${bucketedBudget}
Stay type: ${stayType || 'budget'}
Transport: ${transport || 'train'}
User has already selected these activities: ${activitiesText}
User has already selected these festivals: ${festivalsText}

Return ONLY a valid JSON object with NO markdown, no backticks, no explanation. Just raw JSON like this:
{
  "itinerary": [
    {"day": 1, "title": "Day title", "morning": "Morning plan", "afternoon": "Afternoon plan", "evening": "Evening plan", "estimatedCost": 500}
  ]
}`;

        const ai = getGeminiClient();

        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
            config: {
                temperature: 0.7,
                maxOutputTokens: 3000,
                systemInstruction: "Return ONLY valid JSON. Do not include markdown or explanations.",
            },
        });

        const text = response.text || "";
        const clean = text.replace(/```json|```/g, "").trim();

        if (!clean) {
            throw new Error("Gemini returned an empty response.");
        }

        const parsedData = JSON.parse(clean);

        // Permanently save to gemini_results
        saveGeminiResult('itinerary', prompt, parsedData, null, {
            location, days: days || 3, budget: bucketedBudget, stayType: stayType || 'budget', transport: transport || 'train',
        }, `itinerary:${cacheKey}`);

        // ── Store in backend cache ──
        cacheSet(cacheKey, parsedData);
        console.log(`[Itinerary Cache] Stored result. Cache stats:`, getStats());

        res.setHeader('X-Cache', 'MISS');
        res.json(parsedData);
    } catch (error) {
        console.error("Error generating itinerary:", error.message);
        const status = error.code === 'ECONNABORTED' ? 504 : 500;
        res.status(status).json({
            error: "Failed to generate AI itinerary.",
            details: error.message
        });
    }
};


