import axios from 'axios';
import { getAirportByDestination, getAirportByCode, searchAirports as searchAirportsUtil } from '../utils/destinationAirports.js';
import { searchAndFetchMultiple } from '../services/tinyfishService.js';
import { generateFlightSearchQuery, cleanWebDataWithKey } from '../services/queryRouterService.js';
import { runWithKeyRotation } from '../utils/rapidApiKeyManager.js';

import { AsyncCache } from '../utils/cache.js';

// Global cache and request deduplication
const flightCache = new AsyncCache('cache_flights');
const pendingFlightRequests = new Map();
const CACHE_TTL = 3 * 60 * 60 * 1000; // 3 hours

/**
 * GET /api/flights/search
 * Query parameters: ?from=DEL&to=GOI or ?from=DEL&destination=goa&date=2026-08-15
 */
export const searchFlights = async (req, res) => {
  try {
    const { from, to, destination, date } = req.query;

    let fromCode = from ? from.trim().toUpperCase() : "DEL";
    let toCode = to ? to.trim().toUpperCase() : null;
    let destInfo = null;

    // Resolve destination if 'to' is not provided directly as IATA code
    if (!toCode && destination) {
      destInfo = getAirportByDestination(destination);
      if (destInfo) {
        toCode = destInfo.code;
      } else {
        return res.status(400).json({
          error: `Unknown destination: "${destination}". Please specify an airport IATA code (e.g. GOI, BOM, BLR).`
        });
      }
    }

    if (!fromCode || !toCode) {
      return res.status(400).json({
        error: "Missing required parameters. Use: ?from=DEL&to=GOI or ?from=DEL&destination=goa"
      });
    }

    const cacheKey = `${fromCode}_${toCode}_${date || 'default'}`;

    // Check cache
    const cached = await flightCache.get(cacheKey);
    if (cached) {
      console.log(`✈️ [Cache Hit] Serving flights: ${fromCode} → ${toCode}`);
      return res.json(cached);
    }

    // Deduplicate pending requests
    if (pendingFlightRequests.has(cacheKey)) {
      console.log(`✈️ [Cache Pending] Waiting for pending flight request: ${cacheKey}`);
      const data = await pendingFlightRequests.get(cacheKey);
      return res.json(data);
    }

    console.log(`✈️ Searching flights: ${fromCode} → ${toCode}`);

    const fetchPromise = (async () => {
      let apiData = null;
      let usedMethod = "dynamic_estimate";
      let flightOptions = [];

      const originAirport = getAirportByCode(fromCode) || { code: fromCode, name: `${fromCode} Airport`, city: fromCode };
      const destAirport = getAirportByCode(toCode) || { code: toCode, name: `${toCode} Airport`, city: toCode };

      // Method 1: Attempt RapidAPI lookup if RAPIDAPI_FLIGHT_HOST is set (e.g. google-flights2)
      const rapidHost = process.env.RAPIDAPI_FLIGHT_HOST;
      const rapidKey = process.env.RAPIDAPI_KEY;

      if (rapidHost && rapidKey) {
        try {
          const outDate = date || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
          const options = {
            method: 'GET',
            url: `https://${rapidHost}/api/v1/searchFlights`,
            params: {
              departure_id: fromCode,
              arrival_id: toCode,
              outbound_date: outDate,
              currency: 'INR',
              travel_class: 'ECONOMY'
            },
            headers: {
              'x-rapidapi-key': rapidKey,
              'x-rapidapi-host': rapidHost
            },
            timeout: 10000
          };
          const apiRes = await runWithKeyRotation(rapidHost, async (apiKey) => {
            options.headers['x-rapidapi-key'] = apiKey;
            return await axios.request(options);
          });
          
          const firstFlight = apiRes.data?.data?.itineraries?.topFlights?.[0] || apiRes.data?.data?.itineraries?.otherFlights?.[0];
          
          if (firstFlight && firstFlight.price) {
            apiData = apiRes.data;
            const basePrice = firstFlight.price;
            const airline = firstFlight.flights?.[0]?.airline || "Flight";
            const duration = firstFlight.duration?.text || "2 hr";
            
            flightOptions = [
              {
                type: "Economy Class",
                price: basePrice,
                cabinBaggage: "7 kg",
                checkInBaggage: "15 kg",
                duration: duration,
                note: "Cabin: 7kg | Check-in: 15kg | Paid Meals"
              },
              {
                type: "Premium Economy",
                price: Math.round(basePrice * 1.4),
                cabinBaggage: "7 kg",
                checkInBaggage: "15 kg",
                duration: duration,
                note: "Cabin: 7kg | Check-in: 15kg | Extra Legroom"
              },
              {
                type: "Business Class",
                price: Math.round(basePrice * 2.8),
                cabinBaggage: "12 kg",
                checkInBaggage: "35 kg",
                duration: duration,
                note: "Cabin: 12kg | Check-in: 35kg | Lounge & Meals"
              }
            ];
            usedMethod = "rapidapi";
          }
        } catch (apiErr) {
          console.warn("RapidAPI flight lookup failed/unconfigured, trying TinyFish real-time search:", apiErr.message);
        }
      }

      // Method 2: Real-time search via TinyFish + Groq (if RapidAPI didn't run)
      if (usedMethod !== "rapidapi") {
        try {
          const searchQuery = generateFlightSearchQuery(fromCode, toCode);
          const { text } = await searchAndFetchMultiple(searchQuery);

          const schema = {
            flights: [
              { airline: "", flightNumber: "", departureTime: "", arrivalTime: "", price: 0, cabinBaggage: "", checkInBaggage: "", duration: "" }
            ]
          };

          const apiKey = process.env.GROQ_FLIGHT_CLEANING_KEY || process.env.GROQ_PROMPT_CLEANING_KEY || process.env.GROQ_API_KEY;
          const result = await cleanWebDataWithKey(
            text,
            schema,
            `Extract up to 5 real-time flight options from ${fromCode} to ${toCode} from the text. Provide airline name (e.g. IndiGo, Air India, Akasa Air, Vistara), flight duration, and ticket price in INR (number only). Extract ONLY real flight schedules.`,
            apiKey
          );

          if (Array.isArray(result?.flights) && result.flights.length > 0) {
            flightOptions = result.flights.slice(0, 5).map(f => ({
              type: f.airline ? `${f.airline} (Direct/Connecting)` : "Economy Class",
              price: typeof f.price === 'number' ? f.price : parseInt(String(f.price).replace(/[^0-9]/g, '')) || 3500,
              cabinBaggage: f.cabinBaggage || "7 kg",
              checkInBaggage: f.checkInBaggage || "15 kg",
              duration: f.duration || "2h 15m",
              note: f.departureTime ? `Departs ${f.departureTime}` : "Real-time live fare"
            }));
            usedMethod = "tinyfish_realtime";
          }
        } catch (tfErr) {
          console.warn("TinyFish real-time flight search failed, using distance estimator:", tfErr.message);
        }
      }

      // Method 3: Dynamic Estimator Fallback (if real-time methods found no items)
      if (flightOptions.length === 0 && usedMethod !== "rapidapi") {
        const isShortHaul = ["DEL-IXC", "BOM-PNQ", "COK-TRV"].includes(`${fromCode}-${toCode}`);
        const isLongHaul = ["DEL-COK", "BOM-CCU", "DEL-BLR"].includes(`${fromCode}-${toCode}`);

        const basePrice = isShortHaul ? 2200 : isLongHaul ? 4800 : 3400;

        flightOptions = [
          {
            type: "Economy Lite",
            price: Math.round(basePrice * 0.9),
            cabinBaggage: "7 kg",
            checkInBaggage: "15 kg",
            duration: isShortHaul ? "1h 15m" : isLongHaul ? "2h 45m" : "2h 00m",
            note: "Includes cabin & check-in baggage"
          },
          {
            type: "Economy Standard",
            price: Math.round(basePrice * 1.15),
            cabinBaggage: "7 kg",
            checkInBaggage: "15 kg + Free Seat Selection",
            duration: isShortHaul ? "1h 15m" : isLongHaul ? "2h 45m" : "2h 00m",
            note: "Free seat selection & meal option"
          },
          {
            type: "Business Class",
            price: Math.round(basePrice * 2.8),
            cabinBaggage: "12 kg",
            checkInBaggage: "35 kg + Priority Check-in",
            duration: isShortHaul ? "1h 10m" : isLongHaul ? "2h 35m" : "1h 50m",
            note: "Priority boarding, lounge access & full meal"
          }
        ];
      }

      const responseData = {
        from: fromCode,
        originAirport,
        to: toCode,
        destAirport,
        destinationName: destination || destAirport.city,
        transferNote: destInfo?.transferNote || null,
        searchMethod: usedMethod,
        apiData,
        options: flightOptions,
        fetchedAt: new Date().toISOString()
      };

      // Background cache set (fire and forget)
      flightCache.set(cacheKey, responseData, CACHE_TTL);

      return responseData;
    })();

    pendingFlightRequests.set(cacheKey, fetchPromise);

    try {
      const responseData = await fetchPromise;
      res.json(responseData);
    } finally {
      pendingFlightRequests.delete(cacheKey);
    }

  } catch (error) {
    console.error("Error searching flights:", error.message);
    res.status(500).json({
      error: "Failed to search flights.",
      details: error.message
    });
  }
};

/**
 * GET /api/flights/airports?query=delhi
 */
export const listAirports = async (req, res) => {
  try {
    const { query } = req.query;
    const results = searchAirportsUtil(query);
    res.json({
      total: results.length,
      airports: results
    });
  } catch (error) {
    console.error("Error listing airports:", error.message);
    res.status(500).json({ error: "Failed to list airports." });
  }
};
