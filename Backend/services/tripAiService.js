import { GoogleGenAI } from '@google/genai';
import { buildCacheKey, bucketize, get as cacheGet, set as cacheSet } from '../utils/itineraryCache.js';
import { saveGeminiResult, getGeminiResult } from '../utils/geminiLogger.js';
import { validateItinerary, validateSummary } from './tripAiValidation.js';

const getGeminiClient = () => {
    if (!process.env.GEMINI_EXTRA) throw new Error('GEMINI_EXTRA is not defined.');
    return new GoogleGenAI({ apiKey: process.env.GEMINI_EXTRA, httpOptions: { timeout: 90000 } });
};

const askGemini = async (prompt, maxOutputTokens) => {
    const response = await getGeminiClient().models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
            temperature: 0.7,
            maxOutputTokens,
            systemInstruction: 'Return ONLY valid JSON. Do not include markdown or explanations.',
        },
    });
    return JSON.parse((response.text || '').replace(/```json|```/g, '').trim());
};

export const generateSummaryData = async ({ location, days, budget, stayType, transport }) => {
    const cacheKey = `trip_plan:${location.toLowerCase()}`;
    const cached = await getGeminiResult(cacheKey);
    if (cached?.output_result) {
        try { return { data: validateSummary(cached.output_result), cacheStatus: 'HIT' }; }
        catch { /* An old incomplete cache entry must be regenerated. */ }
    }

    const prompt = `Generate a JSON trip plan for:
Location: ${location}

RULES:
1. Return ONLY raw JSON. No markdown formatting, no text before or after.
2. Exactly 4 activities, 2 festivals, 6 foods, 2 emergency numbers.
3. All description fields MUST be under 8 words.
4. ACTIVITIES MUST be real adventure/outdoor/experience-based activities tourists can DO at this location, such as rafting, paragliding, trekking, kayaking, skiing or cultural workshops.
5. Do not list tourist spots, landmarks, temples, viewpoints or villages as activities.
6. Use specific activity names, not place names. If there are fewer adventure activities, include real cultural experiences.

JSON SCHEMA:
{
  "activities": [{"id": "1", "name": "", "description": "", "bestTime": ""}],
  "festivals": [{"id": "1", "name": "", "date": "", "description": ""}],
  "foodRecommendations": [{"name": "", "type": "", "mustTry": true, "description": ""}],
  "localEmergency": [{"label": "", "number": ""}]
}`;

    const data = validateSummary(await askGemini(prompt, 2000));
    saveGeminiResult('trip_plan', prompt, data, null, { location, days, budget, stayType, transport }, cacheKey);
    return { data, cacheStatus: 'MISS' };
};

export const generateItineraryData = async (inputs) => {
    const { location, days, budget, stayType, transport, selectedActivities } = inputs;
    const cacheKey = buildCacheKey(inputs);
    const cached = await cacheGet(cacheKey);
    if (cached) {
        try { return { data: validateItinerary(cached), cacheStatus: 'HIT' }; }
        catch { /* Retry incomplete cached output instead of marking it ready. */ }
    }

    const activities = (selectedActivities || []).map(activity => typeof activity === 'string' ? activity : activity.name).join(', ');
    const month = new Date().toLocaleString('en-IN', { month: 'long', timeZone: 'Asia/Kolkata' });
    const prompt = `You are a travel planning expert for India. Generate ONLY a detailed day-by-day itinerary for:
Location: ${location}
Duration: ${days || 3} days
Budget: ₹${bucketize(Number(budget) || 0)}
Stay type: ${stayType || 'budget'}
Transport: ${transport || 'train'}
Travel Month: ${month}. Only suggest places and activities appropriate for this month/season.
Selected activities: ${activities || 'none specified'}

Return ONLY raw JSON with this schema:
{"itinerary": [{"day": 1, "title": "Day title", "morning": "Morning plan", "afternoon": "Afternoon plan", "evening": "Evening plan", "estimatedCost": 500}]}`;

    const data = validateItinerary(await askGemini(prompt, 3000));
    cacheSet(cacheKey, data);
    return { data, cacheStatus: 'MISS' };
};
