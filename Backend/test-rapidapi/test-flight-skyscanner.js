import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const apiKey = process.env.RAPIDAPI_KEY;
const apiHost = process.env.RAPIDAPI_FLIGHT_HOST || 'sky-scanner3.p.rapidapi.com';

console.log(`🔍 Testing Skyscanner / Flight Search RapidAPI...`);
console.log(`🔑 Host: ${apiHost}`);
console.log(`🔑 Key Present: ${apiKey ? 'YES' : 'NO'}`);

if (!apiKey) {
  console.error("❌ RAPIDAPI_KEY is missing in your .env file!");
  process.exit(1);
}

async function testSkyscanner() {
  try {
    const options = {
      method: 'GET',
      url: `https://${apiHost}/flights/search-one-way`,
      params: {
        fromEntityId: 'DEL',
        toEntityId: 'BOM',
        departDate: '2026-08-15'
      },
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': apiHost
      },
      timeout: 10000
    };

    console.log(`🚀 Sending request to https://${apiHost}...`);
    const response = await axios.request(options);

    console.log("✅ SUCCESS! Status:", response.status);
    console.log("--- API RESPONSE PREVIEW ---");
    console.log(JSON.stringify(response.data, null, 2).substring(0, 1500));
    console.log("\n---------------------------");
  } catch (error) {
    console.error("❌ API Call Failed!");
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error("Response Data:", error.response.data);
    } else {
      console.error("Error Message:", error.message);
    }
  }
}

testSkyscanner();
