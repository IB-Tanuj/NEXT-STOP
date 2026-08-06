import dotenv from 'dotenv';
dotenv.config();

const getApiKey = () => process.env.RAPIDAPI_KEY_2;
const getApiHost = () => process.env.RAPID_HOST_2 || 'flixbus-api2.p.rapidapi.com';

const fetchFromFlixbus = async (endpoint) => {
    const currentHost = getApiHost();
    const url = `https://${currentHost}${endpoint}`;
    
    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': getApiKey(),
                'x-rapidapi-host': currentHost,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error(`Flixbus API Error: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error(`[Flixbus API] Request failed for ${url}:`, error.message);
        throw error;
    }
};

const searchTrips = async (fromId, toId, date) => {
    return fetchFromFlixbus(`/search?currency=EUR&date=${date}&locale=en&children=0&adult=1&bikes=0&toCityId=${toId}&fromCityId=${fromId}`);
};

async function test() {
    // Delhi: a002c4a4-1eef-4afa-82d9-ecd690ea51c5
    // Dehradun: 52c74eb5-299b-4207-be30-1aad618958aa
    const date = '2026-08-07';
    console.log(`Searching Delhi -> Dehradun on ${date}`);
    try {
        const result = await searchTrips('a002c4a4-1eef-4afa-82d9-ecd690ea51c5', '52c74eb5-299b-4207-be30-1aad618958aa', date);
        const trips = result.trips || [];
        console.log(`Found ${trips.length} raw trips.`);
        
        // Print first 5 trips to inspect structure
        for (let i=0; i<Math.min(5, trips.length); i++) {
            const t = trips[i];
            console.log(`\nTrip ${i+1}:`);
            console.log(`ID: ${t.id}`);
            console.log(`Departure: ${t.departure?.time}, Arrival: ${t.arrival?.time}`);
            console.log(`Price: ${t.price?.total}`);
        }
    } catch (e) {
        console.error(e);
    }
}
test();
