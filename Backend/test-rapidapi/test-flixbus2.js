const API_KEY = 'f817651148msh728be16da7b7b61p1063e4jsn6d6496b45ea6';
const API_HOST = 'flixbus-api2.p.rapidapi.com';

const getOptions = () => ({
  method: 'GET',
  headers: {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': API_HOST,
    'Content-Type': 'application/json'
  }
});

async function runTest(name, url) {
  console.log(`\n==================================================`);
  console.log(`Testing: ${name}`);
  console.log(`URL: ${url}`);
  try {
    const res = await fetch(url, getOptions());
    console.log(`Status: ${res.status}`);
    const data = await res.json();
    
    // Check if it's an array or object to summarize
    if (Array.isArray(data)) {
        console.log(`Returned Array of length: ${data.length}`);
        if (data.length > 0) {
            console.log(`First item keys:`, Object.keys(data[0]).join(', '));
            console.log(`First item sample:`, JSON.stringify(data[0], null, 2).slice(0, 300) + '...');
        }
    } else {
        console.log(`Returned Object with keys:`, Object.keys(data).join(', '));
        
        // Custom summarization for complex objects like /search
        if (data.items) {
             console.log(`- Contains ${data.items.length} items (trips/results)`);
             if (data.items.length > 0) {
                 console.log(`- First item snippet:`, JSON.stringify(data.items[0], null, 2).slice(0, 300) + '...');
             }
        }
        if (data.cities) {
             console.log(`- Contains ${data.cities.length} cities`);
        }
        
        // If it's a small object, log it, else don't spam
        if(Object.keys(data).length <= 5 && !data.items && !data.cities) {
             console.log(JSON.stringify(data, null, 2).slice(0, 500) + '...');
        }
    }
  } catch (error) {
    console.error(`Error fetching ${name}:`, error.message);
  }
}

async function runAllTests() {
  const tests = [
    {
      name: '1. Search Trips',
      url: 'https://flixbus-api2.p.rapidapi.com/search?currency=EUR&date=2026-08-01&locale=en&children=0&adult=1&bikes=0&toCityId=40de8964-8646-11e6-9066-549f350fcb0c&returnDate=2026-08-10&fromCityId=40d8f682-8646-11e6-9066-549f350fcb0c'
    },
    {
      name: '2. Autocomplete',
      url: 'https://flixbus-api2.p.rapidapi.com/autocomplete?country=DE&stations=true&query=Berlin&lang=en&flixbusOnly=false'
    },
    {
      name: '3. List Cities',
      url: 'https://flixbus-api2.p.rapidapi.com/cities?language=en-gl&offset=0&limit=20'
    },
    {
      name: '4. Get City By ID',
      url: 'https://flixbus-api2.p.rapidapi.com/cities/40de8964-8646-11e6-9066-549f350fcb0c?language=en-gl'
    },
    {
      name: '5. Get Reachable Cities',
      url: 'https://flixbus-api2.p.rapidapi.com/cities/40d8f682-8646-11e6-9066-549f350fcb0c/reachable?language=en-gl&limit=20'
    },
    {
      name: '6. Get Timetable',
      url: 'https://flixbus-api2.p.rapidapi.com/timetable?cityId=40d8f682-8646-11e6-9066-549f350fcb0c&date=2026-08-01'
    }
  ];

  for (const test of tests) {
    await runTest(test.name, test.url);
  }
  
  console.log('\n==================================================');
  console.log('ALL TESTS COMPLETED');
}

runAllTests();
