import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.RAPIDAPI_KEY;
if (!API_KEY) throw new Error('RAPIDAPI_KEY is missing from the environment.');

async function testLocations() {
  const options = {
    method: 'GET',
    url: 'https://google-flights2.p.rapidapi.com/api/v1/getLocations',
    params: {
        query: 'delhi' // Adding a query param just in case the API expects one to search
    },
    headers: {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': 'google-flights2.p.rapidapi.com',
      'Content-Type': 'application/json'
    }
  };

  try {
    console.log("🚀 Fetching locations from google-flights2...");
    const response = await axios.request(options);
    console.log("✅ SUCCESS! Status:", response.status);
    console.log("--- API RESPONSE PREVIEW ---");
    // Print the first 2000 characters of the JSON response
    console.log(JSON.stringify(response.data, null, 2).substring(0, 2000));
  } catch (error) {
    console.error("❌ API Call Failed!");
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error("Data:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
  }
}

testLocations();
