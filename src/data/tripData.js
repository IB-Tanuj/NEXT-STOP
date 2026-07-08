// ============================================
// NEXT STOP — Trip Data (Phase 1 — Delhi Only)
// All prices in INR, verified June 2024
// ============================================

export const transportCosts = {
  "delhi-goa": {
    bus: {
      options: [
        { type: "AC Sleeper (Delhi→Mumbai→Goa)", min: 2400, max: 2700, duration: "38-42hr", note: "2 leg journey via Mumbai" },
        { type: "Non-AC Sleeper (Delhi→Mumbai→Goa)", min: 1500, max: 1800, duration: "38-42hr", note: "Budget option via Mumbai" },
        { type: "AC Sleeper (Delhi→Pune→Goa)", min: 2000, max: 2300, duration: "38-42hr", note: "2 leg journey via Mumbai" },
      ],
      recommended: { min: 1700, max: 2800 }
    },
    train: {
      options: [
        { type: "General (Unreserved)", min: 400, max: 600, duration: "36-40hr", note: "No seat reservation, basic seating" },
        { type: "Sleeper Class (SL)", min: 750, max: 950, duration: "36-40hr", note: "Reaching berths, no AC" },
        { type: "3AC Economy (3E)", min: 1800, max: 2200, duration: "36-40hr", note: "3-tier berths, AC, reading lights" },
        { type: "3AC (3A)", min: 2000, max: 2500, duration: "36-40hr", note: "3-tier berths, AC, bedding included" },
        { type: "2AC (2A)", min: 2500, max: 3300, duration: "36-40hr", note: "2-tier berths, AC, curtains" },
        { type: "1AC (1A)", min: 4000, max: 5500, duration: "36-40hr", note: "Private cabins, premium bedding, meals" },
        { type: "Rajdhani Express (1A/2A/3A)", min: 5945, max: 6085, duration: "35-36hr", note: "All inclusive, meals + fare" },
      ],
      trains: [
        "Goa Sampark Kranti (12450): NDLS → Madgaon (31 hrs)",
        "Goa Express (12779): NDLS → Vasco (39 hrs)",
        "Nizamuddin Vasco Express (12707): NZM → Vasco (38 hrs)",
      ],
      recommended: { min: 750, max: 2500 }
    },
    flight: {
      options: [
        { type: "Economy Lite", min: 3500, max: 5000, duration: "2.5hr", note: "Basic seat, no meal, 15kg baggage" },
        { type: "Economy Value/Classic", min: 5000, max: 7000, duration: "2.5hr", note: "Seat + small meal, 15-20kg baggage" },
        { type: "Economy Flex", min: 7500, max: 13000, duration: "2.5hr", note: "Flexible booking, meal, 20kg baggage" },
        { type: "Premium Economy", min: 10000, max: 15000, duration: "2.5hr", note: "Extra legroom, meal, priority boarding" },
        { type: "Business Class", min: 12000, max: 20000, duration: "2.5hr", note: "Lay-flat seat, 25kg baggage, hot meals, lounge" },
      ],
      airlines: ["IndiGo", "Air India", "Air India Express", "SpiceJet", "GoFirst"],
      recommended: { min: 3500, max: 7000 }
    },
    personal: {
      note: "Personal vehicle — fuel cost depends on vehicle type and route",
      approxFuel: { min: 2000, max: 4000, note: "Delhi to Goa ~1900km, approx 8-10L/100km" }
    }
  },
  "delhi-manali": {
    bus: {
      options: [
        { type: "Non-AC Seater", min: 299, max: 700, duration: "12-15hr", note: "Direct to Manali" },
        { type: "Non-AC Sleeper", min: 499, max: 900, duration: "12-15hr", note: "Direct to Manali" },
        { type: "AC Sleeper", min: 700, max: 1500, duration: "11-14hr", note: "Direct to Manali" },
        { type: "Volvo/Semi-Sleeper AC", min: 900, max: 2000, duration: "11-13hr", note: "Direct to Manali" },
        { type: "Premium/Luxury Volvo", min: 1500, max: 5000, duration: "11-14hr", note: "Direct to Manali" },
      ],
      recommended: { min: 700, max: 2000 }
    },
    train: {
      note: "No direct train to Manali — trains go to nearest station, then bus/taxi to Manali",
      stations: {
        chandigarh: {
          label: "Chandigarh",
          duration: "3-4hr",
          options: [
            { type: "General", min: 110, max: 140 },
            { type: "Sleeper", min: 210, max: 250 },
            { type: "3AC", min: 550, max: 620 },
            { type: "2AC", min: 755, max: 825 },
            { type: "1AC", min: 1120, max: 1300 },
          ],
          transfer: {
            bus: [
              { type: "Non-AC Seater/Sleeper", min: 529, max: 700, duration: "6-8hr" },
              { type: "AC Sleeper", min: 615, max: 1000, duration: "6-8hr" },
              { type: "Volvo/Semi-Sleeper", min: 679, max: 1153, duration: "6-8hr" },
              { type: "Premium Volvo/Multi-Axie", min: 800, max: 1500, duration: "6-8hr" },
              { type: "Luxury/High-Comfort Coach", min: 1500, max: 5000, duration: "6-8hr" },
            ],
            taxi: [
              { type: "Taxi", min: 2500, max: 7000, duration: "6-7hr" },
            ],
          }
        },
        ambala: {
          label: "Ambala Cantt",
          duration: "3.4-5hr",
          options: [
            { type: "General", min: 120, max: 160 },
            { type: "Sleeper", min: 220, max: 300 },
            { type: "3AC", min: 600, max: 750 },
            { type: "2AC", min: 850, max: 1050 },
            { type: "1AC", min: 1300, max: 1600 },
          ],
          transfer: {
            bus: [
              { type: "Non-AC Seater/Sleeper", min: 347, max: 500, duration: "7-8hr" },
              { type: "AC Sleeper", min: 500, max: 1200, duration: "7-8hr" },
              { type: "Volvo/AC Seater", min: 1200, max: 2000, duration: "7-8hr" },
              { type: "Luxury/High-Comfort Coach", min: 2000, max: 5000, duration: "7-8hr" },
            ],
            taxi: [
              { type: "Taxi", min: 4400, max: 5300, duration: "6-7hr" },
            ],
          }
        },
        pathankot: {
          label: "Pathankot",
          duration: "6-8hr",
          options: [
            { type: "General", min: 180, max: 250 },
            { type: "Sleeper", min: 300, max: 450 },
            { type: "3AC", min: 800, max: 1100 },
            { type: "2AC", min: 1150, max: 1500 },
            { type: "1AC", min: 1800, max: 2400 },
          ],
          transfer: {
            bus: [
              { type: "Non-AC Seater/Sleeper", min: 720, max: 805, duration: "8-11hr" },
              { type: "AC Sleeper", min: 1099, max: 1483, duration: "8-11hr" },
              { type: "Volvo/AC Seater", min: 1483, max: 1483, duration: "8-11hr" },
              { type: "Luxury/High-Comfort Coach", min: 2500, max: 6000, duration: "8-11hr" },
            ],
            taxi: null,
          }
        },
      },
      recommended: { min: 210, max: 750 }
    },
    flight: {
      note: "All flights go to Kullu Manali Airport (KUU)",
      options: [
        { type: "Economy", min: 4700, max: 9000, duration: "1h30m-1h50m" },
        { type: "Premium Economy", min: 8500, max: 12500, duration: "1h30m-1h50m" },
        { type: "Business", min: 12500, max: 22000, duration: "1h30m-1h50m" },
        { type: "First Class", min: 22000, max: 35000, duration: "1h30m-1h50m" },
      ],
      transfer: {
        cab: { min: 1400, max: 2000, duration: "40min-1hr" },
        selfDrive: { min: 500, max: 750, duration: "40min-1hr" },
        suvPremiumCab: { min: 4000, max: 7000, duration: "40min-1hr" },
      },
      recommended: { min: 4700, max: 9000 }
    },
    personal: {
      note: "Delhi to Manali ~550km via NH44, scenic Himalayan route",
      approxFuel: { min: 1500, max: 2500, note: "Depends on vehicle type" }
    }
  },
  "delhi-kerala": {
    bus: { recommended: { min: 1500, max: 3000 }, note: "Not recommended — very long, 40-48hrs" },
    train: { recommended: { min: 1000, max: 2500 }, note: "Kerala Express, 36-44hrs" },
    flight: { recommended: { min: 3500, max: 9000 }, note: "Kochi/Trivandrum airport, 3-4hrs" },
    personal: { approxFuel: { min: 5000, max: 8000, note: "Delhi to Kerala ~2800km" } }
  },
  "delhi-rajasthan": {
    bus: { recommended: { min: 400, max: 800 }, note: "Frequent buses, 5-8hrs" },
    train: { recommended: { min: 200, max: 600 }, note: "Pink City Express, 4-6hrs" },
    flight: { recommended: { min: 2000, max: 5000 }, note: "Jaipur airport, 1-1.5hrs" },
    personal: { approxFuel: { min: 500, max: 1000, note: "Delhi to Jaipur ~280km" } }
  },
}

