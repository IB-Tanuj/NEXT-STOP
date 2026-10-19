import { parseGeminiJson } from '../Backend/services/geminiResponse.js';
import { validateSummary } from '../Backend/services/tripAiValidation.js';

const API_KEY = 'REDACTED_DAHL_KEY';

async function testSummary() {
  const prompt = `Generate a JSON trip plan for:
Location: Jaipur
Duration: 3 days
Budget: ₹15000
Stay type: budget
Transport: train
Selected activities: none specified
Selected festivals: none specified

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

  console.log('Testing summary generation on Dahl...');
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

  const json = await res.json();
  const content = json.choices[0].message.content;
  import('fs').then(fs => fs.writeFileSync('scratch/raw_summary.txt', content));
  console.log('Saved raw content, length:', content.length);
  const withoutThink = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  console.log('Without think length:', withoutThink.length);
  console.log('Without think text:', withoutThink);
  const parsed = parseGeminiJson(withoutThink);
  const validated = validateSummary(parsed);
  console.log('Validated summary successfully!');
}

testSummary().catch(console.error);
