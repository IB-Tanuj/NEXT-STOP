import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenAI } from '@google/genai';

const run = async () => {
    try {
        const ai = new GoogleGenAI({apiKey: process.env.GEMINI_KEY});
        const prompt = `You are a travel expert for India. Provide detailed, accurate visitor information for the following tourist spots located in Rajasthan, India.

SPOTS TO ANALYZE:
1. Hawa Mahal
2. Amber Fort

Return ONLY a valid JSON object where the keys are the EXACT spot names listed above, and the value is the spot info object. NO markdown formatting, NO backticks. Ensure prices are in INR (₹).

Format:
{
  "Spot Name 1": {
    "entryPrice": { "adult": 0, "child": 0, "free": true },
    "openingHours": { "open": "", "close": "", "closedOn": "", "note": "" },
    "rules": [],
    "permit": { "required": false, "details": "", "cost": 0 },
    "ageRestrictions": { "hasRestriction": false, "details": "" },
    "recommendedDuration": "",
    "photographyPolicy": { "allowed": true, "fee": 0, "dronesAllowed": false },
    "accessibility": "",
    "tips": []
  }
}`;
        const res = await ai.models.generateContent({
            model: 'gemini-3.7-flash', 
            contents: prompt, 
            config: {temperature: 0.2}
        });
        console.log('SUCCESS:', res.text);
    } catch(e) {
        console.error('ERROR:', e.message);
        if (e.response) {
            console.error(e.response.status, e.response.data);
        }
    }
};
run();
