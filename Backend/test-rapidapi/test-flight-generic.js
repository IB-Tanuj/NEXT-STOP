import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const apiKey = process.env.RAPIDAPI_KEY;

// ⚙️ CUSTOMIZE YOUR TEST HERE:
const TARGET_HOST = process.env.RAPIDAPI_FLIGHT_HOST || 'booking-com15.p.rapidapi.com';
const TARGET_URL = `https://${TARGET_HOST}/api/v1/flights/searchFlights`;
const QUERY_PARAMS = {
  fromId: 'DEL.AIRPORT',
  toId: 'BOM.AIRPORT',
  departDate: '2026-08-15',
  pageNo: '1',
  currency_code: 'INR'
};

console.log(`🔍 Testing Custom Flight RapidAPI...`);
console.log(`🌐 Target URL: ${TARGET_URL}`);

if (!apiKey) {
  console.error("❌ RAPIDAPI_KEY is missing in your .env file!");
  process.exit(1);
}

async function testGenericApi() {
  try {
    const options = {
      method: 'GET',
      url: TARGET_URL,
      params: QUERY_PARAMS,
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': TARGET_HOST
      },
      timeout: 10000
    };

    console.log("🚀 Sending request...");
    const response = await axios.request(options);

    console.log("✅ SUCCESS! Status:", response.status);
    console.log("--- API RESPONSE PREVIEW ---");
    console.log(JSON.stringify(response.data, null, 2).substring(0, 2000));
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

testGenericApi();
