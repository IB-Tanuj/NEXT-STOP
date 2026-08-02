import dotenv from "dotenv";
dotenv.config();
import supabase from "../config/supabase.js";

const API_KEY = process.env.RAPIDAPI_FLIXBUS_KEY_1 || 'f817651148msh728be16da7b7b61p1063e4jsn6d6496b45ea6';
const API_HOST = 'flixbus-api2.p.rapidapi.com';

async function seedCities() {
  console.log("Fetching cities from RapidAPI...");
  try {
    const res = await fetch(`https://${API_HOST}/cities?language=en-gl&offset=0&limit=50`, {
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST
      }
    });
    
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    
    const data = await res.json();
    const cities = data.cities || [];
    
    console.log(`Fetched ${cities.length} cities. Inserting into Supabase...`);
    
    const formattedCities = cities.map(city => ({
      rapidapi_id: city.uuid || city.id,
      name: city.name,
      country: city.country,
      lat: city.location?.lat,
      lon: city.location?.lon,
      is_supported: true
    }));

    // Upsert to handle duplicates safely
    const { error } = await supabase
      .from('flixbus_cities')
      .upsert(formattedCities, { onConflict: 'rapidapi_id' });

    if (error) {
      console.error("Error inserting cities:", error);
    } else {
      console.log("Successfully seeded cities!");
    }

  } catch (error) {
    console.error("Script failed:", error.message);
  }
}

seedCities();
