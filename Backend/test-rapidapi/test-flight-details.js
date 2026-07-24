import axios from 'axios';

async function testBookingDetails() {
  const searchOptions = {
    method: 'GET',
    url: 'https://google-flights2.p.rapidapi.com/api/v1/searchFlights',
    params: {
        departure_id: 'DEL',
        arrival_id: 'BOM',
        outbound_date: '2026-08-15',
        currency: 'INR',
        travel_class: 'ECONOMY'
    },
    headers: {
      'x-rapidapi-key': 'f817651148msh728be16da7b7b61p1063e4jsn6d6496b45ea6',
      'x-rapidapi-host': 'google-flights2.p.rapidapi.com'
    }
  };

  try {
    console.log("1️⃣ Fetching flight to get a booking_token...");
    const searchRes = await axios.request(searchOptions);
    
    // Attempt to grab the first flight's booking token
    const firstFlight = searchRes.data?.data?.itineraries?.topFlights?.[0] || searchRes.data?.data?.itineraries?.otherFlights?.[0];
    
    if (!firstFlight || !firstFlight.booking_token) {
        console.error("❌ Could not find a booking_token in the search results!");
        return;
    }

    const bookingToken = firstFlight.booking_token;
    console.log(`✅ Got Booking Token (length: ${bookingToken.length})`);
    
    console.log("\n2️⃣ Fetching booking details for this token...");
    
    const detailsOptions = {
        method: 'GET',
        url: 'https://google-flights2.p.rapidapi.com/api/v1/getBookingDetails',
        params: {
            booking_token: bookingToken, // Assume this is the correct param name based on standard patterns
            currency: 'INR',
            country_code: 'IN',
            language_code: 'en-US'
        },
        headers: {
          'x-rapidapi-key': 'f817651148msh728be16da7b7b61p1063e4jsn6d6496b45ea6',
          'x-rapidapi-host': 'google-flights2.p.rapidapi.com'
        }
    };

    const detailsRes = await axios.request(detailsOptions);
    console.log("✅ SUCCESS! Status:", detailsRes.status);
    console.log("\n--- BOOKING DETAILS RESPONSE PREVIEW ---");
    console.log(JSON.stringify(detailsRes.data, null, 2).substring(0, 3000));

  } catch (error) {
    console.error("❌ Failed!");
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error("Data:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
  }
}

testBookingDetails();
