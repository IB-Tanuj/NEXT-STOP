import axios from 'axios';

export const generateTripPlan = async (req, res) => {
    try {
        const { location, days, budget, stayType, transport, spots } = req.body;

        if (!location) {
            return res.status(400).json({ error: "Location is required" });
        }

        const prompt = `You are a travel planning expert for India. Generate a concise trip plan for:

Location: ${location}
Duration: ${days || 3} days
Budget remaining for food & activities: ₹${budget || 0}
Stay type: ${stayType || 'budget'}
Transport: ${transport || 'train'}
Selected spots: ${spots?.join(", ") || "none specified"}

Return ONLY a valid JSON object with NO markdown, no backticks, no explanation. Do NOT include a day-by-day itinerary. Follow this exact JSON structure and limit item counts:
{
  "activities": [
    {"id": "1", "name": "Activity name", "cost": 500, "duration": "2 hours", "description": "Brief description (max 10 words)", "bestTime": "Morning"}
  ], // Max 5 activities
  "festivals": [
    {"id": "1", "name": "Festival name", "cost": 0, "date": "Month/Season", "description": "Brief description (max 10 words)"}
  ], // Max 2 festivals
  "stayRecommendations": [
    {"name": "Place name", "type": "hostel/hotel", "pricePerNight": 500, "rating": 4.2, "highlight": "Key feature"}
  ], // Max 3 places
  "foodRecommendations": [
    {"name": "Dish or restaurant name", "type": "local/restaurant/cafe", "avgCost": 200, "mustTry": true, "description": "Brief description (max 10 words)"}
  ], // Max 4 items
  "localEmergency": [
    {"label": "Local Police", "number": "0832-2224111"}
  ] // Max 3 numbers
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

        const apiKey = process.env.TINYFISH_API_KEY || process.env.GROQ_API_KEY;
        if (!apiKey) {
            console.error("API key is not defined in backend environment variables.");
            return res.status(500).json({ error: "Backend configuration error: API key missing" });
        }

        // Using Tinyfish API if the key exists, falling back to Groq otherwise
        const apiUrl = process.env.TINYFISH_API_KEY 
            ? "https://api.tinyfish.ai/v1/chat/completions" // Update this if Tinyfish uses a different URL
            : "https://api.groq.com/openai/v1/chat/completions";

        const response = await axios.post(
            apiUrl,
            {
                model: process.env.TINYFISH_API_KEY ? "gpt-4o-mini" : "llama-3.3-70b-versatile", // Or whatever model tinyfish requires
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
