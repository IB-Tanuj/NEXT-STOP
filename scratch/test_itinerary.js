const API_KEY = 'REDACTED_DAHL_KEY';

async function testItinerary() {
  const prompt = `You are a travel planning expert for India. Generate ONLY a detailed day-by-day itinerary for:
Location: Jaipur, Rajasthan
Duration: 3 days
Budget: ₹15000
Stay type: Boutique heritage hotel
Transport: Cab / Auto
Travel Month: October

Return ONLY raw JSON with this schema:
{"itinerary": [{"day": 1, "title": "Day title", "morning": "Morning plan", "afternoon": "Afternoon plan", "evening": "Evening plan", "estimatedCost": 500}]}`;

  console.log('Sending request to Dahl inference API with MiniMaxAI/MiniMax-M2.7...');
  const startTime = Date.now();

  try {
    const res = await fetch('https://inference.dahl.global/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'MiniMaxAI/MiniMax-M2.7',
        messages: [
          { role: 'system', content: 'Return ONLY valid JSON. Do not include markdown or explanations.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      })
    });

    console.log(`Status: ${res.status} ${res.statusText} (${Date.now() - startTime}ms)`);
    const json = await res.json();
    
    if (!res.ok) {
      console.error('API Error Response:', JSON.stringify(json, null, 2));
      return;
    }

    const content = json.choices?.[0]?.message?.content;
    console.log('\n--- Raw Model Output ---');
    console.log(content);

    // Test JSON parsing and validation matching the website's validation
    const cleaned = content.trim().replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    const parsed = JSON.parse(cleaned);

    console.log('\n--- Successfully Parsed JSON ---');
    console.log(JSON.stringify(parsed, null, 2));

    // Validate using project structure
    const isValid = Array.isArray(parsed?.itinerary) && parsed.itinerary.every(day => 
      Number.isInteger(day.day) && day.title && day.morning && day.afternoon && day.evening
    );

    console.log(`\nValidation status: ${isValid ? 'PASSED (Compatible with Next-Stop frontend/backend)' : 'FAILED'}`);
  } catch (err) {
    console.error('Execution Error:', err);
  }
}

testItinerary();
