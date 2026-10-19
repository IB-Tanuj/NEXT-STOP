import { buildCacheKey, bucketize, get as cacheGet, set as cacheSet } from '../utils/itineraryCache.js';
import { saveGeminiResult, getGeminiResult } from '../utils/geminiLogger.js';
import { validateItinerary, validateSummary } from './tripAiValidation.js';
import { createGeminiClient, getGeminiModel, getGeminiApiKeys } from './geminiConfig.js';
import { getDahlApiKey, getDahlApiUrl, getDahlModel, isDahlConfigured } from './dahlConfig.js';
import { parseGeminiJson } from './geminiResponse.js';

export const askDahl = async (prompt, maxOutputTokens, timeoutMs = 90000) => {
    const apiKey = getDahlApiKey();
    if (!apiKey) {
        throw new Error('No Dahl API key configured. Set DAHL_API_KEY.');
    }
    const apiUrl = getDahlApiUrl();
    const model = getDahlModel();

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model,
                messages: [
                    {
                        role: 'system',
                        content: 'Return ONLY valid JSON. Do not include markdown or explanations.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: 0.7,
                max_tokens: maxOutputTokens,
            }),
            signal: controller.signal,
        });

        if (!response.ok) {
            const errBody = await response.text().catch(() => '');
            throw new Error(`Dahl API returned HTTP ${response.status}: ${errBody || response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (!content) {
            throw new Error('Dahl API returned an empty completion.');
        }

        return parseGeminiJson(content);
    } finally {
        clearTimeout(timer);
    }
};

export const askGemini = async (prompt, maxOutputTokens) => {
    const keys = getGeminiApiKeys();
    if (!keys.length) {
        throw new Error('No Gemini API key configured. Set GEMINI_EXTRA or GEMINI_KEY.');
    }
    const primaryModel = getGeminiModel();
    const candidateModels = [primaryModel, 'gemini-3.6-flash', 'gemini-flash-latest']
        .filter((m, i, arr) => Boolean(m) && arr.indexOf(m) === i);

    let lastError = null;

    for (const model of candidateModels) {
        for (const apiKey of keys) {
            try {
                const response = await createGeminiClient(apiKey).models.generateContent({
                    model,
                    contents: prompt,
                    config: {
                        temperature: 0.7,
                        maxOutputTokens,
                        responseMimeType: 'application/json',
                        systemInstruction: 'Return ONLY valid JSON. Do not include markdown or explanations.',
                    },
                });
                return parseGeminiJson(response.text);
            } catch (err) {
                lastError = err;
                console.warn(`[TripAI] Gemini attempt failed (model=${model}, key=${apiKey.slice(0, 10)}...): ${err.message}`);
            }
        }
    }

    throw lastError || new Error('All Gemini generation attempts failed.');
};

export const askAi = async (prompt, maxOutputTokens) => {
    if (isDahlConfigured()) {
        try {
            return await askDahl(prompt, maxOutputTokens);
        } catch (dahlError) {
            console.warn(`[TripAI] Dahl generation attempt failed: ${dahlError.message}. Falling back to Gemini...`);
        }
    }

    return await askGemini(prompt, maxOutputTokens);
};

export const generateSummaryData = async ({
    location,
    days,
    budget,
    stayType,
    transport,
    selectedActivities,
    selectedFestivals,
}) => {
    const selectedActivityNames = (selectedActivities || [])
        .map(activity => typeof activity === 'string' ? activity : activity?.name)
        .filter(Boolean)
        .sort();
    const selectedFestivalNames = (selectedFestivals || [])
        .map(festival => typeof festival === 'string' ? festival : festival?.name)
        .filter(Boolean)
        .sort();
    const cacheKey = [
        'trip_plan:v2',
        location.toLowerCase().trim(),
        days || 3,
        bucketize(Number(budget) || 0),
        stayType || 'budget',
        transport || 'train',
        selectedActivityNames.join('+') || 'none',
        selectedFestivalNames.join('+') || 'none',
    ].map(value => encodeURIComponent(String(value))).join(':');
    const cached = await getGeminiResult(cacheKey);
    if (cached?.output_result) {
        try { return { data: validateSummary(cached.output_result), cacheStatus: 'HIT' }; }
        catch { /* An old incomplete cache entry must be regenerated. */ }
    }

    const prompt = `Generate a JSON trip plan for:
Location: ${location}
Duration: ${days || 3} days
Budget: ₹${bucketize(Number(budget) || 0)}
Stay type: ${stayType || 'budget'}
Transport: ${transport || 'train'}
Selected activities: ${selectedActivityNames.join(', ') || 'none specified'}
Selected festivals: ${selectedFestivalNames.join(', ') || 'none specified'}

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

    const data = validateSummary(await askAi(prompt, 2000));
    saveGeminiResult('trip_plan', prompt, data, null, { location, days, budget, stayType, transport }, cacheKey);
    return { data, cacheStatus: 'MISS' };
};

export const generateItineraryData = async (inputs) => {
    const { location, days, budget, stayType, transport, selectedActivities, selectedFestivals } = inputs;
    const cacheKey = buildCacheKey(inputs);
    const cached = await cacheGet(cacheKey);
    if (cached) {
        try { return { data: validateItinerary(cached), cacheStatus: 'HIT' }; }
        catch { /* Retry incomplete cached output instead of marking it ready. */ }
    }

    const activities = (selectedActivities || []).map(activity => typeof activity === 'string' ? activity : activity?.name).filter(Boolean).join(', ');
    const festivals = (selectedFestivals || []).map(festival => typeof festival === 'string' ? festival : festival?.name).filter(Boolean).join(', ');
    const month = new Date().toLocaleString('en-IN', { month: 'long', timeZone: 'Asia/Kolkata' });
    const prompt = `You are a travel planning expert for India. Generate ONLY a detailed day-by-day itinerary for:
Location: ${location}
Duration: ${days || 3} days
Budget: ₹${bucketize(Number(budget) || 0)}
Stay type: ${stayType || 'budget'}
Transport: ${transport || 'train'}
Travel Month: ${month}. Only suggest places and activities appropriate for this month/season.
Selected activities: ${activities || 'none specified'}
Selected festivals: ${festivals || 'none specified'}

Return ONLY raw JSON with this schema:
{"itinerary": [{"day": 1, "title": "Day title", "morning": "Morning plan", "afternoon": "Afternoon plan", "evening": "Evening plan", "estimatedCost": 500}]}`;

    const data = validateItinerary(await askAi(prompt, 3000));
    cacheSet(cacheKey, data);
    return { data, cacheStatus: 'MISS' };
};
