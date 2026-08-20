import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const testGemini = async () => {
    try {
        const apiKey = process.env.GEMINI_KEY;
        const ai = new GoogleGenAI({ apiKey });
        
        console.log("Listing models...");
        // the new sdk method is usually ai.models.list() or similar, let's just use axios to list models
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await res.json();
        console.log(data.models.map(m => m.name).filter(n => n.includes('flash')));
    } catch (e) {
        console.error(e);
    }
}

testGemini();
