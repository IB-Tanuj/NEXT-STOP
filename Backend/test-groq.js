import dotenv from 'dotenv';
dotenv.config();
import { searchAndFetchMultiple } from './services/tinyfishService.js';
import { generateStaySearchQuery, cleanWebDataWithKey } from './services/queryRouterService.js';

async function run() {
    const location = 'Delhi';
    const stayType = 'budget';
    const searchQuery = generateStaySearchQuery(location, stayType);
    console.log("Search Query:", searchQuery);

    const { text } = await searchAndFetchMultiple(searchQuery);
    console.log("TinyFish Text length:", text.length);
    console.log("--- First 4500 chars ---");
    console.log(text.substring(0, 4500));
    console.log("------------------------");

    const schema = {
        stays: [
            { name: "", pricePerNight: 0, rating: "", maxCapacity: 0, highlight: "" }
        ]
    };

    const apiKey = process.env.GROQ_PROMPT_CLEANING_KEY || process.env.GROQ_API_KEY;
    const prompt = `Extract up to 5 actual ${stayType} accommodation options in ${location}, India from the text. For each, provide the name, price per night in INR (number only), rating out of 5, maximum room capacity (number of people), and a 3-word highlight. Extract ONLY real hotel names. 
CRITICAL RULES FOR PRICES:
1. If the scraped price is in USD ($), you MUST convert it to INR by multiplying by 96.
2. If the number is suspiciously low (e.g., under 300), assume it was USD and multiply it by 96. 
3. If a real hotel is found but its price is missing in the text, estimate a highly realistic INR price based on its star rating, location, and the user's ${stayType} preference.
4. If ${stayType} is 'budget', ensure prices are generally under 2500 INR. If ${stayType} is 'hostel', ensure prices are under 1000 INR. Ignore luxury hotels if the user wants budget.`;

    try {
        const result = await cleanWebDataWithKey(text, schema, prompt, apiKey);
        console.log("Groq Result:", JSON.stringify(result, null, 2));
    } catch (e) {
        console.error("Error cleaning data:", e);
    }
}

run();