export const stayCosts = {
  goa: {
    hostel: { min: 400, max: 800, avg: 500, note: "Dorm beds, budget range ₹400-800" },
    budget: { min: 800, max: 1800, avg: 1100, note: "Budget hotels ₹1100-2500 average" },
    mid: { min: 2000, max: 4500, avg: 2500, note: "Mid-range hotels ₹2500-4500" },
    premium: { min: 4000, max: 6000, avg: 5000, note: "Premium hotels ₹5000-9000" },
    luxury: { min: 7000, max: 12000, avg: 9000, note: "Luxury resorts ₹9000-25000" },
  },
  manali: {
    hostel: { min: 300, max: 600, avg: 400, note: "Backpacker hostels in Old Manali" },
    budget: { min: 800, max: 1500, avg: 1000, note: "Guesthouses with mountain views" },
    mid: { min: 2000, max: 4000, avg: 2500, note: "Comfortable hotels with heating" },
    premium: { min: 4000, max: 7000, avg: 5000, note: "Premium hotels with valley views" },
    luxury: { min: 7000, max: 12000, avg: 9000, note: "Luxury resorts" },
  },
  kerala: {
    hostel: { min: 350, max: 700, avg: 450, note: "Backpacker hostels in Kochi/Varkala" },
    budget: { min: 900, max: 1800, avg: 1200, note: "Clean guesthouses" },
    mid: { min: 2200, max: 4500, avg: 3000, note: "Heritage hotels and resorts" },
    premium: { min: 4500, max: 8000, avg: 6000, note: "Premium heritage hotels" },
    luxury: { min: 8000, max: 14000, avg: 10000, note: "Houseboat stays and beach resorts" },
  },
  rajasthan: {
    hostel: { min: 300, max: 600, avg: 400, note: "Backpacker hostels in Jaipur/Jodhpur" },
    budget: { min: 700, max: 1500, avg: 900, note: "Heritage guesthouses" },
    mid: { min: 1800, max: 4000, avg: 2500, note: "Heritage havelis and hotels" },
    premium: { min: 4000, max: 7000, avg: 5000, note: "Premium heritage hotels" },
    luxury: { min: 7000, max: 12000, avg: 9000, note: "Palace hotels" },
  },
}

