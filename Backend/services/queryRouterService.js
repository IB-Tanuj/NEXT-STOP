import { GoogleGenAI } from '@google/genai';

const GEMINI_MODEL = "gemini-3.6-flash";

/**
 * Helper: get or create a shared Gemini client using GEMINI_EXTRA key.
 */
function getGeminiClient() {
    const apiKey = process.env.GEMINI_EXTRA;
    if (!apiKey) {
        throw new Error("GEMINI_EXTRA is not defined in environment variables.");
    }
    return new GoogleGenAI({ apiKey });
}

/**
 * Step 1: Router — Ask Gemini to generate the perfect search query
 * Uses very few tokens (~50) because the output is just a short search string
 */
export async function generateSearchQuery({ type, name, location }) {
    const ai = getGeminiClient();

    const prompt = `Generate a single Google search query to find the current ${type} for "${name}" in ${location}, India. Return ONLY the search query string. Nothing else. No quotes.`;

    const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
            temperature: 0.3,
            maxOutputTokens: 50,
        },
    });

    return response.text.trim().replace(/^["']|["']$/g, '');
}

/**
 * Stay-specific search query — hardcoded template, no Gemini tokens burned.
 * Targets real booking sites for actual hotel names and prices.
 */
export function generateStaySearchQuery(location, stayType) {
    const typeMap = {
        hostel: "hostels",
        budget: "budget hotels",
        mid: "3 star hotels",
        premium: "4 star hotels",
        luxury: "5 star luxury hotels",
    };
    const searchType = typeMap[stayType] || "hotels";
    return `best ${searchType} in ${location} India with price per night 2025`;
}

/**
 * Bus-specific search query — hardcoded template, no Gemini tokens burned.
 * Targets aggregators and booking sites for bus schedules.
 */
export function generateBusSearchQuery(from, to) {
    return `bus tickets from ${from} to ${to} redbus Paytm MakeMyTrip price timings`;
}

/**
 * Flight-specific search query — hardcoded template, no Gemini tokens burned.
 * Targets airline booking sites and flight aggregators.
 */
export function generateFlightSearchQuery(from, to) {
    return `flights from ${from} to ${to} ticket price IndiGo Air India MakeMyTrip Google Flights`;
}

/**
 * Step 4: Cleaner — Ask Gemini to extract structured data from raw web content
 * Strips all URLs. Returns clean JSON matching the provided schema.
 * Uses the GEMINI_EXTRA key.
 */
export async function cleanWebData(rawText, outputSchema, extractionGoal) {
    return cleanWebDataWithKey(rawText, outputSchema, extractionGoal);
}

/**
 * Step 4 (with custom key): Cleaner using Gemini.
 * The apiKey parameter is kept for backward compatibility but ignored —
 * all calls now use GEMINI_EXTRA via getGeminiClient().
 */
export async function cleanWebDataWithKey(rawText, outputSchema, extractionGoal, _apiKey) {
    const ai = getGeminiClient();

    // Truncate raw text to 10000 chars to save tokens while keeping enough data for top 5 hotels
    const truncated = rawText.substring(0, 10000);

    const prompt = `${extractionGoal}

Extract data from the web content below. Return ONLY valid JSON matching this schema:
${JSON.stringify(outputSchema)}

RULES:
- Do NOT include any URLs or web links in any field
- Extract ONLY names that actually appear in the web content below
- NEVER invent or make up hotel/hostel/restaurant names
- If fewer than 5 real options are found in the text, return only what you find
- Keep all text fields short (under 10 words)

Web content:
${truncated}`;

    const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
            temperature: 0.2,
            maxOutputTokens: 800,
            systemInstruction: "Return ONLY valid JSON. Never include URLs or links. Never invent data that is not in the provided text. No markdown.",
        },
    });

    const text = response.text.trim();
    // Remove markdown code blocks if present
    const clean = text.replace(/```json|```/g, "").trim();

    try {
        return JSON.parse(clean);
    } catch (err) {
        console.error("❌ Gemini returned invalid JSON:");
        console.error("--- RAW TEXT ---");
        console.error(text);
        console.error("----------------");
        throw new Error("Gemini returned invalid JSON. Try searching again.");
    }
}
