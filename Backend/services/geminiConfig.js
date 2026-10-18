import { GoogleGenAI } from '@google/genai';

// Keep the default on a generally available Flash model, while allowing the
// deployment to select a newer model without another code change.
export const DEFAULT_GEMINI_MODEL = 'gemini-3.8-flash';

export const getGeminiModel = () =>
    process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;

export const getGeminiApiKeys = () => [
    process.env.GEMINI_EXTRA,
    process.env.GEMINI_KEY,
    process.env.GEMINI_KEY_1,
    process.env.GEMINI_KEY_2,
    process.env.GEMINI_KEY_3,
].filter(Boolean).filter((key, index, keys) => keys.indexOf(key) === index);

export const getGeminiApiKey = () => {
    const [apiKey] = getGeminiApiKeys();
    if (!apiKey) {
        throw new Error('No Gemini API key configured. Set GEMINI_EXTRA or GEMINI_KEY.');
    }
    return apiKey;
};

export const createGeminiClient = (apiKey = getGeminiApiKey()) =>
    new GoogleGenAI({
        apiKey,
        httpOptions: { timeout: 90000 },
    });
