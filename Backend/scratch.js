import dotenv from 'dotenv';
dotenv.config();

const getApiKey = () => process.env.RAPIDAPI_KEY_2;
const getApiHost = () => process.env.RAPID_HOST_2 || 'flixbus-api2.p.rapidapi.com';

const fetchFromFlixbus = async (endpoint) => {
    const currentHost = getApiHost();
    const url = `https://${currentHost}${endpoint}`;
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'x-rapidapi-key': getApiKey(),
            'x-rapidapi-host': currentHost,
            'Content-Type': 'application/json'
        }
    });
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return await res.json();
};

// Dedup logic — same as the controller
const deduplicateTrips = (trips) => {
    const seen = new Map();
    const unique = [];
    for (const trip of trips) {
        const depTime = trip.departure?.time;
        if (!depTime) continue;
        if (!seen.has(depTime)) {
            seen.set(depTime, true);
            unique.push(trip);
        }
    }
    return unique;
};

async function test() {
    const date = '2026-08-07';
    console.log(`Searching Delhi -> Dehradun on ${date}...`);
    
    const result = await fetchFromFlixbus(`/search?currency=EUR&date=${date}&locale=en&children=0&adult=1&bikes=0&toCityId=52c74eb5-299b-4207-be30-1aad618958aa&fromCityId=a002c4a4-1eef-4afa-82d9-ecd690ea51c5`);
    const rawTrips = result.trips || [];
    const uniqueTrips = deduplicateTrips(rawTrips);

    console.log(`\n📊 Raw trips from API: ${rawTrips.length}`);
    console.log(`✅ After deduplication: ${uniqueTrips.length}`);
    console.log(`\nFirst 5 unique trips:`);
    for (let i = 0; i < Math.min(5, uniqueTrips.length); i++) {
        const t = uniqueTrips[i];
        console.log(`  ${i+1}. Dep: ${t.departure?.time} → Arr: ${t.arrival?.time} | €${t.price?.total}`);
    }
}
test();
