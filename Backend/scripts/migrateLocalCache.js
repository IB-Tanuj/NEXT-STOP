import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { AsyncCache } from '../utils/cache.js';

const locationCache = new AsyncCache('cache_hotels');
const LOCATION_TTL = 10 * 365 * 24 * 60 * 60 * 1000; // 10 years

async function migrateLocations() {
    const filePath = path.join(__dirname, '..', 'data', 'hotel_locations.json');
    if (fs.existsSync(filePath)) {
        console.log(`Found ${filePath}, migrating to Supabase...`);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        let count = 0;
        for (const [destination, locationId] of Object.entries(data)) {
            const cacheKey = `loc:${destination.trim().toLowerCase()}`;
            await locationCache.set(cacheKey, locationId, LOCATION_TTL);
            console.log(`Migrated: ${destination} -> ${locationId}`);
            count++;
        }
        console.log(`Migrated ${count} hotel locations to Supabase!`);
    } else {
        console.log("No hotel_locations.json found to migrate.");
    }
}

migrateLocations().then(() => {
    console.log("Migration script finished.");
    process.exit(0);
}).catch(console.error);
