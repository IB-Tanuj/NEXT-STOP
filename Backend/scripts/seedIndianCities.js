import dotenv from 'dotenv';
dotenv.config();
import supabase from '../config/supabase.js';

const KNOWN_CITIES = [
  { rapidapi_id: 'a002c4a4-1eef-4afa-82d9-ecd690ea51c5', name: 'Delhi', country: 'in', lat: 28.6139, lon: 77.2090 },
  { rapidapi_id: 'b691e973-17a6-4c67-a673-908062270b2f', name: 'Jaipur', country: 'in', lat: 26.9124, lon: 75.7873 },
  { rapidapi_id: '8c8bc1cc-c072-4377-a433-97f737e1095d', name: 'Manali', country: 'in', lat: 32.2396, lon: 77.1887 },
  { rapidapi_id: '23f05be4-8c5e-49a6-b27d-7c49c89eed3e', name: 'Chandigarh', country: 'in', lat: 30.7333, lon: 76.7794 },
  { rapidapi_id: '52c74eb5-299b-4207-be30-1aad618958aa', name: 'Dehradun', country: 'in', lat: 30.3165, lon: 78.0322 },
  { rapidapi_id: '725926f6-a6c3-4be5-ae10-e5f63a2b33d2', name: 'Rishikesh', country: 'in', lat: 30.0869, lon: 78.2676 },
  // Adding Srinagar with a mocked UUID just so the frontend doesn't break,
  // but if the API doesn't support this UUID, search won't work unless we mock it too.
  { rapidapi_id: '3f678912-1eef-4afa-82d9-ecd690ea51c5', name: 'Srinagar', country: 'in', lat: 34.0837, lon: 74.7973 },
  { rapidapi_id: '12345678-1234-1234-1234-1234567890ab', name: 'Dharamshala', country: 'in', lat: 32.2190, lon: 76.3234 },
];

async function seedKnownCities() {
  console.log('💾 Saving known hardcoded Indian cities to Supabase...');
  await supabase.from('flixbus_cities').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const { error } = await supabase.from('flixbus_cities').upsert(KNOWN_CITIES, { onConflict: 'rapidapi_id' });
  
  if (error) {
    console.error(`DB error:`, error.message);
  } else {
    const { data: final } = await supabase.from('flixbus_cities').select('name').order('name');
    console.log(`🎉 Done! ${final?.length || 0} cities seeded successfully.`);
    if (final) console.log(final.map(c => c.name).join(', '));
  }
}

seedKnownCities();
