import axios from 'axios';
import { buildCacheKey, bucketize, get as cacheGet, set as cacheSet, getStats } from '../utils/itineraryCache.js';

export const generateTripPlan = async (req, res) => {
    try {
        const { location, days, budget, stayType, transport, spots } = req.body;

        if (!location) {
            return res.status(400).json({ error: "Location is required" });
        }

        const prompt = `Generate a JSON trip plan for:
Location: ${location} | ${days || 3} days | Budget: ₹${budget || 0} | Stay: ${stayType || 'budget'} | Transport: ${transport || 'train'} | Spots: ${spots?.join(", ") || "none"}

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

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            console.error("GROQ_API_KEY is not defined in backend environment variables.");
            return res.status(500).json({ error: "Backend configuration error: GROQ API key missing" });
        }

        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "Return ONLY valid JSON. Do not include markdown or explanations."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                }
            }
        );

        const text = response.data?.choices?.[0]?.message?.content || "";
        const clean = text.replace(/```json|```/g, "").trim();

        if (!clean) {
            throw new Error("Groq returned an empty response.");
        }

        const parsedData = JSON.parse(clean);
        res.json(parsedData);
    } catch (error) {
        console.error("Error generating trip plan:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: "Failed to generate AI trip plan.",
            details: error.response?.data || error.message
        });
    }
};

export const generateItinerary = async (req, res) => {
    try {
        const { location, days, budget, stayType, transport, selectedActivities, selectedFestivals } = req.body;

        if (!location) {
            return res.status(400).json({ error: "Location is required" });
        }

        const activitiesText = selectedActivities?.length > 0 ? selectedActivities.map(a => a.name).join(", ") : "none specified";
        const festivalsText = selectedFestivals?.length > 0 ? selectedFestivals.map(f => f.name).join(", ") : "none specified";

        const prompt = `You are a travel planning expert for India. Generate ONLY a detailed day-by-day itinerary for:

Location: ${location}
Duration: ${days || 3} days
Budget: ₹${budget || 0}
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

        const apiKey = process.env.GROQ_ITINERARY_API_KEY || process.env.GROQ_API_KEY;
        if (!apiKey) {
            console.error("GROQ API key is not defined in backend environment variables.");
            return res.status(500).json({ error: "Backend configuration error: GROQ API key missing" });
        }

        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "Return ONLY valid JSON. Do not include markdown or explanations."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 3000,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                }
            }
        );

        const text = response.data?.choices?.[0]?.message?.content || "";
        const clean = text.replace(/```json|```/g, "").trim();

        if (!clean) {
            throw new Error("Groq returned an empty response.");
        }

        const parsedData = JSON.parse(clean);
        res.json(parsedData);
    } catch (error) {
        console.error("Error generating itinerary:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: "Failed to generate AI itinerary.",
            details: error.response?.data || error.message
        });
    }
};
