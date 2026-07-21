import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('./Backend/.env') });

const key = process.env.RAPIDAPI_KEY;
const host = process.env.RAPIDAPI_HOST;

console.log("Host:", host);
console.log("Key defined:", !!key);

const headers = {
    "x-rapidapi-key": key,
    "x-rapidapi-host": host
};

const endpoints = [
    {
        name: "getPNRStatus",
        url: `https://${host}/getPNRStatus/8148735219`,
        params: {}
    },
    {
        name: "trainBetweenStations (v3)",
        url: `https://${host}/api/v3/trainBetweenStations`,
        params: { fromStationCode: 'NDLS', toStationCode: 'MAO', dateOfJourney: '2026-08-01' }
    },
    {
        name: "searchTrain (v1)",
        url: `https://${host}/api/v1/searchTrain`,
        params: { source: 'NDLS', destination: 'MAO', doj: '2026-08-01' }
    },
    {
        name: "trainsBetweenStations (v1)",
        url: `https://${host}/api/v1/trainsBetweenStations`,
        params: { fromStationCode: 'NDLS', toStationCode: 'MAO', dateOfJourney: '2026-08-01' }
    },
    {
        name: "getTrainsBetweenStations (v1)",
        url: `https://${host}/getTrainsBetweenStations`,
        params: { fromStationCode: 'NDLS', toStationCode: 'MAO', dateOfJourney: '2026-08-01' }
    },
    {
        name: "trains (v1)",
        url: `https://${host}/api/v1/trains`,
        params: { fromStationCode: 'NDLS', toStationCode: 'MAO', dateOfJourney: '2026-08-01' }
    }
];

async function testAll() {
    for (const ep of endpoints) {
        console.log(`\nTesting: ${ep.name}`);
        console.log(`URL: ${ep.url}`);
        console.log(`Params:`, ep.params);
        try {
            const res = await axios.get(ep.url, { headers, params: ep.params, timeout: 10000 });
            console.log(`Status: ${res.status}`);
            console.log(`Response keys:`, Object.keys(res.data));
            if (res.data) {
                // print snippet of data
                console.log(`Data snippet:`, JSON.stringify(res.data).substring(0, 400));
            }
        } catch (err) {
            console.log(`Error: ${err.message}`);
            if (err.response) {
                console.log(`Status: ${err.response.status}`);
                console.log(`Response data:`, JSON.stringify(err.response.data).substring(0, 400));
            }
        }
    }
}

testAll();
