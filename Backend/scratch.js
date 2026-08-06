import dotenv from 'dotenv';
dotenv.config();

const currentHost = process.env.RAPID_HOST_2 || 'flixbus-api2.p.rapidapi.com';
const key = process.env.RAPIDAPI_KEY_2 || process.env.RAPIDAPI_KEY;

async function run() {
  const url = `https://${currentHost}/search?currency=EUR&date=2026-08-04&locale=en&children=0&adult=1&bikes=0&toCityId=8c8bc1cc-c072-4377-a433-97f737e1095d&fromCityId=a002c4a4-1eef-4afa-82d9-ecd690ea51c5`;
  
  const res = await fetch(url, {
      headers: { 'x-rapidapi-key': key, 'x-rapidapi-host': currentHost }
  });
  
  console.log("Status:", res.status);
  const data = await res.json();
  console.log("Data:", data);
}
run();
