import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.RAPIDAPI_KEY;
if (!API_KEY) throw new Error('RAPIDAPI_KEY is missing from the environment.');

async function testFlightSearch() {
  const options = {
    method: 'GET',
    url: 'https://google-flights2.p.rapidapi.com/api/v1/searchFlights',
    params: {
        departure_id: 'DEL',
        arrival_id: 'BOM',
        outbound_date: '2026-08-15',
        currency: 'INR',
        travel_class: 'ECONOMY'
    },
    headers: {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': 'google-flights2.p.rapidapi.com',
      'Content-Type': 'application/json'
    }
  };

  try {
    console.log("🚀 Testing /api/v1/searchFlights...");
    const response = await axios.request(options);
    console.log("✅ SUCCESS! Status:", response.status);
    console.log(JSON.stringify(response.data, null, 2).substring(0, 2000));
  } catch (error) {
    console.error("❌ Failed!");
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error("Data:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
  }
}

testFlightSearch();