export const foodCosts = {
  goa: {
    local: { min: 150, max: 300, avg: 200, note: "Goan thali, seafood shacks" },
    mix: { min: 400, max: 700, avg: 500, note: "Mix of local and cafes" },
    restaurant: { min: 800, max: 1500, avg: 1000, note: "Beach restaurants, continental" },
    hotel_meals: { min: 1200, max: 2500, avg: 1800, note: "All inclusive hotel dining" },
  },
  manali: {
    local: { min: 120, max: 250, avg: 180, note: "Himachali daal, local dhabas" },
    mix: { min: 350, max: 600, avg: 450, note: "Mix of local and cafes" },
    restaurant: { min: 700, max: 1200, avg: 900, note: "Mall Road restaurants" },
    hotel_meals: { min: 1000, max: 2000, avg: 1400, note: "Hotel dining" },
  },
  kerala: {
    local: { min: 100, max: 200, avg: 150, note: "Kerala sadya, local meals" },
    mix: { min: 300, max: 550, avg: 400, note: "Mix of local and restaurants" },
    restaurant: { min: 600, max: 1200, avg: 800, note: "Seafood restaurants" },
    hotel_meals: { min: 1000, max: 2000, avg: 1400, note: "Hotel and resort dining" },
  },
  rajasthan: {
    local: { min: 100, max: 200, avg: 150, note: "Dal baati churma, local thali" },
    mix: { min: 300, max: 550, avg: 400, note: "Mix of local and restaurants" },
    restaurant: { min: 600, max: 1200, avg: 800, note: "Rooftop restaurants" },
    hotel_meals: { min: 900, max: 1800, avg: 1200, note: "Heritage hotel dining" },
  },
}

