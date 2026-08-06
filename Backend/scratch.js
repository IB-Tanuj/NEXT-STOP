import dotenv from 'dotenv';
dotenv.config();

const host = 'flixbus-api2.p.rapidapi.com';
const key = process.env.RAPIDAPI_KEY_2;

async function testKey() {
  console.log('Testing KEY 2:', key.substring(0, 10) + '...');
  try {
    const res = await fetch(`https://${host}/autocomplete?query=Srinagar&lang=en`, {
      headers: { 'x-rapidapi-key': key, 'x-rapidapi-host': host }
    });
    console.log('Status:', res.status, res.statusText);
    console.log('Headers:', Object.fromEntries(res.headers.entries()));
    const text = await res.text();
    console.log('Body:', text);
  } catch (e) {
    console.error('Fetch error:', e);
  }
}
testKey();
