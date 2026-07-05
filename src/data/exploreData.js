export const exploreCategories = [
  {
    id: "bike-trips",
    emoji: "🏍️",
    label: "Best Bike Trips",
    description: "Epic motorcycle routes across India",
    locations: [
      { name: "Manali to Leh", state: "Himachal Pradesh / Ladakh", desc: "The most iconic bike route in India — 479km of Himalayan highway", tags: ["Adventure", "Mountains"], available: false },
      { name: "Spiti Valley Circuit", state: "Himachal Pradesh", desc: "High altitude desert roads through ancient Buddhist villages", tags: ["Offbeat", "Mountains"], available: false },
      { name: "Coorg to Ooty", state: "Karnataka / Tamil Nadu", desc: "Lush coffee plantations and misty hill roads", tags: ["Scenic", "Hills"], available: false },
      { name: "Rajasthan Royal Route", state: "Rajasthan", desc: "Desert highways connecting forts and palaces", tags: ["Culture", "Desert"], available: true, locationKey: "rajasthan" },
    ]
  },
  {
    id: "mountain-hidden",
    emoji: "🏔️",
    label: "Hidden Mountain Destinations",
    description: "Lesser known peaks and valleys away from crowds",
    locations: [
      { name: "Chopta", state: "Uttarakhand", desc: "Mini Switzerland of India — meadows and Tungnath temple trek", tags: ["Trekking", "Spiritual"], available: false },
      { name: "Munsiyari", state: "Uttarakhand", desc: "Gateway to Milam Glacier with stunning Panchachuli views", tags: ["Offbeat", "Trekking"], available: false },
      { name: "Spiti Valley", state: "Himachal Pradesh", desc: "Cold desert with monasteries at 12,500 feet", tags: ["Adventure", "Culture"], available: false },
      { name: "Manali", state: "Himachal Pradesh", desc: "Snow peaks, adventure sports and Himalayan culture", tags: ["Mountains", "Adventure"], available: true, locationKey: "manali" },
    ]
  },
  {
    id: "railway-journeys",
    emoji: "🚂",
    label: "Scenic Railway Journeys",
    description: "Train routes that are destinations in themselves",
    locations: [
      { name: "Darjeeling Toy Train", state: "West Bengal", desc: "UNESCO heritage narrow gauge railway through tea gardens", tags: ["Heritage", "Scenic"], available: false },
      { name: "Konkan Railway", state: "Maharashtra / Goa / Karnataka", desc: "91 tunnels, 2000 bridges through Western Ghats coastline", tags: ["Scenic", "Coastal"], available: false },
      { name: "Kalka Shimla Railway", state: "Himachal Pradesh", desc: "107km mountain railway with 102 tunnels", tags: ["Heritage", "Mountains"], available: false },
      { name: "Palace on Wheels", state: "Rajasthan", desc: "Luxury train through royal Rajasthan destinations", tags: ["Luxury", "Culture"], available: true, locationKey: "rajasthan" },
    ]
  },
  {
    id: "weekend-getaways",
    emoji: "🏕️",
    label: "Weekend Getaways",
    description: "Perfect 2-3 day escapes from major cities",
    locations: [
      { name: "Rishikesh", state: "Uttarakhand", desc: "Yoga capital with river rafting and Ganga Aarti", tags: ["Adventure", "Spiritual"], available: false },
      { name: "Coorg", state: "Karnataka", desc: "Coffee country with waterfalls and misty hills", tags: ["Nature", "Hills"], available: false },
      { name: "Pushkar", state: "Rajasthan", desc: "Sacred lake town with camel fair and desert vibes", tags: ["Culture", "Spiritual"], available: true, locationKey: "rajasthan" },
      { name: "Munnar", state: "Kerala", desc: "Tea garden paradise with cool climate and wildlife", tags: ["Nature", "Hills"], available: true, locationKey: "kerala" },
    ]
  },
  {
    id: "budget-trips",
    emoji: "💰",
    label: "Trips Under ₹5000",
    description: "Complete trips that won't break the bank",
    locations: [
      { name: "Pondicherry", state: "Tamil Nadu", desc: "French quarter, beaches and ashrams — incredibly affordable", tags: ["Budget", "Beach"], available: false },
      { name: "Hampi", state: "Karnataka", desc: "UNESCO ruins with cheap stays and magical landscapes", tags: ["Budget", "Heritage"], available: false },
      { name: "Manali", state: "Himachal Pradesh", desc: "Budget hostels, free treks and stunning scenery", tags: ["Budget", "Mountains"], available: true, locationKey: "manali" },
      { name: "Goa (off-season)", state: "Goa", desc: "Cheap stays, empty beaches and great food in monsoon", tags: ["Budget", "Beach"], available: true, locationKey: "goa" },
    ]
  },
  {
    id: "monsoon",
    emoji: "🌧️",
    label: "Best Monsoon Destinations",
    description: "Places that come alive in the rain",
    locations: [
      { name: "Coorg", state: "Karnataka", desc: "Waterfalls at peak, coffee estates lush green", tags: ["Nature", "Hills"], available: false },
      { name: "Kerala Backwaters", state: "Kerala", desc: "Monsoon Ayurveda and misty backwater cruises", tags: ["Wellness", "Nature"], available: true, locationKey: "kerala" },
      { name: "Cherrapunji", state: "Meghalaya", desc: "Wettest place on earth — living root bridges and waterfalls", tags: ["Offbeat", "Nature"], available: false },
      { name: "Goa Monsoon", state: "Goa", desc: "Empty beaches, dramatic seas and half-price stays", tags: ["Offbeat", "Beach"], available: true, locationKey: "goa" },
    ]
  },
  {
    id: "snow",
    emoji: "❄️",
    label: "Snow Destinations",
    description: "Where to find snow in India",
    locations: [
      { name: "Gulmarg", state: "Jammu & Kashmir", desc: "Best skiing in Asia with gondola to 13,000 feet", tags: ["Snow", "Adventure"], available: false },
      { name: "Auli", state: "Uttarakhand", desc: "Ski resort with panoramic Himalayan views", tags: ["Snow", "Adventure"], available: false },
      { name: "Manali", state: "Himachal Pradesh", desc: "Snow from December to March, skiing at Solang Valley", tags: ["Snow", "Adventure"], available: true, locationKey: "manali" },
      { name: "Leh Ladakh", state: "Ladakh", desc: "Frozen rivers, snow leopards and Chadar trek in winter", tags: ["Snow", "Adventure"], available: false },
    ]
  },
  {
    id: "beaches",
    emoji: "🏖️",
    label: "Beaches",
    description: "India's most beautiful coastlines",
    locations: [
      { name: "Radhanagar Beach", state: "Andaman", desc: "Asia's best beach — turquoise water and white sand", tags: ["Beach", "Tropical"], available: false },
      { name: "Varkala", state: "Kerala", desc: "Cliff beach with natural springs and laid-back vibe", tags: ["Beach", "Scenic"], available: true, locationKey: "kerala" },
      { name: "Goa Beaches", state: "Goa", desc: "From party beaches to quiet coves — something for everyone", tags: ["Beach", "Nightlife"], available: true, locationKey: "goa" },
      { name: "Puri Beach", state: "Odisha", desc: "Jagannath temple town with sacred and scenic beaches", tags: ["Beach", "Spiritual"], available: false },
    ]
  },
  {
    id: "instagram",
    emoji: "📸",
    label: "Instagram Worthy Places",
    description: "Visually stunning destinations for photography",
    locations: [
      { name: "Rann of Kutch", state: "Gujarat", desc: "White salt desert under full moon — other worldly", tags: ["Unique", "Photography"], available: false },
      { name: "Jaisalmer", state: "Rajasthan", desc: "Golden fort city rising from the Thar desert", tags: ["Photography", "Heritage"], available: true, locationKey: "rajasthan" },
      { name: "Munnar Tea Gardens", state: "Kerala", desc: "Rolling green hills with geometric tea plantation patterns", tags: ["Nature", "Photography"], available: true, locationKey: "kerala" },
      { name: "Magnetic Hill", state: "Ladakh", desc: "Optical illusion hill where cars appear to go uphill", tags: ["Unique", "Photography"], available: false },
    ]
  },
  {
    id: "adventure",
    emoji: "🧗",
    label: "Adventure Sports",
    description: "Adrenaline destinations across India",
    locations: [
      { name: "Rishikesh", state: "Uttarakhand", desc: "White water rafting, bungee jumping and zip lining", tags: ["Rafting", "Bungee"], available: false },
      { name: "Manali", state: "Himachal Pradesh", desc: "Paragliding, skiing, trekking and river rafting", tags: ["Paragliding", "Skiing"], available: true, locationKey: "manali" },
      { name: "Goa", state: "Goa", desc: "Scuba diving, parasailing and jet skiing", tags: ["Scuba", "Water Sports"], available: true, locationKey: "goa" },
      { name: "Andaman", state: "Andaman & Nicobar", desc: "World class scuba diving and snorkeling", tags: ["Scuba", "Diving"], available: false },
    ]
  },
  {
    id: "food",
    emoji: "🍲",
    label: "Food Destinations",
    description: "Where to eat your way across India",
    locations: [
      { name: "Amritsar", state: "Punjab", desc: "Golden Temple langar, kulcha and lassi — food pilgrim's paradise", tags: ["Street Food", "Punjab"], available: false },
      { name: "Kolkata", state: "West Bengal", desc: "Mishti doi, kathi rolls and the best street food in India", tags: ["Street Food", "Bengal"], available: false },
      { name: "Goa", state: "Goa", desc: "Seafood, bebinca, feni and Portuguese-Indian fusion cuisine", tags: ["Seafood", "Fusion"], available: true, locationKey: "goa" },
      { name: "Rajasthan", state: "Rajasthan", desc: "Dal baati churma, laal maas and royal Rajasthani thali", tags: ["Traditional", "Rajasthani"], available: true, locationKey: "rajasthan" },
    ]
  },
  {
    id: "festivals",
    emoji: "🎉",
    label: "Festival Tourism",
    description: "Experience India's most spectacular celebrations",
    locations: [
      { name: "Pushkar Camel Fair", state: "Rajasthan", desc: "World's largest camel fair — November, 5 days of color", tags: ["Festival", "Culture"], available: true, locationKey: "rajasthan" },
      { name: "Onam", state: "Kerala", desc: "Snake boat races, Pookalam and harvest festival in August", tags: ["Festival", "Culture"], available: true, locationKey: "kerala" },
      { name: "Holi in Mathura", state: "Uttar Pradesh", desc: "Most colorful Holi celebration in the world", tags: ["Festival", "Color"], available: false },
      { name: "Hornbill Festival", state: "Nagaland", desc: "Festival of festivals — tribal culture at its finest in December", tags: ["Festival", "Tribal"], available: false },
    ]
  },
]