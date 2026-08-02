import dotenv from 'dotenv';
dotenv.config();
import supabase from '../config/supabase.js';

async function seedIndianCities() {
  // Comprehensive list of FlixBus India destinations
  const citiesToSeed = [
    "Delhi", "Manali", "Chandigarh", "Dehradun", "Rishikesh", "Jaipur",
    "Agra", "Mathura", "Haridwar", "Ludhiana", "Jalandhar", "Amritsar", 
    "Pathankot", "Jammu", "Shimla", "Dharamshala", "Kanpur", "Lucknow", 
    "Varanasi", "Gorakhpur", "Ayodhya", "Prayagraj", "Jodhpur", "Udaipur", 
    "Ajmer", "Pushkar", "Bikaner", "Kota", "Indore", "Ujjain", "Bhopal",
    "Ambala", "Karnal", "Panipat", "Kurukshetra", "Rohtak", "Hisar",
    "Meerut", "Aligarh", "Moradabad", "Bareilly", "Noida", "Gurugram", "Faridabad", "Ghaziabad"
  ];
  
  let successCount = 0;
  
  console.log(`Starting to seed ${citiesToSeed.length} Indian cities...`);

  for (const cityName of citiesToSeed) {
    try {
      // Small delay to avoid aggressive rate limiting
      await new Promise(r => setTimeout(r, 500));
      
      const currentHost = process.env.RAPID_HOST_2 || 'flixbus-api2.p.rapidapi.com';
      const key = process.env.RAPIDAPI_KEY_2 || process.env.RAPIDAPI_KEY;
      
      const res = await fetch(`https://${currentHost}/autocomplete?query=${cityName}&lang=en`, {
         headers: { 'x-rapidapi-key': key, 'x-rapidapi-host': currentHost }
      });
      const data = await res.json();
      
      const results = Array.isArray(data) ? data : data.results || data.items || data.locations || [];
      const city = results.find(item => item.name.toLowerCase().includes(cityName.toLowerCase()) && item.country === 'in');
      
      if (city) {
         await supabase.from('flixbus_cities').upsert({
           rapidapi_id: city.id || city.uuid,
           name: city.name,
           country: city.country,
           lat: city.location?.lat,
           lon: city.location?.lon
         }, { onConflict: 'rapidapi_id' });
         console.log(`✅ Seeded: ${city.name}`);
         successCount++;
      } else {
         console.log(`❌ Not found / Not supported: ${cityName}`);
      }
    } catch (e) {
      console.error(`⚠️ Error fetching ${cityName}:`, e.message);
    }
  }
  
  console.log(`\nFinished! Successfully seeded ${successCount} Indian cities.`);
}
seedIndianCities();
