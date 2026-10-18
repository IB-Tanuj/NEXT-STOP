import dotenv from 'dotenv';
import { createGeminiClient, getGeminiApiKey, getGeminiModel } from './services/geminiConfig.js';
dotenv.config();

const testGemini = async () => {
    try {
        const model = getGeminiModel();
        const ai = createGeminiClient(getGeminiApiKey());
        const response = await ai.models.generateContent({
            model,
            contents: 'Reply with exactly this JSON object: {"ok":true}',
            config: { responseMimeType: 'application/json', maxOutputTokens: 20 },
        });
        console.log(`Gemini smoke test passed using ${model}: ${response.text}`);
    } catch (e) {
        console.error(`Gemini smoke test failed: ${e.message}`);
        process.exitCode = 1;
    }
}

testGemini();
