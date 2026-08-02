import dotenv from 'dotenv';
dotenv.config();
import { flixbusApi } from './services/flixbusApiService.js';
import supabase from './config/supabase.js';

async function seedIndianCities() {
  const citiesToSeed = ["Delhi", "Manali", "Chandigarh", "Dehradun", "Rishikesh", "Jaipur"];
  
  for (const cityName of citiesToSeed) {
    try {
      const currentHost = process.env.RAPID_HOST_2 || 'flixbus-api2.p.rapidapi.com';
      const key = process.env.RAPIDAPI_KEY_2 || process.env.RAPIDAPI_KEY;
      
      const res = await fetch(`https://${currentHost}/autocomplete?query=${cityName}&lang=en`, {
         headers: { 'x-rapidapi-key': key, 'x-rapidapi-host': currentHost }
      });
      const data = await res.json();
      console.log(`Data for ${cityName}:`, data);
      
      const results = Array.isArray(data) ? data : data.results || data.items || data.locations || [];
      const city = results.find(item => item.name === cityName || item.name.includes(cityName));
      
      if (city) {
         await supabase.from('flixbus_cities').upsert({
           rapidapi_id: city.id || city.uuid,
           name: city.name,
           country: city.country,
           lat: city.location?.lat,
           lon: city.location?.lon
         }, { onConflict: 'rapidapi_id' });
         console.log(`Successfully seeded ${cityName} (${city.id || city.uuid})`);
      } else {
         console.log(`Could not find ${cityName}`);
      }
    } catch (e) {
      console.error(`Error fetching ${cityName}:`, e.message);
    }
  }
}
seedIndianCities();
