import axios from 'axios';

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Step 1: Router — Ask Groq to generate the perfect search query
 * Uses very few tokens (~50) because the output is just a short search string
 */
export async function generateSearchQuery({ type, name, location }) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error("GROQ_API_KEY is not defined.");
    }

    const prompt = `Generate a single Google search query to find the current ${type} for "${name}" in ${location}, India. Return ONLY the search query string. Nothing else. No quotes.`;

    const response = await axios.post(
        GROQ_API_URL,
        {
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
            max_tokens: 50,
        },
        {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            }
        }
    );

    return response.data.choices[0].message.content.trim().replace(/^["']|["']$/g, '');
}

/**
 * Stay-specific search query — hardcoded template, no Groq tokens burned.
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
 * Bus-specific search query — hardcoded template, no Groq tokens burned.
 * Targets aggregators and booking sites for bus schedules.
 */
export function generateBusSearchQuery(from, to) {
    return `bus tickets from ${from} to ${to} redbus Paytm MakeMyTrip price timings`;
}

/**
 * Step 4: Cleaner — Ask Groq to extract structured data from raw web content
 * Strips all URLs. Returns clean JSON matching the provided schema.
 * Uses the default GROQ_API_KEY.
 */
export async function cleanWebData(rawText, outputSchema, extractionGoal) {
    return cleanWebDataWithKey(rawText, outputSchema, extractionGoal, process.env.GROQ_API_KEY);
}

/**
 * Step 4 (with custom key): Cleaner using a specified API key.
 * Used by the stay search pipeline with GROQ_PROMPT_CLEANING_KEY.
 */
export async function cleanWebDataWithKey(rawText, outputSchema, extractionGoal, apiKey) {
    if (!apiKey) {
        throw new Error("Groq API key is not defined for cleaning.");
    }

    // Truncate raw text to 5000 chars to save tokens (approx 1000-1500 tokens) while keeping enough data for top 5 hotels
    const truncated = rawText.substring(0, 4500);

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

    const response = await axios.post(
        GROQ_API_URL,
        {
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "Return ONLY valid JSON. Never include URLs or links. Never invent data that is not in the provided text. No markdown." },
                { role: "user", content: prompt }
            ],
            temperature: 0.2,
            max_tokens: 800,
        },
        {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            }
        }
    );

    const text = response.data.choices[0].message.content.trim();
    // Remove markdown code blocks if present
    const clean = text.replace(/```json|```/g, "").trim();

    try {
        return JSON.parse(clean);
    } catch (err) {
        console.error("❌ Groq returned invalid JSON:");
        console.error("--- RAW TEXT ---");
        console.error(text);
        console.error("----------------");
        throw new Error("Groq returned invalid JSON. Try searching again.");
    }
}
