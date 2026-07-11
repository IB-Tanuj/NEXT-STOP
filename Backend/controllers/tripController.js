import axios from 'axios';

export const generateTripPlan = async (req, res) => {
    try {
        const { location, days, budget, stayType, transport, spots } = req.body;

        if (!location) {
            return res.status(400).json({ error: "Location is required" });
        }

        const prompt = `You are a travel planning expert for India. Generate a detailed trip plan for the following:

Location: ${location}
Duration: ${days || 3} days
Budget remaining for food & activities: ₹${budget || 0}
Stay type: ${stayType || 'budget'}
Transport: ${transport || 'train'}
Selected spots: ${spots?.join(", ") || "none specified"}

Return ONLY a valid JSON object with NO markdown, no backticks, no explanation. Just raw JSON like this:
{
  "activities": [
    {"id": "1", "name": "Activity name", "cost": 500, "duration": "2 hours", "description": "Brief description", "bestTime": "Morning"}
  ],
  "festivals": [
    {"id": "1", "name": "Festival name", "cost": 0, "date": "Month/Season", "description": "Brief description"}
  ],
  "itinerary": [
    {"day": 1, "title": "Day title", "morning": "Morning plan", "afternoon": "Afternoon plan", "evening": "Evening plan", "estimatedCost": 500}
  ],
  "stayRecommendations": [
    {"name": "Place name", "type": "hostel/hotel", "pricePerNight": 500, "rating": 4.2, "highlight": "Key feature"}
  ],
  "foodRecommendations": [
    {"name": "Dish or restaurant name", "type": "local/restaurant/cafe", "avgCost": 200, "mustTry": true, "description": "Brief description"}
  ],
  "localEmergency": [
    {"label": "Local Police", "number": "0832-2224111"},
    {"label": "District Hospital", "number": "0832-2458725"}
  ]
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
                max_tokens: 3300,
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
