// All India locations for budget recommendation
// transport costs are from Delhi (Phase 1)
// will expand to all cities in Phase 2

export const allIndiaLocations = [
  // ── Our 4 built locations ──────────────────────────
  {
    name: "Goa",
    state: "Goa",
    emoji: "🏖️",
    tags: ["Beach", "Nightlife", "Food"],
    minTransport: 1700, // cheapest train from Delhi
    minStayPerNight: 400,
    minDays: 3,
    built: true,
    locationKey: "goa",
    description: "India's party capital with beaches, seafood and Portuguese charm",
  },
  {
    name: "Manali",
    state: "Himachal Pradesh",
    emoji: "🏔️",
    tags: ["Mountains", "Adventure", "Snow"],
    minTransport: 800,
    minStayPerNight: 300,
    minDays: 3,
    built: true,
    locationKey: "manali",
    description: "Snow-capped Himalayan valley with adventure sports and scenic beauty",
  },
  {
    name: "Kerala",
    state: "Kerala",
    emoji: "🌿",
    tags: ["Backwaters", "Nature", "Food"],
    minTransport: 1000,
    minStayPerNight: 350,
    minDays: 4,
    built: true,
    locationKey: "kerala",
    description: "God's own country — backwaters, tea gardens and beaches",
  },
  {
    name: "Rajasthan",
    state: "Rajasthan",
    emoji: "🏯",
    tags: ["Heritage", "Desert", "Culture"],
    minTransport: 200,
    minStayPerNight: 300,
    minDays: 3,
    built: true,
    locationKey: "rajasthan",
    description: "Royal forts, desert dunes and vibrant culture",
  },

  // ── Coming Soon locations ──────────────────────────
  {
    name: "Rishikesh",
    state: "Uttarakhand",
    emoji: "🕉️",
    tags: ["Adventure", "Spiritual", "Rafting"],
    minTransport: 300,
    minStayPerNight: 300,
    minDays: 2,
    built: false,
    description: "Yoga capital with river rafting and Ganga Aarti",
  },
  {
    name: "Shimla",
    state: "Himachal Pradesh",
    emoji: "🏔️",
    tags: ["Hills", "Colonial", "Scenic"],
    minTransport: 400,
    minStayPerNight: 500,
    minDays: 2,
    built: false,
    description: "Colonial hill station with toy train and apple orchards",
  },
  {
    name: "Leh Ladakh",
    state: "Ladakh",
    emoji: "🏜️",
    tags: ["Adventure", "Mountains", "Offbeat"],
    minTransport: 4000,
    minStayPerNight: 600,
    minDays: 5,
    built: false,
    description: "High altitude desert with monasteries and surreal landscapes",
  },
  {
    name: "Pondicherry",
    state: "Tamil Nadu",
    emoji: "🇫🇷",
    tags: ["Beach", "French", "Budget"],
    minTransport: 1200,
    minStayPerNight: 400,
    minDays: 2,
    built: false,
    description: "French quarter, beaches and ashrams — incredibly affordable",
  },
  {
    name: "Hampi",
    state: "Karnataka",
    emoji: "🗿",
    tags: ["Heritage", "Budget", "Ruins"],
    minTransport: 1000,
    minStayPerNight: 300,
    minDays: 2,
    built: false,
    description: "UNESCO ruins with magical boulder landscapes",
  },
  {
    name: "Coorg",
    state: "Karnataka",
    emoji: "☕",
    tags: ["Hills", "Coffee", "Nature"],
    minTransport: 1200,
    minStayPerNight: 800,
    minDays: 2,
    built: false,
    description: "Coffee country with waterfalls and misty hills",
  },
  {
    name: "Varanasi",
    state: "Uttar Pradesh",
    emoji: "🪔",
    tags: ["Spiritual", "Culture", "Ghats"],
    minTransport: 500,
    minStayPerNight: 400,
    minDays: 2,
    built: false,
    description: "Oldest living city — Ganga Aarti and spiritual awakening",
  },
  {
    name: "Andaman Islands",
    state: "Andaman & Nicobar",
    emoji: "🏝️",
    tags: ["Beach", "Scuba", "Tropical"],
    minTransport: 5000,
    minStayPerNight: 800,
    minDays: 4,
    built: false,
    description: "Pristine beaches, coral reefs and crystal clear water",
  },
  {
    name: "Meghalaya",
    state: "Meghalaya",
    emoji: "🌧️",
    tags: ["Offbeat", "Nature", "Caves"],
    minTransport: 2000,
    minStayPerNight: 500,
    minDays: 3,
    built: false,
    description: "Abode of clouds — living root bridges and waterfalls",
  },
  {
    name: "Spiti Valley",
    state: "Himachal Pradesh",
    emoji: "🏔️",
    tags: ["Offbeat", "Mountains", "Buddhist"],
    minTransport: 800,
    minStayPerNight: 400,
    minDays: 5,
    built: false,
    description: "Cold desert monastery trail at 12,500 feet",
  },
  {
    name: "Amritsar",
    state: "Punjab",
    emoji: "🙏",
    tags: ["Spiritual", "Food", "Heritage"],
    minTransport: 400,
    minStayPerNight: 500,
    minDays: 2,
    built: false,
    description: "Golden Temple, langar and the best kulcha in India",
  },
  {
    name: "Rann of Kutch",
    state: "Gujarat",
    emoji: "🌕",
    tags: ["Unique", "Desert", "Photography"],
    minTransport: 900,
    minStayPerNight: 600,
    minDays: 2,
    built: false,
    description: "White salt desert under full moon — other worldly",
  },
  {
    name: "Darjeeling",
    state: "West Bengal",
    emoji: "🍵",
    tags: ["Hills", "Tea", "Scenic"],
    minTransport: 1000,
    minStayPerNight: 500,
    minDays: 3,
    built: false,
    description: "Tea gardens, toy train and Himalayan sunrise views",
  },
  {
    name: "Ooty",
    state: "Tamil Nadu",
    emoji: "🌸",
    tags: ["Hills", "Nature", "Colonial"],
    minTransport: 1200,
    minStayPerNight: 600,
    minDays: 2,
    built: false,
    description: "Queen of hill stations with tea gardens and boat lake",
  },
  {
    name: "Pushkar",
    state: "Rajasthan",
    emoji: "🐪",
    tags: ["Spiritual", "Desert", "Festival"],
    minTransport: 200,
    minStayPerNight: 400,
    minDays: 2,
    built: false,
    description: "Sacred lake town with world famous camel fair",
  },
  {
    name: "Gulmarg",
    state: "Jammu & Kashmir",
    emoji: "❄️",
    tags: ["Snow", "Skiing", "Adventure"],
    minTransport: 1500,
    minStayPerNight: 800,
    minDays: 3,
    built: false,
    description: "Best skiing in Asia with gondola to 13,000 feet",
  },
]

// Budget recommendation engine
export const getRecommendations = (budget, groupSize = 1, days = 3) => {
  const perPersonBudget = budget / groupSize

  return allIndiaLocations.map(loc => {
    const transportTotal = loc.minTransport * 2 * groupSize // round trip
    const stayTotal = loc.minStayPerNight * days * (groupSize > 2 ? Math.ceil(groupSize / 2) : 1)
    const minTotal = transportTotal + stayTotal
    const remaining = budget - minTotal
    const remainingPerPerson = remaining / groupSize
    const percentUsed = (minTotal / budget) * 100

    let status = "recommended"
    if (percentUsed > 100) status = "outofreach"
    else if (percentUsed > 75) status = "stretch"
    else status = "recommended"

    return {
      ...loc,
      transportTotal,
      stayTotal,
      minTotal,
      remaining,
      remainingPerPerson,
      percentUsed,
      status,
      shortfall: minTotal - budget,
    }
  }).sort((a, b) => a.minTotal - b.minTotal)
}
