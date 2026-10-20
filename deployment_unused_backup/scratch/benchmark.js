const apiKey = 'REDACTED_DAHL_KEY';

async function benchmark() {
  const models = [
    'deepseek-ai/DeepSeek-V4-Flash-0731',
    'zai-org/GLM-5.3-Flash',
    'MiniMaxAI/MiniMax-M2.7'
  ];

  const prompt = 'Generate a 2-day itinerary for Goa in JSON: {"itinerary": [{"day": 1, "title": "", "morning": "", "afternoon": "", "evening": "", "estimatedCost": 500}]}';

  for (const model of models) {
    console.log(`\nTesting model: ${model}...`);
    const start = Date.now();
    try {
      const res = await fetch('https://inference.dahl.global/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: 'Return ONLY valid JSON. Do not include markdown or explanations.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1200
        })
      });
      const duration = Date.now() - start;
      const json = await res.json();
      console.log(`Result for ${model}: HTTP ${res.status} in ${duration}ms`);
      if (res.ok) {
        const content = json.choices?.[0]?.message?.content || '';
        console.log(`Tokens/Chars: ${content.length}, Has <think>: ${content.includes('<think>')}`);
        console.log(`Preview: ${content.slice(0, 120).replace(/\n/g, ' ')}`);
      } else {
        console.log('Error payload:', JSON.stringify(json));
      }
    } catch (e) {
      console.error(`Failed ${model}:`, e.message);
    }
  }
}

benchmark();