export const entryCosts = {
  goa: {
    "Baga Beach": { cost: 0, note: "Free entry" },
    "Dudhsagar Falls": { cost: 400, note: "Includes jeep safari" },
    "Old Goa Churches": { cost: 0, note: "Free entry" },
    "Anjuna Beach": { cost: 0, note: "Free entry" },
    "Fort Aguada": { cost: 25, note: "Nominal entry fee" },
    "Palolem Beach": { cost: 0, note: "Free entry" },
    "Calangute Beach": { cost: 0, note: "Free entry" },
  },
  manali: {
    "Rohtang Pass": { cost: 600, note: "Permit required, book in advance" },
    "Solang Valley": { cost: 0, note: "Free, activities cost extra ₹500-2000" },
    "Hadimba Temple": { cost: 0, note: "Free entry, donations welcome" },
    "Beas River": { cost: 0, note: "Free, rafting ₹600-1200 extra" },
    "Mall Road": { cost: 0, note: "Free, shopping area" },
    "Naggar Castle": { cost: 50, note: "Small entry fee" },
    "Jogini Falls": { cost: 0, note: "Free, 2km trek from Manali" },
  },
  kerala: {
    "Alleppey Backwaters": { cost: 6000, note: "Houseboat per night, can share" },
    "Munnar Tea Gardens": { cost: 75, note: "Tea museum entry" },
    "Kovalam Beach": { cost: 0, note: "Free entry" },
    "Wayanad Wildlife": { cost: 300, note: "Safari extra ₹500-1000" },
    "Thekkady Periyar": { cost: 200, note: "Boat ride extra ₹150" },
    "Varkala Beach": { cost: 0, note: "Free entry" },
    "Thrissur Pooram": { cost: 0, note: "Free, seasonal festival" },
    "Bekal Fort": { cost: 25, note: "Nominal entry fee" },
    "Athirappilly Falls": { cost: 30, note: "Nominal entry fee" },
    "Kannur Beach": { cost: 0, note: "Free entry" },
    "Padmanabhaswamy Temple": { cost: 0, note: "Free, dress code required" },
  },
  rajasthan: {
    "Jaipur City Palace": { cost: 200, note: "Camera fee extra ₹100" },
    "Jaisalmer Fort": { cost: 100, note: "Free to roam inside" },
    "Udaipur Lake Palace": { cost: 0, note: "Hotel, visit by boat ₹500" },
    "Sam Sand Dunes": { cost: 0, note: "Free, camel ride ₹300-500 extra" },
    "Mehrangarh Fort": { cost: 100, note: "Audio guide extra ₹100" },
    "Pushkar Lake": { cost: 0, note: "Free, donations at ghats" },
    "Amber Fort": { cost: 200, note: "Elephant ride extra ₹900" },
    "Ranthambore Tiger Reserve": { cost: 1500, note: "Safari, book in advance" },
    "Hawa Mahal": { cost: 50, note: "Nominal entry fee" },
    "Mount Abu": { cost: 0, note: "Free town, Dilwara temple free" },
    "Chittorgarh Fort": { cost: 100, note: "Large fort, full day needed" },
  },
}

export const miscCosts = {
  goa: 300,
  manali: 250,
  kerala: 200,
  rajasthan: 250,
}