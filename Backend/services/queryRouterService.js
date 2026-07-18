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
 * Step 4: Cleaner — Ask Groq to extract structured data from raw web content
 * Strips all URLs. Returns clean JSON matching the provided schema.
 * Uses ~200 tokens because the output is a small JSON object.
 */
export async function cleanWebData(rawText, outputSchema, extractionGoal) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error("GROQ_API_KEY is not defined.");
    }

    // Truncate raw text to 2000 chars to save tokens
    const truncated = rawText.substring(0, 2000);

    const prompt = `${extractionGoal}

Extract data from the web content below. Return ONLY valid JSON matching this schema:
${JSON.stringify(outputSchema)}

RULES:
- Do NOT include any URLs or web links in any field
- If data is not found, use reasonable estimates and mark with "(estimated)"
- Keep all text fields short (under 10 words)

Web content:
${truncated}`;

    const response = await axios.post(
        GROQ_API_URL,
        {
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "Return ONLY valid JSON. Never include URLs or links. No markdown." },
                { role: "user", content: prompt }
            ],
            temperature: 0.3,
            max_tokens: 300,
        },
        {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            }
        }
    );

    const text = response.data.choices[0].message.content.trim();
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
}
