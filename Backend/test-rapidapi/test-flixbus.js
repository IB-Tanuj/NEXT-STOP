const API_KEY = 'f817651148msh728be16da7b7b61p1063e4jsn6d6496b45ea6';
const API_HOST = 'flixbus2.p.rapidapi.com';

const getOptions = (method = 'GET') => ({
  method,
  headers: {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': API_HOST,
    'Content-Type': 'application/json'
  }
});

// 1. Search Trips
async function searchTrips() {
  console.log('\n--- 1. Fetching Flixbus Trips ---');
  const url = 'https://flixbus2.p.rapidapi.com/trips?from_id=40de8044-8646-11e6-9066-549f350fcb0c&to_id=40dea87d-8646-11e6-9066-549f350fcb0c&date=15.08.2026&adult=1&search_by=cities&children=0&bikes=0&currency=EUR&locale=en';
  
  try {
    const res = await fetch(url, getOptions());
    console.log(`Status: ${res.status}`);
    const json = await res.json();
    
    if (json.journeys) {
      console.log(`\nFound ${json.journeys.length} journeys for this route:\n`);
      json.journeys.forEach((journey, i) => {
        const dep = new Date(journey.dep_offset).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const arr = new Date(journey.arr_offset).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        let priceStr = 'N/A';
        let infoStr = '';
        if (journey.fares && journey.fares.length > 0) {
          priceStr = `${journey.fares[0].price} ${journey.fares[0].currency}`;
          if (journey.fares[0].additional_info) {
            infoStr = ` (${journey.fares[0].additional_info})`;
          }
        }
        console.log(`${i + 1}. 🚌 ${dep} - ${arr} (Duration: ${journey.duration}) | Price: ${priceStr}${infoStr}`);
      });
    } else {
      console.log(JSON.stringify(json, null, 2));
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

// 2. Autocomplete
async function testAutocomplete() {
  console.log('\n--- 2. Testing Autocomplete (Query: ljubljana) ---');
  const url = 'https://flixbus2.p.rapidapi.com/autocomplete?query=ljubljana&locale=en';
  
  try {
    const res = await fetch(url, getOptions());
    console.log(`Status: ${res.status}`);
    const json = await res.json();
    console.log(JSON.stringify(json, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

// 3. Get Timetable
async function getTimetable() {
  console.log('\n--- 3. Fetching Timetable ---');
  const url = 'https://flixbus2.p.rapidapi.com/schedule?station_id=dcbd21fc-9603-11e6-9066-549f350fcb0c&date=18.11.2024';
  
  try {
    const res = await fetch(url, getOptions());
    console.log(`Status: ${res.status}`);
    const json = await res.json();
    console.log(JSON.stringify(json, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

// === RUN TESTS ===
// Uncomment the function(s) you want to test when your subscription is active!

searchTrips();
// testAutocomplete();
// getTimetable();
