import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { bestTimeData } from '../src/data/bestTime.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from Backend/.env
dotenv.config({ path: path.join(__dirname, '../Backend/.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in Backend/.env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateData() {
  console.log("Starting migration of best_time_to_visit data...");
  
  const entries = Object.entries(bestTimeData);
  let successCount = 0;
  let errorCount = 0;

  for (const [location, data] of entries) {
    const row = {
      location,
      best: data.best || '',
      avoid: data.avoid || '',
      current: data.current || '',
      summary: data.summary || '',
      months: data.months || [],
      tips: data.tips || []
    };

    const { error } = await supabase
      .from('best_time_to_visit')
      .upsert(row, { onConflict: 'location' });

    if (error) {
      console.error(`Error inserting ${location}:`, error.message);
      errorCount++;
    } else {
      console.log(`Successfully migrated ${location}`);
      successCount++;
    }
  }

  console.log(`\nMigration completed.`);
  console.log(`Successful: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
}

migrateData().catch(console.error);
