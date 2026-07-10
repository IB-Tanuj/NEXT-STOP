// ============================================
// NEXT STOP — Location Data (Map + Spots)
// Extracted from TripPage.jsx + all new cities
// ============================================

export const locationData = {
  // ══════════════════════════════════════════════════════════
  // EXISTING 4 LOCATIONS (preserved exactly)
  // ══════════════════════════════════════════════════════════
  goa: {
    name: "Goa",
    coords: [15.4989, 73.8278],
    zoom: 11,
    spots: [
      { name: "Baga Beach", coords: [15.5564, 73.7515], emoji: "🏖️" },
      { name: "Dudhsagar Falls", coords: [15.3144, 74.3144], emoji: "💧" },
      { name: "Old Goa Churches", coords: [15.5009, 73.9116], emoji: "⛪" },
      { name: "Anjuna Beach", coords: [15.5736, 73.7400], emoji: "🌊" },
      { name: "Fort Aguada", coords: [15.4942, 73.7733], emoji: "🏰" },
      { name: "Palolem Beach", coords: [15.0100, 74.0232], emoji: "🌴" },
      { name: "Calangute Beach", coords: [15.5438, 73.7554], emoji: "🏖️" },
    ],
    suggestions: [
      { name: "Baga Beach", emoji: "🏖️" },
      { name: "Dudhsagar Falls", emoji: "💧" },
      { name: "Old Goa Churches", emoji: "⛪" },
      { name: "Anjuna Beach", emoji: "🌊" },
      { name: "Fort Aguada", emoji: "🏰" },
      { name: "Palolem Beach", emoji: "🌴" },
      { name: "Calangute Beach", emoji: "🏖️" },
    ]
  },
  manali: {
    name: "Manali",
    coords: [32.2432, 77.1892],
    zoom: 13,
    customBoundary: [
      [32.3900, 77.1200], [32.3750, 77.1500], [32.3717, 77.2367],
      [32.3500, 77.2800], [32.3200, 77.3000], [32.2900, 77.2900],
      [32.2600, 77.2700], [32.2396, 77.1735], [32.2200, 77.1500],
      [32.1900, 77.1400], [32.1800, 77.1200], [32.2000, 77.0900],
      [32.2400, 77.0700], [32.2800, 77.0800], [32.3200, 77.0900],
      [32.3600, 77.1000], [32.3900, 77.1200],
    ],
    spots: [
      { name: "Rohtang Pass", coords: [32.3717, 77.2367], emoji: "🏔️" },
      { name: "Solang Valley", coords: [32.3189, 77.1458], emoji: "⛷️" },
      { name: "Hadimba Temple", coords: [32.2396, 77.1735], emoji: "🛕" },
      { name: "Beas River", coords: [32.2318, 77.1924], emoji: "🌊" },
      { name: "Mall Road", coords: [32.2396, 77.1892], emoji: "🛍️" },
      { name: "Naggar Castle", coords: [32.1033, 77.1692], emoji: "🏯" },
      { name: "Jogini Falls", coords: [32.2598, 77.1805], emoji: "💧" },
    ],
    suggestions: [
      { name: "Rohtang Pass", emoji: "🏔️" },
      { name: "Solang Valley", emoji: "⛷️" },
      { name: "Hadimba Temple", emoji: "🛕" },
      { name: "Beas River", emoji: "🌊" },
      { name: "Mall Road", emoji: "🛍️" },
      { name: "Naggar Castle", emoji: "🏯" },
      { name: "Jogini Falls", emoji: "💧" },
    ]
  },
  kerala: {
    name: "Kerala",
    coords: [10.8505, 76.2711],
    zoom: 8,
    spots: [
      { name: "Alleppey Backwaters", coords: [9.4981, 76.3388], emoji: "🚢" },
      { name: "Munnar Tea Gardens", coords: [10.0889, 77.0595], emoji: "🍵" },
      { name: "Kovalam Beach", coords: [8.4004, 76.9787], emoji: "🏖️" },
      { name: "Wayanad Wildlife", coords: [11.6854, 76.1320], emoji: "🐘" },
      { name: "Thekkady Periyar", coords: [9.5992, 77.1693], emoji: "🌿" },
      { name: "Varkala Beach", coords: [8.7378, 76.7164], emoji: "🌊" },
      { name: "Thrissur Pooram", coords: [10.5276, 76.2144], emoji: "🎭" },
      { name: "Bekal Fort", coords: [12.3908, 75.0353], emoji: "🏰" },
      { name: "Athirappilly Falls", coords: [10.2834, 76.5694], emoji: "💧" },
      { name: "Kannur Beach", coords: [11.8745, 75.3704], emoji: "🏖️" },
      { name: "Padmanabhaswamy Temple", coords: [8.4821, 76.9453], emoji: "🛕" },
    ],
    suggestions: [
      { name: "Alleppey Backwaters", emoji: "🚢" },
      { name: "Munnar Tea Gardens", emoji: "🍵" },
      { name: "Kovalam Beach", emoji: "🏖️" },
      { name: "Wayanad Wildlife", emoji: "🐘" },
      { name: "Thekkady Periyar", emoji: "🌿" },
      { name: "Varkala Beach", emoji: "🌊" },
      { name: "Thrissur Pooram", emoji: "🎭" },
      { name: "Bekal Fort", emoji: "🏰" },
      { name: "Athirappilly Falls", emoji: "💧" },
      { name: "Kannur Beach", emoji: "🏖️" },
      { name: "Padmanabhaswamy Temple", emoji: "🛕" },
    ]
  },
  rajasthan: {
    name: "Rajasthan",
    coords: [27.0238, 74.2179],
    zoom: 7,
    spots: [
      { name: "Jaipur City Palace", coords: [26.9255, 75.8236], emoji: "🏯" },
      { name: "Jaisalmer Fort", coords: [26.9157, 70.9083], emoji: "🏰" },
      { name: "Udaipur Lake Palace", coords: [24.5754, 73.6830], emoji: "🌊" },
      { name: "Sam Sand Dunes", coords: [26.8753, 70.5383], emoji: "🐪" },
      { name: "Mehrangarh Fort", coords: [26.2980, 73.0188], emoji: "🏯" },
      { name: "Pushkar Lake", coords: [26.4898, 74.5511], emoji: "🛕" },
      { name: "Amber Fort", coords: [26.9855, 75.8513], emoji: "🏰" },
      { name: "Ranthambore Tiger Reserve", coords: [26.0173, 76.5026], emoji: "🐯" },
      { name: "Hawa Mahal", coords: [26.9239, 75.8267], emoji: "🏛️" },
      { name: "Mount Abu", coords: [24.5926, 72.7156], emoji: "⛰️" },
      { name: "Chittorgarh Fort", coords: [24.8887, 74.6269], emoji: "🏰" },
    ],
    suggestions: [
      { name: "Jaipur City Palace", emoji: "🏯" },
      { name: "Jaisalmer Fort", emoji: "🏰" },
      { name: "Udaipur Lake Palace", emoji: "🌊" },
      { name: "Sam Sand Dunes", emoji: "🐪" },
      { name: "Mehrangarh Fort", emoji: "🏯" },
      { name: "Pushkar Lake", emoji: "🛕" },
      { name: "Amber Fort", emoji: "🏰" },
      { name: "Ranthambore Tiger Reserve", emoji: "🐯" },
      { name: "Hawa Mahal", emoji: "🏛️" },
      { name: "Mount Abu", emoji: "⛰️" },
      { name: "Chittorgarh Fort", emoji: "🏰" },
    ]
  },

  // ══════════════════════════════════════════════════════════
  // RAJASTHAN CITIES
  // ══════════════════════════════════════════════════════════
  jaipur: {
    name: "Jaipur",
    coords: [26.9124, 75.7873],
    zoom: 12,
    spots: [
      { name: "Hawa Mahal", coords: [26.9239, 75.8267], emoji: "🏛️" },
      { name: "City Palace", coords: [26.9255, 75.8236], emoji: "🏯" },
      { name: "Amber Fort", coords: [26.9855, 75.8513], emoji: "🏰" },
      { name: "Jantar Mantar", coords: [26.9248, 75.8242], emoji: "🔭" },
      { name: "Nahargarh Fort", coords: [26.9372, 75.8153], emoji: "🏰" },
      { name: "Jal Mahal", coords: [26.9530, 75.8462], emoji: "🌊" },
      { name: "Albert Hall Museum", coords: [26.9116, 75.8195], emoji: "🏛️" },
    ],
    suggestions: [
      { name: "Hawa Mahal", emoji: "🏛️" },
      { name: "City Palace", emoji: "🏯" },
      { name: "Amber Fort", emoji: "🏰" },
      { name: "Jantar Mantar", emoji: "🔭" },
      { name: "Nahargarh Fort", emoji: "🏰" },
      { name: "Jal Mahal", emoji: "🌊" },
      { name: "Albert Hall Museum", emoji: "🏛️" },
    ]
  },
  udaipur: {
    name: "Udaipur",
    coords: [24.5854, 73.7125],
    zoom: 13,
    spots: [
      { name: "Lake Pichola", coords: [24.5754, 73.6830], emoji: "🌊" },
      { name: "City Palace Udaipur", coords: [24.5764, 73.6913], emoji: "🏯" },
      { name: "Jag Mandir", coords: [24.5696, 73.6864], emoji: "🏰" },
      { name: "Saheliyon Ki Bari", coords: [24.5942, 73.6980], emoji: "🌸" },
      { name: "Fateh Sagar Lake", coords: [24.6005, 73.6818], emoji: "💧" },
      { name: "Bagore Ki Haveli", coords: [24.5777, 73.6813], emoji: "🏠" },
    ],
    suggestions: [
      { name: "Lake Pichola", emoji: "🌊" },
      { name: "City Palace Udaipur", emoji: "🏯" },
      { name: "Jag Mandir", emoji: "🏰" },
      { name: "Saheliyon Ki Bari", emoji: "🌸" },
      { name: "Fateh Sagar Lake", emoji: "💧" },
      { name: "Bagore Ki Haveli", emoji: "🏠" },
    ]
  },
  jodhpur: {
    name: "Jodhpur",
    coords: [26.2389, 73.0243],
    zoom: 13,
    spots: [
      { name: "Mehrangarh Fort", coords: [26.2980, 73.0188], emoji: "🏰" },
      { name: "Jaswant Thada", coords: [26.2983, 73.0237], emoji: "🏛️" },
      { name: "Umaid Bhawan Palace", coords: [26.2694, 73.0412], emoji: "🏯" },
      { name: "Clock Tower", coords: [26.2937, 73.0260], emoji: "🕰️" },
      { name: "Toorji Ka Jhalra", coords: [26.2937, 73.0249], emoji: "💧" },
      { name: "Blue City Streets", coords: [26.2960, 73.0230], emoji: "🔵" },
    ],
    suggestions: [
      { name: "Mehrangarh Fort", emoji: "🏰" },
      { name: "Jaswant Thada", emoji: "🏛️" },
      { name: "Umaid Bhawan Palace", emoji: "🏯" },
      { name: "Clock Tower", emoji: "🕰️" },
      { name: "Toorji Ka Jhalra", emoji: "💧" },
      { name: "Blue City Streets", emoji: "🔵" },
    ]
  },
  jaisalmer: {
    name: "Jaisalmer",
    coords: [26.9157, 70.9083],
    zoom: 12,
    spots: [
      { name: "Jaisalmer Fort", coords: [26.9122, 70.9125], emoji: "🏰" },
      { name: "Sam Sand Dunes", coords: [26.8753, 70.5383], emoji: "🐪" },
      { name: "Patwon Ki Haveli", coords: [26.9139, 70.9146], emoji: "🏠" },
      { name: "Gadisar Lake", coords: [26.9050, 70.9194], emoji: "🌊" },
      { name: "Desert National Park", coords: [26.7800, 70.4500], emoji: "🦅" },
      { name: "Kuldhara Village", coords: [26.9500, 70.7700], emoji: "👻" },
    ],
    suggestions: [
      { name: "Jaisalmer Fort", emoji: "🏰" },
      { name: "Sam Sand Dunes", emoji: "🐪" },
      { name: "Patwon Ki Haveli", emoji: "🏠" },
      { name: "Gadisar Lake", emoji: "🌊" },
      { name: "Desert National Park", emoji: "🦅" },
      { name: "Kuldhara Village", emoji: "👻" },
    ]
  },
  pushkar: {
    name: "Pushkar",
    coords: [26.4898, 74.5511],
    zoom: 14,
    spots: [
      { name: "Pushkar Lake", coords: [26.4898, 74.5511], emoji: "🌊" },
      { name: "Brahma Temple", coords: [26.4891, 74.5530], emoji: "🛕" },
      { name: "Savitri Temple", coords: [26.4963, 74.5579], emoji: "⛰️" },
      { name: "Rose Garden", coords: [26.4870, 74.5560], emoji: "🌹" },
      { name: "Pushkar Bazaar", coords: [26.4907, 74.5537], emoji: "🛍️" },
    ],
    suggestions: [
      { name: "Pushkar Lake", emoji: "🌊" },
      { name: "Brahma Temple", emoji: "🛕" },
      { name: "Savitri Temple", emoji: "⛰️" },
      { name: "Rose Garden", emoji: "🌹" },
      { name: "Pushkar Bazaar", emoji: "🛍️" },
    ]
  },
  mountabu: {
    name: "Mount Abu",
    coords: [24.5926, 72.7156],
    zoom: 13,
    spots: [
      { name: "Dilwara Temples", coords: [24.6080, 72.7100], emoji: "🛕" },
      { name: "Nakki Lake", coords: [24.5908, 72.7074], emoji: "🌊" },
      { name: "Guru Shikhar", coords: [24.6500, 72.7700], emoji: "⛰️" },
      { name: "Sunset Point", coords: [24.5860, 72.6990], emoji: "🌅" },
      { name: "Trevor's Tank", coords: [24.5700, 72.7300], emoji: "🐊" },
    ],
    suggestions: [
      { name: "Dilwara Temples", emoji: "🛕" },
      { name: "Nakki Lake", emoji: "🌊" },
      { name: "Guru Shikhar", emoji: "⛰️" },
      { name: "Sunset Point", emoji: "🌅" },
      { name: "Trevor's Tank", emoji: "🐊" },
    ]
  },

  // ══════════════════════════════════════════════════════════
  // HIMACHAL PRADESH CITIES
  // ══════════════════════════════════════════════════════════
  shimla: {
    name: "Shimla",
    coords: [31.1048, 77.1734],
    zoom: 13,
    spots: [
      { name: "The Ridge", coords: [31.1048, 77.1712], emoji: "🏔️" },
      { name: "Mall Road Shimla", coords: [31.1040, 77.1720], emoji: "🛍️" },
      { name: "Jakhu Temple", coords: [31.1107, 77.1793], emoji: "🛕" },
      { name: "Christ Church", coords: [31.1046, 77.1700], emoji: "⛪" },
      { name: "Kufri", coords: [31.0980, 77.2670], emoji: "❄️" },
      { name: "Toy Train Station", coords: [31.1050, 77.1640], emoji: "🚂" },
    ],
    suggestions: [
      { name: "The Ridge", emoji: "🏔️" },
      { name: "Mall Road Shimla", emoji: "🛍️" },
      { name: "Jakhu Temple", emoji: "🛕" },
      { name: "Christ Church", emoji: "⛪" },
      { name: "Kufri", emoji: "❄️" },
      { name: "Toy Train Station", emoji: "🚂" },
    ]
  },
  dharamshala: {
    name: "Dharamshala",
    coords: [32.2190, 76.3234],
    zoom: 13,
    spots: [
      { name: "Tsuglagkhang Complex", coords: [32.2405, 76.3192], emoji: "🛕" },
      { name: "Bhagsu Falls", coords: [32.2482, 76.3266], emoji: "💧" },
      { name: "Triund Trek", coords: [32.2639, 76.3340], emoji: "🏔️" },
      { name: "Namgyal Monastery", coords: [32.2408, 76.3190], emoji: "🕉️" },
      { name: "McLeodganj Market", coords: [32.2412, 76.3191], emoji: "🛍️" },
      { name: "Dal Lake Dharamshala", coords: [32.2350, 76.3120], emoji: "🌊" },
    ],
    suggestions: [
      { name: "Tsuglagkhang Complex", emoji: "🛕" },
      { name: "Bhagsu Falls", emoji: "💧" },
      { name: "Triund Trek", emoji: "🏔️" },
      { name: "Namgyal Monastery", emoji: "🕉️" },
      { name: "McLeodganj Market", emoji: "🛍️" },
      { name: "Dal Lake Dharamshala", emoji: "🌊" },
    ]
  },
  kasol: {
    name: "Kasol",
    coords: [32.0100, 77.3142],
    zoom: 14,
    spots: [
      { name: "Kheerganga Trek", coords: [32.0500, 77.4500], emoji: "🏔️" },
      { name: "Parvati River", coords: [32.0090, 77.3140], emoji: "🌊" },
      { name: "Tosh Village", coords: [32.0570, 77.4370], emoji: "🏘️" },
      { name: "Malana Village", coords: [32.0790, 77.3390], emoji: "🏘️" },
      { name: "Chalal Trek", coords: [32.0150, 77.3200], emoji: "🌿" },
    ],
    suggestions: [
      { name: "Kheerganga Trek", emoji: "🏔️" },
      { name: "Parvati River", emoji: "🌊" },
      { name: "Tosh Village", emoji: "🏘️" },
      { name: "Malana Village", emoji: "🏘️" },
      { name: "Chalal Trek", emoji: "🌿" },
    ]
  },
  spiti: {
    name: "Spiti Valley",
    coords: [32.2460, 78.0350],
    zoom: 10,
    spots: [
      { name: "Key Monastery", coords: [32.5290, 78.0120], emoji: "🛕" },
      { name: "Chandratal Lake", coords: [32.4820, 77.6210], emoji: "🌊" },
      { name: "Dhankar Monastery", coords: [32.4550, 78.0310], emoji: "🏔️" },
      { name: "Pin Valley", coords: [32.3900, 78.0200], emoji: "🏜️" },
      { name: "Tabo Monastery", coords: [32.0930, 78.3860], emoji: "🛕" },
      { name: "Kunzum Pass", coords: [32.4080, 77.5740], emoji: "🏔️" },
    ],
    suggestions: [
      { name: "Key Monastery", emoji: "🛕" },
      { name: "Chandratal Lake", emoji: "🌊" },
      { name: "Dhankar Monastery", emoji: "🏔️" },
      { name: "Pin Valley", emoji: "🏜️" },
      { name: "Tabo Monastery", emoji: "🛕" },
      { name: "Kunzum Pass", emoji: "🏔️" },
    ]
  },
  birbilling: {
    name: "Bir Billing",
    coords: [32.0493, 76.7247],
    zoom: 13,
    spots: [
      { name: "Billing Takeoff Site", coords: [32.0900, 76.7500], emoji: "🪂" },
      { name: "Chokling Monastery", coords: [32.0450, 76.7220], emoji: "🛕" },
      { name: "Landing Site", coords: [32.0493, 76.7247], emoji: "🏕️" },
      { name: "Bir Tea Factory", coords: [32.0470, 76.7200], emoji: "🍵" },
      { name: "Deer Park Institute", coords: [32.0510, 76.7180], emoji: "📚" },
    ],
    suggestions: [
      { name: "Billing Takeoff Site", emoji: "🪂" },
      { name: "Chokling Monastery", emoji: "🛕" },
      { name: "Landing Site", emoji: "🏕️" },
      { name: "Bir Tea Factory", emoji: "🍵" },
      { name: "Deer Park Institute", emoji: "📚" },
    ]
  },

  // ══════════════════════════════════════════════════════════
  // UTTARAKHAND CITIES
  // ══════════════════════════════════════════════════════════
  rishikesh: {
    name: "Rishikesh",
    coords: [30.0869, 78.2676],
    zoom: 13,
    spots: [
      { name: "Laxman Jhula", coords: [30.1245, 78.3192], emoji: "🌉" },
      { name: "Ram Jhula", coords: [30.1133, 78.3123], emoji: "🌉" },
      { name: "Triveni Ghat", coords: [30.1050, 78.2953], emoji: "🕉️" },
      { name: "Beatles Ashram", coords: [30.1166, 78.3105], emoji: "🎸" },
      { name: "Neer Garh Waterfall", coords: [30.1410, 78.3360], emoji: "💧" },
      { name: "Rafting Start Point", coords: [30.1550, 78.3770], emoji: "🚣" },
    ],
    suggestions: [
      { name: "Laxman Jhula", emoji: "🌉" },
      { name: "Ram Jhula", emoji: "🌉" },
      { name: "Triveni Ghat", emoji: "🕉️" },
      { name: "Beatles Ashram", emoji: "🎸" },
      { name: "Neer Garh Waterfall", emoji: "💧" },
      { name: "Rafting Start Point", emoji: "🚣" },
    ]
  },
  nainital: {
    name: "Nainital",
    coords: [29.3919, 79.4542],
    zoom: 13,
    spots: [
      { name: "Naini Lake", coords: [29.3919, 79.4542], emoji: "🌊" },
      { name: "Snow View Point", coords: [29.3996, 79.4654], emoji: "🏔️" },
      { name: "Naina Devi Temple", coords: [29.3936, 79.4629], emoji: "🛕" },
      { name: "Tiffin Top", coords: [29.3826, 79.4416], emoji: "⛰️" },
      { name: "Mall Road Nainital", coords: [29.3931, 79.4540], emoji: "🛍️" },
      { name: "Eco Cave Gardens", coords: [29.3839, 79.4469], emoji: "🦇" },
    ],
    suggestions: [
      { name: "Naini Lake", emoji: "🌊" },
      { name: "Snow View Point", emoji: "🏔️" },
      { name: "Naina Devi Temple", emoji: "🛕" },
      { name: "Tiffin Top", emoji: "⛰️" },
      { name: "Mall Road Nainital", emoji: "🛍️" },
      { name: "Eco Cave Gardens", emoji: "🦇" },
    ]
  },
  mussoorie: {
    name: "Mussoorie",
    coords: [30.4598, 78.0644],
    zoom: 13,
    spots: [
      { name: "Kempty Falls", coords: [30.4830, 78.0340], emoji: "💧" },
      { name: "Gun Hill Point", coords: [30.4590, 78.0680], emoji: "🏔️" },
      { name: "Camel's Back Road", coords: [30.4612, 78.0550], emoji: "🌲" },
      { name: "Lal Tibba", coords: [30.4710, 78.1120], emoji: "⛰️" },
      { name: "Company Garden", coords: [30.4510, 78.0690], emoji: "🌺" },
    ],
    suggestions: [
      { name: "Kempty Falls", emoji: "💧" },
      { name: "Gun Hill Point", emoji: "🏔️" },
      { name: "Camel's Back Road", emoji: "🌲" },
      { name: "Lal Tibba", emoji: "⛰️" },
      { name: "Company Garden", emoji: "🌺" },
    ]
  },
  haridwar: {
    name: "Haridwar",
    coords: [29.9457, 78.1642],
    zoom: 13,
    spots: [
      { name: "Har Ki Pauri", coords: [29.9557, 78.1686], emoji: "🪔" },
      { name: "Mansa Devi Temple", coords: [29.9603, 78.1670], emoji: "🛕" },
      { name: "Chandi Devi Temple", coords: [29.9727, 78.1750], emoji: "🛕" },
      { name: "Ganga Aarti", coords: [29.9557, 78.1686], emoji: "🕯️" },
      { name: "Maya Devi Temple", coords: [29.9540, 78.1650], emoji: "🛕" },
    ],
    suggestions: [
      { name: "Har Ki Pauri", emoji: "🪔" },
      { name: "Mansa Devi Temple", emoji: "🛕" },
      { name: "Chandi Devi Temple", emoji: "🛕" },
      { name: "Ganga Aarti", emoji: "🕯️" },
      { name: "Maya Devi Temple", emoji: "🛕" },
    ]
  },
  chopta: {
    name: "Chopta",
    coords: [30.4912, 79.1850],
    zoom: 13,
    spots: [
      { name: "Tungnath Temple", coords: [30.4900, 79.2150], emoji: "🛕" },
      { name: "Chandrashila Summit", coords: [30.4860, 79.2180], emoji: "🏔️" },
      { name: "Deoria Tal", coords: [30.4620, 79.1840], emoji: "🌊" },
      { name: "Chopta Meadows", coords: [30.4912, 79.1850], emoji: "🌿" },
      { name: "Rohini Bugyal", coords: [30.5100, 79.1750], emoji: "🏕️" },
    ],
    suggestions: [
      { name: "Tungnath Temple", emoji: "🛕" },
      { name: "Chandrashila Summit", emoji: "🏔️" },
      { name: "Deoria Tal", emoji: "🌊" },
      { name: "Chopta Meadows", emoji: "🌿" },
      { name: "Rohini Bugyal", emoji: "🏕️" },
    ]
  },
  auli: {
    name: "Auli",
    coords: [30.5267, 79.5667],
    zoom: 14,
    spots: [
      { name: "Auli Ski Slope", coords: [30.5267, 79.5667], emoji: "⛷️" },
      { name: "Gorson Bugyal", coords: [30.5350, 79.5700], emoji: "🏔️" },
      { name: "Joshimath Town", coords: [30.5553, 79.5659], emoji: "🏘️" },
      { name: "Auli Ropeway", coords: [30.5280, 79.5650], emoji: "🚡" },
      { name: "Nanda Devi View", coords: [30.5300, 79.5680], emoji: "🏔️" },
    ],
    suggestions: [
      { name: "Auli Ski Slope", emoji: "⛷️" },
      { name: "Gorson Bugyal", emoji: "🏔️" },
      { name: "Joshimath Town", emoji: "🏘️" },
      { name: "Auli Ropeway", emoji: "🚡" },
      { name: "Nanda Devi View", emoji: "🏔️" },
    ]
  },

  // ══════════════════════════════════════════════════════════
  // KERALA CITIES
  // ══════════════════════════════════════════════════════════
  kochi: {
    name: "Kochi",
    coords: [9.9312, 76.2673],
    zoom: 13,
    spots: [
      { name: "Chinese Fishing Nets", coords: [9.9638, 76.2426], emoji: "🎣" },
      { name: "Fort Kochi", coords: [9.9639, 76.2424], emoji: "🏰" },
      { name: "Mattancherry Palace", coords: [9.9575, 76.2594], emoji: "🏯" },
      { name: "Jewish Synagogue", coords: [9.9572, 76.2606], emoji: "🕍" },
      { name: "Marine Drive", coords: [9.9744, 76.2829], emoji: "🌊" },
      { name: "Lulu Mall", coords: [10.0059, 76.3064], emoji: "🛍️" },
    ],
    suggestions: [
      { name: "Chinese Fishing Nets", emoji: "🎣" },
      { name: "Fort Kochi", emoji: "🏰" },
      { name: "Mattancherry Palace", emoji: "🏯" },
      { name: "Jewish Synagogue", emoji: "🕍" },
      { name: "Marine Drive", emoji: "🌊" },
      { name: "Lulu Mall", emoji: "🛍️" },
    ]
  },
  munnar: {
    name: "Munnar",
    coords: [10.0889, 77.0595],
    zoom: 12,
    spots: [
      { name: "Tea Museum", coords: [10.0632, 77.0577], emoji: "🍵" },
      { name: "Eravikulam National Park", coords: [10.1667, 77.0500], emoji: "🦌" },
      { name: "Top Station", coords: [10.1242, 77.2383], emoji: "🏔️" },
      { name: "Mattupetty Dam", coords: [10.1057, 77.1258], emoji: "💧" },
      { name: "Anamudi Peak", coords: [10.1678, 77.0597], emoji: "⛰️" },
      { name: "Rose Garden", coords: [10.0720, 77.0560], emoji: "🌹" },
    ],
    suggestions: [
      { name: "Tea Museum", emoji: "🍵" },
      { name: "Eravikulam National Park", emoji: "🦌" },
      { name: "Top Station", emoji: "🏔️" },
      { name: "Mattupetty Dam", emoji: "💧" },
      { name: "Anamudi Peak", emoji: "⛰️" },
      { name: "Rose Garden", emoji: "🌹" },
    ]
  },
  alleppey: {
    name: "Alleppey",
    coords: [9.4981, 76.3388],
    zoom: 12,
    spots: [
      { name: "Alleppey Beach", coords: [9.4881, 76.3330], emoji: "🏖️" },
      { name: "Backwater Cruise", coords: [9.4981, 76.3388], emoji: "🚢" },
      { name: "Vembanad Lake", coords: [9.5833, 76.3583], emoji: "🌊" },
      { name: "Ambalapuzha Temple", coords: [9.3810, 76.3536], emoji: "🛕" },
      { name: "Krishnapuram Palace", coords: [9.3310, 76.4830], emoji: "🏯" },
    ],
    suggestions: [
      { name: "Alleppey Beach", emoji: "🏖️" },
      { name: "Backwater Cruise", emoji: "🚢" },
      { name: "Vembanad Lake", emoji: "🌊" },
      { name: "Ambalapuzha Temple", emoji: "🛕" },
      { name: "Krishnapuram Palace", emoji: "🏯" },
    ]
  },
  wayanad: {
    name: "Wayanad",
    coords: [11.6854, 76.1320],
    zoom: 11,
    spots: [
      { name: "Edakkal Caves", coords: [11.6200, 76.2200], emoji: "🗿" },
      { name: "Banasura Sagar Dam", coords: [11.6700, 76.0400], emoji: "💧" },
      { name: "Chembra Peak", coords: [11.5500, 76.0800], emoji: "🏔️" },
      { name: "Wayanad Wildlife", coords: [11.6300, 76.2600], emoji: "🐘" },
      { name: "Soochipara Falls", coords: [11.5100, 76.1300], emoji: "💧" },
    ],
    suggestions: [
      { name: "Edakkal Caves", emoji: "🗿" },
      { name: "Banasura Sagar Dam", emoji: "💧" },
      { name: "Chembra Peak", emoji: "🏔️" },
      { name: "Wayanad Wildlife", emoji: "🐘" },
      { name: "Soochipara Falls", emoji: "💧" },
    ]
  },
  varkala: {
    name: "Varkala",
    coords: [8.7378, 76.7164],
    zoom: 14,
    spots: [
      { name: "Varkala Cliff", coords: [8.7350, 76.7150], emoji: "🏖️" },
      { name: "Papanasam Beach", coords: [8.7390, 76.7120], emoji: "🌊" },
      { name: "Janardana Swami Temple", coords: [8.7370, 76.7130], emoji: "🛕" },
      { name: "Sivagiri Mutt", coords: [8.7250, 76.7100], emoji: "🕉️" },
      { name: "Edava Beach", coords: [8.7600, 76.7200], emoji: "🏖️" },
    ],
    suggestions: [
      { name: "Varkala Cliff", emoji: "🏖️" },
      { name: "Papanasam Beach", emoji: "🌊" },
      { name: "Janardana Swami Temple", emoji: "🛕" },
      { name: "Sivagiri Mutt", emoji: "🕉️" },
      { name: "Edava Beach", emoji: "🏖️" },
    ]
  },
  thekkady: {
    name: "Thekkady",
    coords: [9.5992, 77.1693],
    zoom: 12,
    spots: [
      { name: "Periyar Tiger Reserve", coords: [9.4833, 77.1667], emoji: "🐯" },
      { name: "Periyar Lake", coords: [9.5000, 77.1700], emoji: "🌊" },
      { name: "Spice Plantations", coords: [9.5900, 77.1600], emoji: "🌿" },
      { name: "Kumily Town", coords: [9.6000, 77.1700], emoji: "🏘️" },
      { name: "Bamboo Rafting", coords: [9.5200, 77.1800], emoji: "🚣" },
    ],
    suggestions: [
      { name: "Periyar Tiger Reserve", emoji: "🐯" },
      { name: "Periyar Lake", emoji: "🌊" },
      { name: "Spice Plantations", emoji: "🌿" },
      { name: "Kumily Town", emoji: "🏘️" },
      { name: "Bamboo Rafting", emoji: "🚣" },
    ]
  },

  // ══════════════════════════════════════════════════════════
  // KARNATAKA CITIES
  // ══════════════════════════════════════════════════════════
  bangalore: {
    name: "Bangalore",
    coords: [12.9716, 77.5946],
    zoom: 12,
    spots: [
      { name: "Lalbagh Garden", coords: [12.9507, 77.5848], emoji: "🌺" },
      { name: "Cubbon Park", coords: [12.9763, 77.5929], emoji: "🌲" },
      { name: "Bangalore Palace", coords: [12.9987, 77.5920], emoji: "🏰" },
      { name: "Tipu Sultan's Palace", coords: [12.9593, 77.5735], emoji: "🏯" },
      { name: "UB City Mall", coords: [12.9716, 77.5950], emoji: "🛍️" },
      { name: "Nandi Hills", coords: [13.3702, 77.6835], emoji: "🏔️" },
    ],
    suggestions: [
      { name: "Lalbagh Garden", emoji: "🌺" },
      { name: "Cubbon Park", emoji: "🌲" },
      { name: "Bangalore Palace", emoji: "🏰" },
      { name: "Tipu Sultan's Palace", emoji: "🏯" },
      { name: "UB City Mall", emoji: "🛍️" },
      { name: "Nandi Hills", emoji: "🏔️" },
    ]
  },
  mysore: {
    name: "Mysore",
    coords: [12.2958, 76.6394],
    zoom: 13,
    spots: [
      { name: "Mysore Palace", coords: [12.3052, 76.6552], emoji: "🏯" },
      { name: "Chamundi Hills", coords: [12.2724, 76.6703], emoji: "⛰️" },
      { name: "Brindavan Gardens", coords: [12.4213, 76.5733], emoji: "🌺" },
      { name: "St Philomena's Church", coords: [12.3170, 76.6570], emoji: "⛪" },
      { name: "Devaraja Market", coords: [12.3080, 76.6530], emoji: "🛍️" },
    ],
    suggestions: [
      { name: "Mysore Palace", emoji: "🏯" },
      { name: "Chamundi Hills", emoji: "⛰️" },
      { name: "Brindavan Gardens", emoji: "🌺" },
      { name: "St Philomena's Church", emoji: "⛪" },
      { name: "Devaraja Market", emoji: "🛍️" },
    ]
  },
  hampi: {
    name: "Hampi",
    coords: [15.3350, 76.4600],
    zoom: 13,
    spots: [
      { name: "Virupaksha Temple", coords: [15.3350, 76.4599], emoji: "🛕" },
      { name: "Stone Chariot", coords: [15.3349, 76.4697], emoji: "🗿" },
      { name: "Lotus Mahal", coords: [15.3290, 76.4680], emoji: "🌸" },
      { name: "Matanga Hill", coords: [15.3373, 76.4640], emoji: "🏔️" },
      { name: "Elephant Stables", coords: [15.3300, 76.4690], emoji: "🐘" },
      { name: "Tungabhadra River", coords: [15.3400, 76.4500], emoji: "🌊" },
    ],
    suggestions: [
      { name: "Virupaksha Temple", emoji: "🛕" },
      { name: "Stone Chariot", emoji: "🗿" },
      { name: "Lotus Mahal", emoji: "🌸" },
      { name: "Matanga Hill", emoji: "🏔️" },
      { name: "Elephant Stables", emoji: "🐘" },
      { name: "Tungabhadra River", emoji: "🌊" },
    ]
  },
  coorg: {
    name: "Coorg",
    coords: [12.3375, 75.8069],
    zoom: 11,
    spots: [
      { name: "Abbey Falls", coords: [12.4560, 75.7220], emoji: "💧" },
      { name: "Raja's Seat", coords: [12.4210, 75.7350], emoji: "🌅" },
      { name: "Dubare Elephant Camp", coords: [12.4200, 75.9400], emoji: "🐘" },
      { name: "Talakaveri", coords: [12.3200, 75.4900], emoji: "🌊" },
      { name: "Coffee Plantations", coords: [12.4000, 75.8000], emoji: "☕" },
    ],
    suggestions: [
      { name: "Abbey Falls", emoji: "💧" },
      { name: "Raja's Seat", emoji: "🌅" },
      { name: "Dubare Elephant Camp", emoji: "🐘" },
      { name: "Talakaveri", emoji: "🌊" },
      { name: "Coffee Plantations", emoji: "☕" },
    ]
  },
  gokarna: {
    name: "Gokarna",
    coords: [14.5479, 74.3188],
    zoom: 13,
    spots: [
      { name: "Om Beach", coords: [14.5220, 74.3040], emoji: "🏖️" },
      { name: "Kudle Beach", coords: [14.5380, 74.3070], emoji: "🌊" },
      { name: "Half Moon Beach", coords: [14.5140, 74.3040], emoji: "🌙" },
      { name: "Mahabaleshwar Temple", coords: [14.5489, 74.3193], emoji: "🛕" },
      { name: "Paradise Beach", coords: [14.5080, 74.3060], emoji: "🏝️" },
    ],
    suggestions: [
      { name: "Om Beach", emoji: "🏖️" },
      { name: "Kudle Beach", emoji: "🌊" },
      { name: "Half Moon Beach", emoji: "🌙" },
      { name: "Mahabaleshwar Temple", emoji: "🛕" },
      { name: "Paradise Beach", emoji: "🏝️" },
    ]
  },
  dandeli: {
    name: "Dandeli",
    coords: [15.2483, 74.6217],
    zoom: 12,
    spots: [
      { name: "Kali River", coords: [15.2500, 74.6200], emoji: "🌊" },
      { name: "Syntheri Rocks", coords: [15.2800, 74.5800], emoji: "🗿" },
      { name: "Dandeli Wildlife", coords: [15.2700, 74.6300], emoji: "🐅" },
      { name: "Supa Dam", coords: [15.2100, 74.5600], emoji: "💧" },
      { name: "Kavala Caves", coords: [15.3000, 74.5500], emoji: "🦇" },
    ],
    suggestions: [
      { name: "Kali River", emoji: "🌊" },
      { name: "Syntheri Rocks", emoji: "🗿" },
      { name: "Dandeli Wildlife", emoji: "🐅" },
      { name: "Supa Dam", emoji: "💧" },
      { name: "Kavala Caves", emoji: "🦇" },
    ]
  },

  // ══════════════════════════════════════════════════════════
  // TAMIL NADU CITIES
  // ══════════════════════════════════════════════════════════
  chennai: {
    name: "Chennai",
    coords: [13.0827, 80.2707],
    zoom: 12,
    spots: [
      { name: "Marina Beach", coords: [13.0500, 80.2824], emoji: "🏖️" },
      { name: "Kapaleeshwarar Temple", coords: [13.0339, 80.2697], emoji: "🛕" },
      { name: "Fort St. George", coords: [13.0790, 80.2870], emoji: "🏰" },
      { name: "San Thome Basilica", coords: [13.0329, 80.2780], emoji: "⛪" },
      { name: "Mahabalipuram", coords: [12.6169, 80.1929], emoji: "🗿" },
      { name: "Guindy National Park", coords: [13.0067, 80.2200], emoji: "🌿" },
    ],
    suggestions: [
      { name: "Marina Beach", emoji: "🏖️" },
      { name: "Kapaleeshwarar Temple", emoji: "🛕" },
      { name: "Fort St. George", emoji: "🏰" },
      { name: "San Thome Basilica", emoji: "⛪" },
      { name: "Mahabalipuram", emoji: "🗿" },
      { name: "Guindy National Park", emoji: "🌿" },
    ]
  },
  pondicherry: {
    name: "Pondicherry",
    coords: [11.9416, 79.8083],
    zoom: 13,
    spots: [
      { name: "Promenade Beach", coords: [11.9340, 79.8360], emoji: "🏖️" },
      { name: "Auroville", coords: [12.0064, 79.8105], emoji: "🌐" },
      { name: "French Quarter", coords: [11.9350, 79.8340], emoji: "🇫🇷" },
      { name: "Sri Aurobindo Ashram", coords: [11.9330, 79.8350], emoji: "🕉️" },
      { name: "Paradise Beach", coords: [11.9000, 79.8400], emoji: "🏝️" },
      { name: "Cafe Culture", coords: [11.9340, 79.8320], emoji: "☕" },
    ],
    suggestions: [
      { name: "Promenade Beach", emoji: "🏖️" },
      { name: "Auroville", emoji: "🌐" },
      { name: "French Quarter", emoji: "🇫🇷" },
      { name: "Sri Aurobindo Ashram", emoji: "🕉️" },
      { name: "Paradise Beach", emoji: "🏝️" },
      { name: "Cafe Culture", emoji: "☕" },
    ]
  },
  ooty: {
    name: "Ooty",
    coords: [11.4102, 76.6950],
    zoom: 13,
    spots: [
      { name: "Ooty Lake", coords: [11.4100, 76.6937], emoji: "🌊" },
      { name: "Botanical Gardens", coords: [11.4145, 76.7005], emoji: "🌺" },
      { name: "Doddabetta Peak", coords: [11.4017, 76.7350], emoji: "🏔️" },
      { name: "Toy Train", coords: [11.4130, 76.6980], emoji: "🚂" },
      { name: "Tea Factory", coords: [11.4200, 76.7100], emoji: "🍵" },
      { name: "Rose Garden", coords: [11.4113, 76.7025], emoji: "🌹" },
    ],
    suggestions: [
      { name: "Ooty Lake", emoji: "🌊" },
      { name: "Botanical Gardens", emoji: "🌺" },
      { name: "Doddabetta Peak", emoji: "🏔️" },
      { name: "Toy Train", emoji: "🚂" },
      { name: "Tea Factory", emoji: "🍵" },
      { name: "Rose Garden", emoji: "🌹" },
    ]
  },
  madurai: {
    name: "Madurai",
    coords: [9.9252, 78.1198],
    zoom: 13,
    spots: [
      { name: "Meenakshi Temple", coords: [9.9195, 78.1193], emoji: "🛕" },
      { name: "Thirumalai Nayak Palace", coords: [9.9162, 78.1224], emoji: "🏯" },
      { name: "Gandhi Memorial Museum", coords: [9.9200, 78.1300], emoji: "🏛️" },
      { name: "Vaigai Dam", coords: [10.0500, 77.5700], emoji: "💧" },
      { name: "Alagar Koil", coords: [10.0600, 78.0800], emoji: "🛕" },
    ],
    suggestions: [
      { name: "Meenakshi Temple", emoji: "🛕" },
      { name: "Thirumalai Nayak Palace", emoji: "🏯" },
      { name: "Gandhi Memorial Museum", emoji: "🏛️" },
      { name: "Vaigai Dam", emoji: "💧" },
      { name: "Alagar Koil", emoji: "🛕" },
    ]
  },
  kodaikanal: {
    name: "Kodaikanal",
    coords: [10.2381, 77.4892],
    zoom: 13,
    spots: [
      { name: "Kodai Lake", coords: [10.2360, 77.4860], emoji: "🌊" },
      { name: "Coaker's Walk", coords: [10.2340, 77.4880], emoji: "🌲" },
      { name: "Pillar Rocks", coords: [10.2230, 77.4740], emoji: "🗿" },
      { name: "Bryant Park", coords: [10.2330, 77.4890], emoji: "🌺" },
      { name: "Silver Cascade Falls", coords: [10.2100, 77.5400], emoji: "💧" },
    ],
    suggestions: [
      { name: "Kodai Lake", emoji: "🌊" },
      { name: "Coaker's Walk", emoji: "🌲" },
      { name: "Pillar Rocks", emoji: "🗿" },
      { name: "Bryant Park", emoji: "🌺" },
      { name: "Silver Cascade Falls", emoji: "💧" },
    ]
  },
  rameswaram: {
    name: "Rameswaram",
    coords: [9.2876, 79.3129],
    zoom: 13,
    spots: [
      { name: "Ramanathaswamy Temple", coords: [9.2885, 79.3173], emoji: "🛕" },
      { name: "Pamban Bridge", coords: [9.2800, 79.2200], emoji: "🌉" },
      { name: "Dhanushkodi", coords: [9.1720, 79.4250], emoji: "🏝️" },
      { name: "Agnitheertham", coords: [9.2890, 79.3190], emoji: "🌊" },
      { name: "APJ Abdul Kalam Memorial", coords: [9.2800, 79.3100], emoji: "🏛️" },
    ],
    suggestions: [
      { name: "Ramanathaswamy Temple", emoji: "🛕" },
      { name: "Pamban Bridge", emoji: "🌉" },
      { name: "Dhanushkodi", emoji: "🏝️" },
      { name: "Agnitheertham", emoji: "🌊" },
      { name: "APJ Abdul Kalam Memorial", emoji: "🏛️" },
    ]
  },

  // ══════════════════════════════════════════════════════════
  // MAHARASHTRA CITIES
  // ══════════════════════════════════════════════════════════
  mumbai: {
    name: "Mumbai",
    coords: [19.0760, 72.8777],
    zoom: 12,
    spots: [
      { name: "Gateway of India", coords: [18.9220, 72.8347], emoji: "🏛️" },
      { name: "Marine Drive", coords: [18.9432, 72.8237], emoji: "🌊" },
      { name: "Elephanta Caves", coords: [18.9633, 72.9315], emoji: "🗿" },
      { name: "Juhu Beach", coords: [19.0988, 72.8264], emoji: "🏖️" },
      { name: "CST Station", coords: [18.9400, 72.8356], emoji: "🚂" },
      { name: "Haji Ali Dargah", coords: [18.9827, 72.8089], emoji: "🕌" },
    ],
    suggestions: [
      { name: "Gateway of India", emoji: "🏛️" },
      { name: "Marine Drive", emoji: "🌊" },
      { name: "Elephanta Caves", emoji: "🗿" },
      { name: "Juhu Beach", emoji: "🏖️" },
      { name: "CST Station", emoji: "🚂" },
      { name: "Haji Ali Dargah", emoji: "🕌" },
    ]
  },
  pune: {
    name: "Pune",
    coords: [18.5204, 73.8567],
    zoom: 12,
    spots: [
      { name: "Shaniwar Wada", coords: [18.5195, 73.8553], emoji: "🏰" },
      { name: "Aga Khan Palace", coords: [18.5525, 73.9021], emoji: "🏯" },
      { name: "Sinhagad Fort", coords: [18.3659, 73.7559], emoji: "🏰" },
      { name: "Dagdusheth Temple", coords: [18.5168, 73.8565], emoji: "🛕" },
      { name: "Pataleshwar Caves", coords: [18.5217, 73.8447], emoji: "🗿" },
    ],
    suggestions: [
      { name: "Shaniwar Wada", emoji: "🏰" },
      { name: "Aga Khan Palace", emoji: "🏯" },
      { name: "Sinhagad Fort", emoji: "🏰" },
      { name: "Dagdusheth Temple", emoji: "🛕" },
      { name: "Pataleshwar Caves", emoji: "🗿" },
    ]
  },
  lonavala: {
    name: "Lonavala",
    coords: [18.7546, 73.4062],
    zoom: 13,
    spots: [
      { name: "Tiger's Leap", coords: [18.7200, 73.4200], emoji: "🐯" },
      { name: "Bhushi Dam", coords: [18.7450, 73.4620], emoji: "💧" },
      { name: "Karla Caves", coords: [18.7700, 73.4700], emoji: "🗿" },
      { name: "Rajmachi Fort", coords: [18.8300, 73.3900], emoji: "🏰" },
      { name: "Lonavala Lake", coords: [18.7530, 73.3900], emoji: "🌊" },
    ],
    suggestions: [
      { name: "Tiger's Leap", emoji: "🐯" },
      { name: "Bhushi Dam", emoji: "💧" },
      { name: "Karla Caves", emoji: "🗿" },
      { name: "Rajmachi Fort", emoji: "🏰" },
      { name: "Lonavala Lake", emoji: "🌊" },
    ]
  },
  mahabaleshwar: {
    name: "Mahabaleshwar",
    coords: [17.9307, 73.6477],
    zoom: 13,
    spots: [
      { name: "Arthur's Seat", coords: [17.9400, 73.6300], emoji: "🏔️" },
      { name: "Venna Lake", coords: [17.9270, 73.6510], emoji: "🌊" },
      { name: "Mapro Garden", coords: [17.9150, 73.6600], emoji: "🍓" },
      { name: "Elephant's Head Point", coords: [17.9350, 73.6350], emoji: "🐘" },
      { name: "Pratapgarh Fort", coords: [17.9350, 73.5800], emoji: "🏰" },
    ],
    suggestions: [
      { name: "Arthur's Seat", emoji: "🏔️" },
      { name: "Venna Lake", emoji: "🌊" },
      { name: "Mapro Garden", emoji: "🍓" },
      { name: "Elephant's Head Point", emoji: "🐘" },
      { name: "Pratapgarh Fort", emoji: "🏰" },
    ]
  },
  ajantaellora: {
    name: "Ajanta & Ellora",
    coords: [20.0230, 75.1790],
    zoom: 11,
    spots: [
      { name: "Ajanta Caves", coords: [20.5519, 75.7033], emoji: "🗿" },
      { name: "Ellora Caves", coords: [20.0258, 75.1780], emoji: "🗿" },
      { name: "Kailasa Temple", coords: [20.0258, 75.1790], emoji: "🛕" },
      { name: "Bibi Ka Maqbara", coords: [19.9015, 75.3186], emoji: "🏛️" },
      { name: "Daulatabad Fort", coords: [19.9400, 75.2200], emoji: "🏰" },
    ],
    suggestions: [
      { name: "Ajanta Caves", emoji: "🗿" },
      { name: "Ellora Caves", emoji: "🗿" },
      { name: "Kailasa Temple", emoji: "🛕" },
      { name: "Bibi Ka Maqbara", emoji: "🏛️" },
      { name: "Daulatabad Fort", emoji: "🏰" },
    ]
  },
  konkan: {
    name: "Konkan",
    coords: [16.8524, 73.3963],
    zoom: 10,
    spots: [
      { name: "Tarkarli Beach", coords: [16.0300, 73.4700], emoji: "🏖️" },
      { name: "Ganpatipule", coords: [17.1450, 73.2650], emoji: "🛕" },
      { name: "Sindhudurg Fort", coords: [16.0435, 73.4500], emoji: "🏰" },
      { name: "Dapoli Beach", coords: [17.7500, 73.1900], emoji: "🌊" },
      { name: "Ratnagiri Beach", coords: [16.9900, 73.3000], emoji: "🏖️" },
    ],
    suggestions: [
      { name: "Tarkarli Beach", emoji: "🏖️" },
      { name: "Ganpatipule", emoji: "🛕" },
      { name: "Sindhudurg Fort", emoji: "🏰" },
      { name: "Dapoli Beach", emoji: "🌊" },
      { name: "Ratnagiri Beach", emoji: "🏖️" },
    ]
  },

  // ══════════════════════════════════════════════════════════
  // WEST BENGAL CITIES
  // ══════════════════════════════════════════════════════════
  kolkata: {
    name: "Kolkata",
    coords: [22.5726, 88.3639],
    zoom: 12,
    spots: [
      { name: "Victoria Memorial", coords: [22.5448, 88.3426], emoji: "🏛️" },
      { name: "Howrah Bridge", coords: [22.5851, 88.3468], emoji: "🌉" },
      { name: "Dakshineswar Kali Temple", coords: [22.6548, 88.3575], emoji: "🛕" },
      { name: "Park Street", coords: [22.5540, 88.3600], emoji: "🛍️" },
      { name: "Indian Museum", coords: [22.5580, 88.3515], emoji: "🏛️" },
      { name: "Kumartuli", coords: [22.5938, 88.3610], emoji: "🎨" },
    ],
    suggestions: [
      { name: "Victoria Memorial", emoji: "🏛️" },
      { name: "Howrah Bridge", emoji: "🌉" },
      { name: "Dakshineswar Kali Temple", emoji: "🛕" },
      { name: "Park Street", emoji: "🛍️" },
      { name: "Indian Museum", emoji: "🏛️" },
      { name: "Kumartuli", emoji: "🎨" },
    ]
  },
  darjeeling: {
    name: "Darjeeling",
    coords: [27.0410, 88.2663],
    zoom: 13,
    spots: [
      { name: "Tiger Hill", coords: [26.9975, 88.2701], emoji: "🌅" },
      { name: "Batasia Loop", coords: [27.0230, 88.2690], emoji: "🚂" },
      { name: "Tea Garden", coords: [27.0350, 88.2800], emoji: "🍵" },
      { name: "Peace Pagoda", coords: [27.0480, 88.2550], emoji: "☮️" },
      { name: "Himalayan Railway", coords: [27.0410, 88.2663], emoji: "🚂" },
    ],
    suggestions: [
      { name: "Tiger Hill", emoji: "🌅" },
      { name: "Batasia Loop", emoji: "🚂" },
      { name: "Tea Garden", emoji: "🍵" },
      { name: "Peace Pagoda", emoji: "☮️" },
      { name: "Himalayan Railway", emoji: "🚂" },
    ]
  },
  sundarbans: {
    name: "Sundarbans",
    coords: [21.9497, 89.1833],
    zoom: 10,
    spots: [
      { name: "Sundarbans Tiger Reserve", coords: [21.9500, 89.1800], emoji: "🐯" },
      { name: "Sajnekhali Watch Tower", coords: [22.1200, 88.8300], emoji: "🏗️" },
      { name: "Dobanki Watch Tower", coords: [22.0900, 88.7600], emoji: "🌿" },
      { name: "Sudhanyakhali", coords: [22.1100, 88.8800], emoji: "🐊" },
      { name: "Mangrove Forest", coords: [21.9500, 89.2000], emoji: "🌲" },
    ],
    suggestions: [
      { name: "Sundarbans Tiger Reserve", emoji: "🐯" },
      { name: "Sajnekhali Watch Tower", emoji: "🏗️" },
      { name: "Dobanki Watch Tower", emoji: "🌿" },
      { name: "Sudhanyakhali", emoji: "🐊" },
      { name: "Mangrove Forest", emoji: "🌲" },
    ]
  },
  shantiniketan: {
    name: "Shantiniketan",
    coords: [23.6858, 87.6853],
    zoom: 14,
    spots: [
      { name: "Visva-Bharati University", coords: [23.6810, 87.6860], emoji: "📚" },
      { name: "Kala Bhavan", coords: [23.6830, 87.6840], emoji: "🎨" },
      { name: "Amar Kutir", coords: [23.6900, 87.6900], emoji: "🏠" },
      { name: "Sonajhuri Forest", coords: [23.6950, 87.6750], emoji: "🌲" },
      { name: "Tagore's Ashram", coords: [23.6850, 87.6850], emoji: "📖" },
    ],
    suggestions: [
      { name: "Visva-Bharati University", emoji: "📚" },
      { name: "Kala Bhavan", emoji: "🎨" },
      { name: "Amar Kutir", emoji: "🏠" },
      { name: "Sonajhuri Forest", emoji: "🌲" },
      { name: "Tagore's Ashram", emoji: "📖" },
    ]
  },

  // ══════════════════════════════════════════════════════════
  // PUNJAB CITIES
  // ══════════════════════════════════════════════════════════
  amritsar: {
    name: "Amritsar",
    coords: [31.6340, 74.8723],
    zoom: 13,
    spots: [
      { name: "Golden Temple", coords: [31.6200, 74.8765], emoji: "🛕" },
      { name: "Jallianwala Bagh", coords: [31.6210, 74.8800], emoji: "🏛️" },
      { name: "Wagah Border", coords: [31.6050, 74.5730], emoji: "🇮🇳" },
      { name: "Partition Museum", coords: [31.6328, 74.8682], emoji: "🏛️" },
      { name: "Gobindgarh Fort", coords: [31.6316, 74.8718], emoji: "🏰" },
    ],
    suggestions: [
      { name: "Golden Temple", emoji: "🛕" },
      { name: "Jallianwala Bagh", emoji: "🏛️" },
      { name: "Wagah Border", emoji: "🇮🇳" },
      { name: "Partition Museum", emoji: "🏛️" },
      { name: "Gobindgarh Fort", emoji: "🏰" },
    ]
  },
  chandigarh: {
    name: "Chandigarh",
    coords: [30.7333, 76.7794],
    zoom: 12,
    spots: [
      { name: "Rock Garden", coords: [30.7525, 76.8054], emoji: "🗿" },
      { name: "Sukhna Lake", coords: [30.7421, 76.8139], emoji: "🌊" },
      { name: "Rose Garden", coords: [30.7487, 76.7831], emoji: "🌹" },
      { name: "Capitol Complex", coords: [30.7595, 76.8003], emoji: "🏛️" },
      { name: "Elante Mall", coords: [30.7066, 76.8020], emoji: "🛍️" },
    ],
    suggestions: [
      { name: "Rock Garden", emoji: "🗿" },
      { name: "Sukhna Lake", emoji: "🌊" },
      { name: "Rose Garden", emoji: "🌹" },
      { name: "Capitol Complex", emoji: "🏛️" },
      { name: "Elante Mall", emoji: "🛍️" },
    ]
  },

  // ══════════════════════════════════════════════════════════
  // GUJARAT CITIES
  // ══════════════════════════════════════════════════════════
  ahmedabad: {
    name: "Ahmedabad",
    coords: [23.0225, 72.5714],
    zoom: 12,
    spots: [
      { name: "Sabarmati Ashram", coords: [23.0607, 72.5806], emoji: "🕉️" },
      { name: "Adalaj Stepwell", coords: [23.1700, 72.5860], emoji: "💧" },
      { name: "Sidi Saiyyed Mosque", coords: [23.0256, 72.5816], emoji: "🕌" },
      { name: "Kankaria Lake", coords: [22.9940, 72.6021], emoji: "🌊" },
      { name: "Law Garden Market", coords: [23.0312, 72.5600], emoji: "🛍️" },
    ],
    suggestions: [
      { name: "Sabarmati Ashram", emoji: "🕉️" },
      { name: "Adalaj Stepwell", emoji: "💧" },
      { name: "Sidi Saiyyed Mosque", emoji: "🕌" },
      { name: "Kankaria Lake", emoji: "🌊" },
      { name: "Law Garden Market", emoji: "🛍️" },
    ]
  },
  rannofkutch: {
    name: "Rann of Kutch",
    coords: [23.7337, 69.8597],
    zoom: 9,
    spots: [
      { name: "White Rann", coords: [23.9000, 69.8000], emoji: "🌕" },
      { name: "Dhordo Village", coords: [23.8200, 69.6800], emoji: "🏘️" },
      { name: "Kala Dungar", coords: [23.9700, 69.5300], emoji: "⛰️" },
      { name: "Kutch Museum", coords: [23.2400, 69.6700], emoji: "🏛️" },
      { name: "Mandvi Beach", coords: [22.8300, 69.3600], emoji: "🏖️" },
    ],
    suggestions: [
      { name: "White Rann", emoji: "🌕" },
      { name: "Dhordo Village", emoji: "🏘️" },
      { name: "Kala Dungar", emoji: "⛰️" },
      { name: "Kutch Museum", emoji: "🏛️" },
      { name: "Mandvi Beach", emoji: "🏖️" },
    ]
  },
  somnath: {
    name: "Somnath",
    coords: [20.8880, 70.4012],
    zoom: 14,
    spots: [
      { name: "Somnath Temple", coords: [20.8880, 70.4012], emoji: "🛕" },
      { name: "Somnath Beach", coords: [20.8870, 70.4000], emoji: "🏖️" },
      { name: "Bhalka Tirth", coords: [20.9060, 70.4200], emoji: "🛕" },
      { name: "Triveni Sangam", coords: [20.8800, 70.3900], emoji: "🌊" },
    ],
    suggestions: [
      { name: "Somnath Temple", emoji: "🛕" },
      { name: "Somnath Beach", emoji: "🏖️" },
      { name: "Bhalka Tirth", emoji: "🛕" },
      { name: "Triveni Sangam", emoji: "🌊" },
    ]
  },
  dwarka: {
    name: "Dwarka",
    coords: [22.2394, 68.9678],
    zoom: 13,
    spots: [
      { name: "Dwarkadhish Temple", coords: [22.2376, 68.9681], emoji: "🛕" },
      { name: "Nageshwar Temple", coords: [22.3389, 68.9942], emoji: "🛕" },
      { name: "Bet Dwarka", coords: [22.4572, 69.0842], emoji: "🏝️" },
      { name: "Gomti Ghat", coords: [22.2370, 68.9670], emoji: "🌊" },
      { name: "Rukmini Temple", coords: [22.2600, 68.9600], emoji: "🛕" },
    ],
    suggestions: [
      { name: "Dwarkadhish Temple", emoji: "🛕" },
      { name: "Nageshwar Temple", emoji: "🛕" },
      { name: "Bet Dwarka", emoji: "🏝️" },
      { name: "Gomti Ghat", emoji: "🌊" },
      { name: "Rukmini Temple", emoji: "🛕" },
    ]
  },
  girforest: {
    name: "Gir Forest",
    coords: [21.1243, 70.7942],
    zoom: 11,
    spots: [
      { name: "Gir National Park", coords: [21.1243, 70.7942], emoji: "🦁" },
      { name: "Kamleshwar Dam", coords: [21.1800, 70.7500], emoji: "💧" },
      { name: "Sinh Sadan", coords: [21.1500, 70.8000], emoji: "🏕️" },
      { name: "Devalia Safari Park", coords: [21.1000, 70.8200], emoji: "🐆" },
      { name: "Tulsi Shyam", coords: [21.3500, 70.7000], emoji: "🛕" },
    ],
    suggestions: [
      { name: "Gir National Park", emoji: "🦁" },
      { name: "Kamleshwar Dam", emoji: "💧" },
      { name: "Sinh Sadan", emoji: "🏕️" },
      { name: "Devalia Safari Park", emoji: "🐆" },
      { name: "Tulsi Shyam", emoji: "🛕" },
    ]
  },

  // ══════════════════════════════════════════════════════════
  // JAMMU & KASHMIR CITIES
  // ══════════════════════════════════════════════════════════
  srinagar: {
    name: "Srinagar",
    coords: [34.0837, 74.7973],
    zoom: 12,
    spots: [
      { name: "Dal Lake", coords: [34.1070, 74.8500], emoji: "🌊" },
      { name: "Mughal Gardens", coords: [34.0870, 74.8350], emoji: "🌺" },
      { name: "Shankaracharya Temple", coords: [34.0830, 74.8400], emoji: "🛕" },
      { name: "Nishat Bagh", coords: [34.1084, 74.8802], emoji: "🌸" },
      { name: "Hazratbal Shrine", coords: [34.1260, 74.8380], emoji: "🕌" },
      { name: "Pari Mahal", coords: [34.0900, 74.8500], emoji: "🏯" },
    ],
    suggestions: [
      { name: "Dal Lake", emoji: "🌊" },
      { name: "Mughal Gardens", emoji: "🌺" },
      { name: "Shankaracharya Temple", emoji: "🛕" },
      { name: "Nishat Bagh", emoji: "🌸" },
      { name: "Hazratbal Shrine", emoji: "🕌" },
      { name: "Pari Mahal", emoji: "🏯" },
    ]
  },
  gulmarg: {
    name: "Gulmarg",
    coords: [34.0484, 74.3805],
    zoom: 13,
    spots: [
      { name: "Gulmarg Gondola", coords: [34.0400, 74.3900], emoji: "🚡" },
      { name: "Apharwat Peak", coords: [34.0200, 74.3600], emoji: "🏔️" },
      { name: "Gulmarg Golf Course", coords: [34.0490, 74.3800], emoji: "⛳" },
      { name: "Strawberry Valley", coords: [34.0550, 74.3700], emoji: "🍓" },
      { name: "Ningle Nallah", coords: [34.0600, 74.3500], emoji: "💧" },
    ],
    suggestions: [
      { name: "Gulmarg Gondola", emoji: "🚡" },
      { name: "Apharwat Peak", emoji: "🏔️" },
      { name: "Gulmarg Golf Course", emoji: "⛳" },
      { name: "Strawberry Valley", emoji: "🍓" },
      { name: "Ningle Nallah", emoji: "💧" },
    ]
  },
  pahalgam: {
    name: "Pahalgam",
    coords: [34.0161, 75.3150],
    zoom: 12,
    spots: [
      { name: "Betaab Valley", coords: [34.0300, 75.3500], emoji: "🌿" },
      { name: "Aru Valley", coords: [34.0900, 75.2800], emoji: "🏔️" },
      { name: "Lidder River", coords: [34.0200, 75.3200], emoji: "🌊" },
      { name: "Baisaran", coords: [34.0100, 75.3300], emoji: "🌲" },
      { name: "Mamaleshwar Temple", coords: [34.0150, 75.3100], emoji: "🛕" },
    ],
    suggestions: [
      { name: "Betaab Valley", emoji: "🌿" },
      { name: "Aru Valley", emoji: "🏔️" },
      { name: "Lidder River", emoji: "🌊" },
      { name: "Baisaran", emoji: "🌲" },
      { name: "Mamaleshwar Temple", emoji: "🛕" },
    ]
  },
  sonamarg: {
    name: "Sonamarg",
    coords: [34.3008, 75.2956],
    zoom: 12,
    spots: [
      { name: "Thajiwas Glacier", coords: [34.2800, 75.3000], emoji: "❄️" },
      { name: "Zoji La Pass", coords: [34.2900, 75.4900], emoji: "🏔️" },
      { name: "Baltal", coords: [34.2700, 75.3600], emoji: "🏕️" },
      { name: "Nilagrad River", coords: [34.3000, 75.3000], emoji: "🌊" },
      { name: "Sonamarg Meadows", coords: [34.3008, 75.2956], emoji: "🌿" },
    ],
    suggestions: [
      { name: "Thajiwas Glacier", emoji: "❄️" },
      { name: "Zoji La Pass", emoji: "🏔️" },
      { name: "Baltal", emoji: "🏕️" },
      { name: "Nilagrad River", emoji: "🌊" },
      { name: "Sonamarg Meadows", emoji: "🌿" },
    ]
  },

  // ══════════════════════════════════════════════════════════
  // LADAKH CITIES
  // ══════════════════════════════════════════════════════════
  leh: {
    name: "Leh",
    coords: [34.1526, 77.5771],
    zoom: 12,
    spots: [
      { name: "Leh Palace", coords: [34.1641, 77.5855], emoji: "🏯" },
      { name: "Shanti Stupa", coords: [34.1639, 77.5713], emoji: "☮️" },
      { name: "Magnetic Hill", coords: [34.2400, 77.4300], emoji: "🧲" },
      { name: "Hemis Monastery", coords: [33.9310, 77.7090], emoji: "🛕" },
      { name: "Khardung La", coords: [34.2818, 77.6023], emoji: "🏔️" },
      { name: "Hall of Fame", coords: [34.1900, 77.5600], emoji: "🏛️" },
    ],
    suggestions: [
      { name: "Leh Palace", emoji: "🏯" },
      { name: "Shanti Stupa", emoji: "☮️" },
      { name: "Magnetic Hill", emoji: "🧲" },
      { name: "Hemis Monastery", emoji: "🛕" },
      { name: "Khardung La", emoji: "🏔️" },
      { name: "Hall of Fame", emoji: "🏛️" },
    ]
  },
  pangonglake: {
    name: "Pangong Lake",
    coords: [33.7595, 78.6567],
    zoom: 10,
    spots: [
      { name: "Pangong Tso", coords: [33.7595, 78.6567], emoji: "🌊" },
      { name: "3 Idiots Point", coords: [33.7600, 78.6600], emoji: "🎬" },
      { name: "Chang La Pass", coords: [34.0600, 77.7900], emoji: "🏔️" },
      { name: "Spangmik Village", coords: [33.7700, 78.5800], emoji: "🏘️" },
    ],
    suggestions: [
      { name: "Pangong Tso", emoji: "🌊" },
      { name: "3 Idiots Point", emoji: "🎬" },
      { name: "Chang La Pass", emoji: "🏔️" },
      { name: "Spangmik Village", emoji: "🏘️" },
    ]
  },
  nubravalley: {
    name: "Nubra Valley",
    coords: [34.6857, 77.5714],
    zoom: 10,
    spots: [
      { name: "Diskit Monastery", coords: [34.5406, 77.5595], emoji: "🛕" },
      { name: "Hunder Sand Dunes", coords: [34.5800, 77.5300], emoji: "🐪" },
      { name: "Turtuk Village", coords: [34.8500, 76.8900], emoji: "🏘️" },
      { name: "Yarab Tso Lake", coords: [34.5200, 77.5700], emoji: "🌊" },
      { name: "Samstanling Monastery", coords: [34.5100, 77.5800], emoji: "🛕" },
    ],
    suggestions: [
      { name: "Diskit Monastery", emoji: "🛕" },
      { name: "Hunder Sand Dunes", emoji: "🐪" },
      { name: "Turtuk Village", emoji: "🏘️" },
      { name: "Yarab Tso Lake", emoji: "🌊" },
      { name: "Samstanling Monastery", emoji: "🛕" },
    ]
  },

  // ══════════════════════════════════════════════════════════
  // MEGHALAYA CITIES
  // ══════════════════════════════════════════════════════════
  shillong: {
    name: "Shillong",
    coords: [25.5788, 91.8933],
    zoom: 12,
    spots: [
      { name: "Umiam Lake", coords: [25.6500, 91.8800], emoji: "🌊" },
      { name: "Elephant Falls", coords: [25.5400, 91.8600], emoji: "💧" },
      { name: "Shillong Peak", coords: [25.5300, 91.8500], emoji: "🏔️" },
      { name: "Ward's Lake", coords: [25.5750, 91.8900], emoji: "🌺" },
      { name: "Police Bazaar", coords: [25.5780, 91.8920], emoji: "🛍️" },
    ],
    suggestions: [
      { name: "Umiam Lake", emoji: "🌊" },
      { name: "Elephant Falls", emoji: "💧" },
      { name: "Shillong Peak", emoji: "🏔️" },
      { name: "Ward's Lake", emoji: "🌺" },
      { name: "Police Bazaar", emoji: "🛍️" },
    ]
  },
  cherrapunji: {
    name: "Cherrapunji",
    coords: [25.2700, 91.7260],
    zoom: 12,
    spots: [
      { name: "Living Root Bridges", coords: [25.2530, 91.7400], emoji: "🌿" },
      { name: "Nohkalikai Falls", coords: [25.2700, 91.7300], emoji: "💧" },
      { name: "Seven Sisters Falls", coords: [25.2600, 91.7200], emoji: "💧" },
      { name: "Mawsmai Cave", coords: [25.2500, 91.7250], emoji: "🦇" },
      { name: "Double Decker Root Bridge", coords: [25.2500, 91.7380], emoji: "🌉" },
    ],
    suggestions: [
      { name: "Living Root Bridges", emoji: "🌿" },
      { name: "Nohkalikai Falls", emoji: "💧" },
      { name: "Seven Sisters Falls", emoji: "💧" },
      { name: "Mawsmai Cave", emoji: "🦇" },
      { name: "Double Decker Root Bridge", emoji: "🌉" },
    ]
  },
  dawki: {
    name: "Dawki",
    coords: [25.1858, 92.0182],
    zoom: 13,
    spots: [
      { name: "Umngot River", coords: [25.1858, 92.0182], emoji: "🌊" },
      { name: "Dawki Bridge", coords: [25.1850, 92.0180], emoji: "🌉" },
      { name: "Shnongpdeng", coords: [25.1900, 92.0300], emoji: "🏕️" },
      { name: "India-Bangladesh Border", coords: [25.1700, 92.0200], emoji: "🇮🇳" },
    ],
    suggestions: [
      { name: "Umngot River", emoji: "🌊" },
      { name: "Dawki Bridge", emoji: "🌉" },
      { name: "Shnongpdeng", emoji: "🏕️" },
      { name: "India-Bangladesh Border", emoji: "🇮🇳" },
    ]
  },

  // ══════════════════════════════════════════════════════════
  // ASSAM CITIES
  // ══════════════════════════════════════════════════════════
  guwahati: {
    name: "Guwahati",
    coords: [26.1445, 91.7362],
    zoom: 12,
    spots: [
      { name: "Kamakhya Temple", coords: [26.1663, 91.7051], emoji: "🛕" },
      { name: "Umananda Island", coords: [26.1900, 91.7300], emoji: "🏝️" },
      { name: "Assam State Museum", coords: [26.1700, 91.7400], emoji: "🏛️" },
      { name: "Pobitora Wildlife", coords: [26.2700, 91.9600], emoji: "🦏" },
      { name: "Brahmaputra River", coords: [26.1800, 91.7400], emoji: "🌊" },
    ],
    suggestions: [
      { name: "Kamakhya Temple", emoji: "🛕" },
      { name: "Umananda Island", emoji: "🏝️" },
      { name: "Assam State Museum", emoji: "🏛️" },
      { name: "Pobitora Wildlife", emoji: "🦏" },
      { name: "Brahmaputra River", emoji: "🌊" },
    ]
  },
  kaziranga: {
    name: "Kaziranga",
    coords: [26.5775, 93.1711],
    zoom: 11,
    spots: [
      { name: "Kaziranga National Park", coords: [26.5775, 93.1711], emoji: "🦏" },
      { name: "Central Range Safari", coords: [26.5800, 93.1700], emoji: "🐘" },
      { name: "Western Range", coords: [26.6200, 93.0500], emoji: "🌿" },
      { name: "Orchid Park", coords: [26.5700, 93.1800], emoji: "🌺" },
    ],
    suggestions: [
      { name: "Kaziranga National Park", emoji: "🦏" },
      { name: "Central Range Safari", emoji: "🐘" },
      { name: "Western Range", emoji: "🌿" },
      { name: "Orchid Park", emoji: "🌺" },
    ]
  },
  majuli: {
    name: "Majuli",
    coords: [26.9500, 94.1700],
    zoom: 11,
    spots: [
      { name: "Kamalabari Satra", coords: [26.9550, 94.1800], emoji: "🛕" },
      { name: "Auniati Satra", coords: [26.9600, 94.1700], emoji: "🎨" },
      { name: "Mishing Villages", coords: [26.9400, 94.1600], emoji: "🏘️" },
      { name: "Molai Forest", coords: [27.0100, 94.3000], emoji: "🌲" },
    ],
    suggestions: [
      { name: "Kamalabari Satra", emoji: "🛕" },
      { name: "Auniati Satra", emoji: "🎨" },
      { name: "Mishing Villages", emoji: "🏘️" },
      { name: "Molai Forest", emoji: "🌲" },
    ]
  },

  // ══════════════════════════════════════════════════════════
  // ODISHA CITIES
  // ══════════════════════════════════════════════════════════
  bhubaneswar: {
    name: "Bhubaneswar",
    coords: [20.2961, 85.8245],
    zoom: 12,
    spots: [
      { name: "Lingaraj Temple", coords: [20.2381, 85.8318], emoji: "🛕" },
      { name: "Udayagiri Caves", coords: [20.2600, 85.8200], emoji: "🗿" },
      { name: "Nandankanan Zoo", coords: [20.3950, 85.8239], emoji: "🐯" },
      { name: "Dhauli Shanti Stupa", coords: [20.2100, 85.8400], emoji: "☮️" },
      { name: "ISKCON Temple", coords: [20.3500, 85.8300], emoji: "🛕" },
    ],
    suggestions: [
      { name: "Lingaraj Temple", emoji: "🛕" },
      { name: "Udayagiri Caves", emoji: "🗿" },
      { name: "Nandankanan Zoo", emoji: "🐯" },
      { name: "Dhauli Shanti Stupa", emoji: "☮️" },
      { name: "ISKCON Temple", emoji: "🛕" },
    ]
  },
  puri: {
    name: "Puri",
    coords: [19.7983, 85.8249],
    zoom: 13,
    spots: [
      { name: "Jagannath Temple", coords: [19.8048, 85.8184], emoji: "🛕" },
      { name: "Puri Beach", coords: [19.7980, 85.8300], emoji: "🏖️" },
      { name: "Chilika Lake", coords: [19.7100, 85.3200], emoji: "🌊" },
      { name: "Konark Sun Temple", coords: [19.8876, 86.0945], emoji: "🛕" },
      { name: "Raghurajpur Heritage", coords: [19.8500, 85.7200], emoji: "🎨" },
    ],
    suggestions: [
      { name: "Jagannath Temple", emoji: "🛕" },
      { name: "Puri Beach", emoji: "🏖️" },
      { name: "Chilika Lake", emoji: "🌊" },
      { name: "Konark Sun Temple", emoji: "🛕" },
      { name: "Raghurajpur Heritage", emoji: "🎨" },
    ]
  },
  konark: {
    name: "Konark",
    coords: [19.8876, 86.0945],
    zoom: 13,
    spots: [
      { name: "Sun Temple", coords: [19.8876, 86.0945], emoji: "🛕" },
      { name: "Chandrabhaga Beach", coords: [19.8740, 86.1060], emoji: "🏖️" },
      { name: "ASI Museum", coords: [19.8870, 86.0950], emoji: "🏛️" },
      { name: "Ramchandi Temple", coords: [19.8800, 86.1200], emoji: "🛕" },
    ],
    suggestions: [
      { name: "Sun Temple", emoji: "🛕" },
      { name: "Chandrabhaga Beach", emoji: "🏖️" },
      { name: "ASI Museum", emoji: "🏛️" },
      { name: "Ramchandi Temple", emoji: "🛕" },
    ]
  },

  // ══════════════════════════════════════════════════════════
  // MADHYA PRADESH CITIES
  // ══════════════════════════════════════════════════════════
  indore: {
    name: "Indore",
    coords: [22.7196, 75.8577],
    zoom: 12,
    spots: [
      { name: "Sarafa Bazaar", coords: [22.7190, 75.8560], emoji: "🍛" },
      { name: "Rajwada Palace", coords: [22.7190, 75.8550], emoji: "🏯" },
      { name: "Lal Bagh Palace", coords: [22.7100, 75.8600], emoji: "🏰" },
      { name: "Patalpani Waterfall", coords: [22.6000, 75.7700], emoji: "💧" },
      { name: "56 Dukan", coords: [22.7150, 75.8500], emoji: "🛍️" },
    ],
    suggestions: [
      { name: "Sarafa Bazaar", emoji: "🍛" },
      { name: "Rajwada Palace", emoji: "🏯" },
      { name: "Lal Bagh Palace", emoji: "🏰" },
      { name: "Patalpani Waterfall", emoji: "💧" },
      { name: "56 Dukan", emoji: "🛍️" },
    ]
  },
  khajuraho: {
    name: "Khajuraho",
    coords: [24.8318, 79.9199],
    zoom: 13,
    spots: [
      { name: "Western Group Temples", coords: [24.8520, 79.9197], emoji: "🛕" },
      { name: "Kandariya Mahadeva", coords: [24.8510, 79.9200], emoji: "🛕" },
      { name: "Eastern Group Temples", coords: [24.8480, 79.9280], emoji: "🛕" },
      { name: "Light & Sound Show", coords: [24.8520, 79.9200], emoji: "🎭" },
      { name: "Raneh Falls", coords: [24.9100, 79.8300], emoji: "💧" },
    ],
    suggestions: [
      { name: "Western Group Temples", emoji: "🛕" },
      { name: "Kandariya Mahadeva", emoji: "🛕" },
      { name: "Eastern Group Temples", emoji: "🛕" },
      { name: "Light & Sound Show", emoji: "🎭" },
      { name: "Raneh Falls", emoji: "💧" },
    ]
  },
  ujjain: {
    name: "Ujjain",
    coords: [23.1765, 75.7885],
    zoom: 13,
    spots: [
      { name: "Mahakaleshwar Temple", coords: [23.1828, 75.7681], emoji: "🛕" },
      { name: "Ram Ghat", coords: [23.1850, 75.7650], emoji: "🪔" },
      { name: "Kal Bhairav Temple", coords: [23.1690, 75.7620], emoji: "🛕" },
      { name: "Vedha Shala", coords: [23.1800, 75.7700], emoji: "🔭" },
      { name: "Shipra River", coords: [23.1850, 75.7660], emoji: "🌊" },
    ],
    suggestions: [
      { name: "Mahakaleshwar Temple", emoji: "🛕" },
      { name: "Ram Ghat", emoji: "🪔" },
      { name: "Kal Bhairav Temple", emoji: "🛕" },
      { name: "Vedha Shala", emoji: "🔭" },
      { name: "Shipra River", emoji: "🌊" },
    ]
  },
  pachmarhi: {
    name: "Pachmarhi",
    coords: [22.4675, 78.4347],
    zoom: 12,
    spots: [
      { name: "Bee Falls", coords: [22.4700, 78.4200], emoji: "💧" },
      { name: "Pandav Caves", coords: [22.4650, 78.4350], emoji: "🗿" },
      { name: "Dhoopgarh", coords: [22.4400, 78.4200], emoji: "🌅" },
      { name: "Jata Shankar", coords: [22.4730, 78.4400], emoji: "🛕" },
      { name: "Satpura National Park", coords: [22.5200, 78.1200], emoji: "🐯" },
    ],
    suggestions: [
      { name: "Bee Falls", emoji: "💧" },
      { name: "Pandav Caves", emoji: "🗿" },
      { name: "Dhoopgarh", emoji: "🌅" },
      { name: "Jata Shankar", emoji: "🛕" },
      { name: "Satpura National Park", emoji: "🐯" },
    ]
  },
  sanchi: {
    name: "Sanchi",
    coords: [23.4793, 77.7399],
    zoom: 14,
    spots: [
      { name: "Great Stupa", coords: [23.4793, 77.7399], emoji: "🛕" },
      { name: "Sanchi Museum", coords: [23.4790, 77.7400], emoji: "🏛️" },
      { name: "Ashoka Pillar", coords: [23.4795, 77.7395], emoji: "🗿" },
      { name: "Monastery Ruins", coords: [23.4800, 77.7390], emoji: "🏚️" },
    ],
    suggestions: [
      { name: "Great Stupa", emoji: "🛕" },
      { name: "Sanchi Museum", emoji: "🏛️" },
      { name: "Ashoka Pillar", emoji: "🗿" },
      { name: "Monastery Ruins", emoji: "🏚️" },
    ]
  },

  // ══════════════════════════════════════════════════════════
  // ANDHRA PRADESH + TELANGANA
  // ══════════════════════════════════════════════════════════
  vizag: {
    name: "Visakhapatnam",
    coords: [17.6868, 83.2185],
    zoom: 12,
    spots: [
      { name: "RK Beach", coords: [17.7126, 83.3298], emoji: "🏖️" },
      { name: "Kailasagiri", coords: [17.7527, 83.3658], emoji: "⛰️" },
      { name: "Borra Caves", coords: [18.2703, 83.0374], emoji: "🦇" },
      { name: "Submarine Museum", coords: [17.7160, 83.3340], emoji: "🏛️" },
      { name: "Simhachalam Temple", coords: [17.7673, 83.2485], emoji: "🛕" },
    ],
    suggestions: [
      { name: "RK Beach", emoji: "🏖️" },
      { name: "Kailasagiri", emoji: "⛰️" },
      { name: "Borra Caves", emoji: "🦇" },
      { name: "Submarine Museum", emoji: "🏛️" },
      { name: "Simhachalam Temple", emoji: "🛕" },
    ]
  },
  tirupati: {
    name: "Tirupati",
    coords: [13.6288, 79.4192],
    zoom: 12,
    spots: [
      { name: "Tirumala Temple", coords: [13.6833, 79.3472], emoji: "🛕" },
      { name: "Sri Padmavathi Temple", coords: [13.6350, 79.4360], emoji: "🛕" },
      { name: "Talakona Waterfalls", coords: [13.7500, 79.2700], emoji: "💧" },
      { name: "Chandragiri Fort", coords: [13.5800, 79.3100], emoji: "🏰" },
      { name: "TTD Gardens", coords: [13.6800, 79.3500], emoji: "🌺" },
    ],
    suggestions: [
      { name: "Tirumala Temple", emoji: "🛕" },
      { name: "Sri Padmavathi Temple", emoji: "🛕" },
      { name: "Talakona Waterfalls", emoji: "💧" },
      { name: "Chandragiri Fort", emoji: "🏰" },
      { name: "TTD Gardens", emoji: "🌺" },
    ]
  },
  arakuvalley: {
    name: "Araku Valley",
    coords: [18.3273, 82.8759],
    zoom: 12,
    spots: [
      { name: "Tribal Museum", coords: [18.3270, 82.8760], emoji: "🏛️" },
      { name: "Coffee Plantations", coords: [18.3300, 82.8800], emoji: "☕" },
      { name: "Borra Caves", coords: [18.2703, 83.0374], emoji: "🦇" },
      { name: "Padmapuram Gardens", coords: [18.3250, 82.8700], emoji: "🌺" },
      { name: "Galikonda View Point", coords: [18.3400, 82.8900], emoji: "🏔️" },
    ],
    suggestions: [
      { name: "Tribal Museum", emoji: "🏛️" },
      { name: "Coffee Plantations", emoji: "☕" },
      { name: "Borra Caves", emoji: "🦇" },
      { name: "Padmapuram Gardens", emoji: "🌺" },
      { name: "Galikonda View Point", emoji: "🏔️" },
    ]
  },
  hyderabad: {
    name: "Hyderabad",
    coords: [17.3850, 78.4867],
    zoom: 12,
    spots: [
      { name: "Charminar", coords: [17.3616, 78.4747], emoji: "🕌" },
      { name: "Golconda Fort", coords: [17.3833, 78.4011], emoji: "🏰" },
      { name: "Hussain Sagar Lake", coords: [17.4239, 78.4738], emoji: "🌊" },
      { name: "Ramoji Film City", coords: [17.2543, 78.6808], emoji: "🎬" },
      { name: "Salar Jung Museum", coords: [17.3714, 78.4804], emoji: "🏛️" },
      { name: "Mecca Masjid", coords: [17.3604, 78.4736], emoji: "🕌" },
    ],
    suggestions: [
      { name: "Charminar", emoji: "🕌" },
      { name: "Golconda Fort", emoji: "🏰" },
      { name: "Hussain Sagar Lake", emoji: "🌊" },
      { name: "Ramoji Film City", emoji: "🎬" },
      { name: "Salar Jung Museum", emoji: "🏛️" },
      { name: "Mecca Masjid", emoji: "🕌" },
    ]
  },

  // ══════════════════════════════════════════════════════════
  // SIKKIM CITIES
  // ══════════════════════════════════════════════════════════
  gangtok: {
    name: "Gangtok",
    coords: [27.3389, 88.6065],
    zoom: 13,
    spots: [
      { name: "MG Marg", coords: [27.3310, 88.6100], emoji: "🛍️" },
      { name: "Rumtek Monastery", coords: [27.2880, 88.6490], emoji: "🛕" },
      { name: "Tsomgo Lake", coords: [27.3740, 88.7570], emoji: "🌊" },
      { name: "Nathula Pass", coords: [27.3867, 88.8300], emoji: "🏔️" },
      { name: "Hanuman Tok", coords: [27.3520, 88.6120], emoji: "🛕" },
    ],
    suggestions: [
      { name: "MG Marg", emoji: "🛍️" },
      { name: "Rumtek Monastery", emoji: "🛕" },
      { name: "Tsomgo Lake", emoji: "🌊" },
      { name: "Nathula Pass", emoji: "🏔️" },
      { name: "Hanuman Tok", emoji: "🛕" },
    ]
  },
  pelling: {
    name: "Pelling",
    coords: [27.3033, 88.2333],
    zoom: 13,
    spots: [
      { name: "Pemayangtse Monastery", coords: [27.2900, 88.2400], emoji: "🛕" },
      { name: "Kanchenjunga View", coords: [27.3030, 88.2330], emoji: "🏔️" },
      { name: "Rabdentse Ruins", coords: [27.2950, 88.2350], emoji: "🏚️" },
      { name: "Skywalk", coords: [27.3000, 88.2300], emoji: "🌁" },
      { name: "Khecheopalri Lake", coords: [27.3300, 88.1900], emoji: "🌊" },
    ],
    suggestions: [
      { name: "Pemayangtse Monastery", emoji: "🛕" },
      { name: "Kanchenjunga View", emoji: "🏔️" },
      { name: "Rabdentse Ruins", emoji: "🏚️" },
      { name: "Skywalk", emoji: "🌁" },
      { name: "Khecheopalri Lake", emoji: "🌊" },
    ]
  },
  ravangla: {
    name: "Ravangla",
    coords: [27.3100, 88.3633],
    zoom: 13,
    spots: [
      { name: "Buddha Park", coords: [27.3070, 88.3600], emoji: "☮️" },
      { name: "Ralang Monastery", coords: [27.2900, 88.3500], emoji: "🛕" },
      { name: "Maenam Hill", coords: [27.3300, 88.3800], emoji: "🏔️" },
      { name: "Kanchenjunga Viewpoint", coords: [27.3100, 88.3630], emoji: "🏔️" },
    ],
    suggestions: [
      { name: "Buddha Park", emoji: "☮️" },
      { name: "Ralang Monastery", emoji: "🛕" },
      { name: "Maenam Hill", emoji: "🏔️" },
      { name: "Kanchenjunga Viewpoint", emoji: "🏔️" },
    ]
  },

  // ══════════════════════════════════════════════════════════
  // NORTH EAST + REMAINING STATES (compact entries)
  // ══════════════════════════════════════════════════════════
  tawang: {
    name: "Tawang",
    coords: [27.5860, 91.8687],
    zoom: 12,
    spots: [
      { name: "Tawang Monastery", coords: [27.5870, 91.8630], emoji: "🛕" },
      { name: "Sela Pass", coords: [27.5000, 92.1000], emoji: "🏔️" },
      { name: "Madhuri Lake", coords: [27.5200, 92.0800], emoji: "🌊" },
      { name: "War Memorial", coords: [27.5850, 91.8700], emoji: "🏛️" },
    ],
    suggestions: [
      { name: "Tawang Monastery", emoji: "🛕" },
      { name: "Sela Pass", emoji: "🏔️" },
      { name: "Madhuri Lake", emoji: "🌊" },
      { name: "War Memorial", emoji: "🏛️" },
    ]
  },
  zirovalley: {
    name: "Ziro Valley",
    coords: [27.5444, 93.8311],
    zoom: 12,
    spots: [
      { name: "Ziro Paddy Fields", coords: [27.5440, 93.8310], emoji: "🌾" },
      { name: "Talley Valley", coords: [27.5800, 93.7800], emoji: "🌿" },
      { name: "Apatani Village", coords: [27.5400, 93.8300], emoji: "🏘️" },
      { name: "Ziro Music Festival", coords: [27.5450, 93.8300], emoji: "🎵" },
    ],
    suggestions: [
      { name: "Ziro Paddy Fields", emoji: "🌾" },
      { name: "Talley Valley", emoji: "🌿" },
      { name: "Apatani Village", emoji: "🏘️" },
      { name: "Ziro Music Festival", emoji: "🎵" },
    ]
  },
  varanasi: {
    name: "Varanasi",
    coords: [25.3176, 82.9739],
    zoom: 13,
    spots: [
      { name: "Dashashwamedh Ghat", coords: [25.3050, 83.0100], emoji: "🪔" },
      { name: "Kashi Vishwanath", coords: [25.3109, 83.0107], emoji: "🛕" },
      { name: "Manikarnika Ghat", coords: [25.3130, 83.0110], emoji: "🔥" },
      { name: "Assi Ghat", coords: [25.2870, 83.0070], emoji: "🕉️" },
      { name: "Sarnath", coords: [25.3813, 83.0228], emoji: "☮️" },
      { name: "BHU Campus", coords: [25.2677, 82.9913], emoji: "📚" },
    ],
    suggestions: [
      { name: "Dashashwamedh Ghat", emoji: "🪔" },
      { name: "Kashi Vishwanath", emoji: "🛕" },
      { name: "Manikarnika Ghat", emoji: "🔥" },
      { name: "Assi Ghat", emoji: "🕉️" },
      { name: "Sarnath", emoji: "☮️" },
      { name: "BHU Campus", emoji: "📚" },
    ]
  },
  agra: {
    name: "Agra",
    coords: [27.1767, 78.0081],
    zoom: 12,
    spots: [
      { name: "Taj Mahal", coords: [27.1751, 78.0421], emoji: "🕌" },
      { name: "Agra Fort", coords: [27.1795, 78.0211], emoji: "🏰" },
      { name: "Fatehpur Sikri", coords: [27.0940, 77.6600], emoji: "🏯" },
      { name: "Itimad-ud-Daulah", coords: [27.1927, 78.0310], emoji: "🏛️" },
      { name: "Mehtab Bagh", coords: [27.1800, 78.0470], emoji: "🌺" },
    ],
    suggestions: [
      { name: "Taj Mahal", emoji: "🕌" },
      { name: "Agra Fort", emoji: "🏰" },
      { name: "Fatehpur Sikri", emoji: "🏯" },
      { name: "Itimad-ud-Daulah", emoji: "🏛️" },
      { name: "Mehtab Bagh", emoji: "🌺" },
    ]
  },
  lucknow: {
    name: "Lucknow",
    coords: [26.8467, 80.9462],
    zoom: 12,
    spots: [
      { name: "Bara Imambara", coords: [26.8688, 80.9127], emoji: "🕌" },
      { name: "Chota Imambara", coords: [26.8710, 80.9150], emoji: "🕌" },
      { name: "British Residency", coords: [26.8623, 80.9232], emoji: "🏛️" },
      { name: "Rumi Darwaza", coords: [26.8691, 80.9112], emoji: "🏛️" },
      { name: "Hazratganj Market", coords: [26.8500, 80.9400], emoji: "🛍️" },
      { name: "Aminabad Food Street", coords: [26.8550, 80.9280], emoji: "🍛" },
    ],
    suggestions: [
      { name: "Bara Imambara", emoji: "🕌" },
      { name: "Chota Imambara", emoji: "🕌" },
      { name: "British Residency", emoji: "🏛️" },
      { name: "Rumi Darwaza", emoji: "🏛️" },
      { name: "Hazratganj Market", emoji: "🛍️" },
      { name: "Aminabad Food Street", emoji: "🍛" },
    ]
  },
  mathura: {
    name: "Mathura",
    coords: [27.4924, 77.6737],
    zoom: 13,
    spots: [
      { name: "Krishna Janmabhoomi", coords: [27.5028, 77.6741], emoji: "🛕" },
      { name: "Vishram Ghat", coords: [27.5050, 77.6720], emoji: "🪔" },
      { name: "Dwarkadhish Temple", coords: [27.5040, 77.6730], emoji: "🛕" },
      { name: "Govardhan Hill", coords: [27.4900, 77.4600], emoji: "⛰️" },
      { name: "Vrindavan Temples", coords: [27.5800, 77.7000], emoji: "🛕" },
    ],
    suggestions: [
      { name: "Krishna Janmabhoomi", emoji: "🛕" },
      { name: "Vishram Ghat", emoji: "🪔" },
      { name: "Dwarkadhish Temple", emoji: "🛕" },
      { name: "Govardhan Hill", emoji: "⛰️" },
      { name: "Vrindavan Temples", emoji: "🛕" },
    ]
  },
  prayagraj: {
    name: "Prayagraj",
    coords: [25.4358, 81.8463],
    zoom: 12,
    spots: [
      { name: "Triveni Sangam", coords: [25.4279, 81.8842], emoji: "🌊" },
      { name: "Allahabad Fort", coords: [25.4310, 81.8850], emoji: "🏰" },
      { name: "Anand Bhawan", coords: [25.4500, 81.8400], emoji: "🏛️" },
      { name: "Khusro Bagh", coords: [25.4430, 81.8370], emoji: "🌺" },
      { name: "Swaraj Bhawan", coords: [25.4510, 81.8390], emoji: "🏛️" },
    ],
    suggestions: [
      { name: "Triveni Sangam", emoji: "🌊" },
      { name: "Allahabad Fort", emoji: "🏰" },
      { name: "Anand Bhawan", emoji: "🏛️" },
      { name: "Khusro Bagh", emoji: "🌺" },
      { name: "Swaraj Bhawan", emoji: "🏛️" },
    ]
  },

  // ── Remaining compact entries ──
  kohima:      { name: "Kohima", coords: [25.6751, 94.1086], zoom: 13, spots: [{ name: "War Cemetery", coords: [25.6700, 94.1050], emoji: "🏛️" }, { name: "Kohima Museum", coords: [25.6710, 94.1060], emoji: "🏛️" }, { name: "Japfu Peak", coords: [25.6000, 94.0500], emoji: "🏔️" }, { name: "Dzükou Valley", coords: [25.5700, 94.1000], emoji: "🌸" }], suggestions: [{ name: "War Cemetery", emoji: "🏛️" }, { name: "Kohima Museum", emoji: "🏛️" }, { name: "Japfu Peak", emoji: "🏔️" }, { name: "Dzükou Valley", emoji: "🌸" }] },
  dimapur:     { name: "Dimapur", coords: [25.9024, 93.7266], zoom: 13, spots: [{ name: "Kachari Ruins", coords: [25.9000, 93.7300], emoji: "🗿" }, { name: "Rangapahar Reserve", coords: [25.8800, 93.7100], emoji: "🌿" }, { name: "Triple Falls", coords: [25.8700, 93.7000], emoji: "💧" }], suggestions: [{ name: "Kachari Ruins", emoji: "🗿" }, { name: "Rangapahar Reserve", emoji: "🌿" }, { name: "Triple Falls", emoji: "💧" }] },
  imphal:      { name: "Imphal", coords: [24.8170, 93.9368], zoom: 12, spots: [{ name: "Kangla Fort", coords: [24.8100, 93.9400], emoji: "🏰" }, { name: "Loktak Lake", coords: [24.5500, 93.8000], emoji: "🌊" }, { name: "INA Memorial", coords: [24.8200, 93.9300], emoji: "🏛️" }, { name: "Ima Keithel", coords: [24.8050, 93.9350], emoji: "🛍️" }], suggestions: [{ name: "Kangla Fort", emoji: "🏰" }, { name: "Loktak Lake", emoji: "🌊" }, { name: "INA Memorial", emoji: "🏛️" }, { name: "Ima Keithel", emoji: "🛍️" }] },
  loktaklake:  { name: "Loktak Lake", coords: [24.5500, 93.8000], zoom: 11, spots: [{ name: "Floating Islands", coords: [24.5500, 93.8000], emoji: "🏝️" }, { name: "Sendra Island", coords: [24.5400, 93.7900], emoji: "🌅" }, { name: "Keibul Lamjao", coords: [24.5200, 93.8100], emoji: "🦌" }], suggestions: [{ name: "Floating Islands", emoji: "🏝️" }, { name: "Sendra Island", emoji: "🌅" }, { name: "Keibul Lamjao", emoji: "🦌" }] },
  aizawl:      { name: "Aizawl", coords: [23.7271, 92.7176], zoom: 12, spots: [{ name: "Durtlang Hills", coords: [23.7800, 92.7200], emoji: "🏔️" }, { name: "Solomon's Temple", coords: [23.7300, 92.7100], emoji: "🛕" }, { name: "Bara Bazaar", coords: [23.7250, 92.7150], emoji: "🛍️" }, { name: "Reiek Heritage Village", coords: [23.6500, 92.6000], emoji: "🏘️" }], suggestions: [{ name: "Durtlang Hills", emoji: "🏔️" }, { name: "Solomon's Temple", emoji: "🛕" }, { name: "Bara Bazaar", emoji: "🛍️" }, { name: "Reiek Heritage Village", emoji: "🏘️" }] },
  agartala:    { name: "Agartala", coords: [23.8315, 91.2868], zoom: 12, spots: [{ name: "Ujjayanta Palace", coords: [23.8360, 91.2790], emoji: "🏯" }, { name: "Neermahal Palace", coords: [23.5160, 91.2620], emoji: "🏰" }, { name: "Unakoti", coords: [24.3200, 92.0700], emoji: "🗿" }], suggestions: [{ name: "Ujjayanta Palace", emoji: "🏯" }, { name: "Neermahal Palace", emoji: "🏰" }, { name: "Unakoti", emoji: "🗿" }] },
  neermahal:   { name: "Neermahal", coords: [23.5160, 91.2620], zoom: 13, spots: [{ name: "Neermahal Palace", coords: [23.5160, 91.2620], emoji: "🏰" }, { name: "Rudrasagar Lake", coords: [23.5200, 91.2600], emoji: "🌊" }, { name: "Melaghar", coords: [23.5000, 91.2500], emoji: "🏘️" }], suggestions: [{ name: "Neermahal Palace", emoji: "🏰" }, { name: "Rudrasagar Lake", emoji: "🌊" }, { name: "Melaghar", emoji: "🏘️" }] },
  jagdalpur:   { name: "Jagdalpur", coords: [19.0833, 82.0167], zoom: 12, spots: [{ name: "Chitrakote Falls", coords: [19.2031, 81.7010], emoji: "💧" }, { name: "Tirathgarh Falls", coords: [18.9800, 81.7200], emoji: "💧" }, { name: "Kutumsar Caves", coords: [18.8600, 81.9500], emoji: "🦇" }, { name: "Bastar Palace", coords: [19.0830, 82.0170], emoji: "🏯" }], suggestions: [{ name: "Chitrakote Falls", emoji: "💧" }, { name: "Tirathgarh Falls", emoji: "💧" }, { name: "Kutumsar Caves", emoji: "🦇" }, { name: "Bastar Palace", emoji: "🏯" }] },
  chitrakote:  { name: "Chitrakote Falls", coords: [19.2031, 81.7010], zoom: 13, spots: [{ name: "Chitrakote Falls", coords: [19.2031, 81.7010], emoji: "💧" }, { name: "Indravati River", coords: [19.2000, 81.7000], emoji: "🌊" }, { name: "Viewpoint", coords: [19.2040, 81.7020], emoji: "🌅" }], suggestions: [{ name: "Chitrakote Falls", emoji: "💧" }, { name: "Indravati River", emoji: "🌊" }, { name: "Viewpoint", emoji: "🌅" }] },
  ranchi:      { name: "Ranchi", coords: [23.3441, 85.3096], zoom: 12, spots: [{ name: "Hundru Falls", coords: [23.4300, 85.4400], emoji: "💧" }, { name: "Jonha Falls", coords: [23.3700, 85.5400], emoji: "💧" }, { name: "Ranchi Lake", coords: [23.3500, 85.3200], emoji: "🌊" }, { name: "Tagore Hill", coords: [23.3550, 85.3150], emoji: "⛰️" }], suggestions: [{ name: "Hundru Falls", emoji: "💧" }, { name: "Jonha Falls", emoji: "💧" }, { name: "Ranchi Lake", emoji: "🌊" }, { name: "Tagore Hill", emoji: "⛰️" }] },
  deoghar:     { name: "Deoghar", coords: [24.4904, 86.6942], zoom: 13, spots: [{ name: "Baidyanath Temple", coords: [24.4920, 86.7000], emoji: "🛕" }, { name: "Nandan Pahar", coords: [24.4800, 86.7050], emoji: "⛰️" }, { name: "Trikut Pahar", coords: [24.4400, 86.6800], emoji: "🏔️" }], suggestions: [{ name: "Baidyanath Temple", emoji: "🛕" }, { name: "Nandan Pahar", emoji: "⛰️" }, { name: "Trikut Pahar", emoji: "🏔️" }] },
  netarhat:    { name: "Netarhat", coords: [23.4800, 84.2700], zoom: 13, spots: [{ name: "Sunrise Point", coords: [23.4810, 84.2710], emoji: "🌅" }, { name: "Magnolia Point", coords: [23.4750, 84.2650], emoji: "🌸" }, { name: "Upper Ghaghri Falls", coords: [23.4700, 84.2800], emoji: "💧" }, { name: "Pine Forests", coords: [23.4800, 84.2700], emoji: "🌲" }], suggestions: [{ name: "Sunrise Point", emoji: "🌅" }, { name: "Magnolia Point", emoji: "🌸" }, { name: "Upper Ghaghri Falls", emoji: "💧" }, { name: "Pine Forests", emoji: "🌲" }] },
  bodhgaya:    { name: "Bodh Gaya", coords: [24.6961, 84.9869], zoom: 14, spots: [{ name: "Mahabodhi Temple", coords: [24.6961, 84.9913], emoji: "🛕" }, { name: "Bodhi Tree", coords: [24.6960, 84.9910], emoji: "🌳" }, { name: "Great Buddha Statue", coords: [24.6980, 84.9950], emoji: "☮️" }, { name: "Sujata Stupa", coords: [24.7000, 85.0000], emoji: "🛕" }], suggestions: [{ name: "Mahabodhi Temple", emoji: "🛕" }, { name: "Bodhi Tree", emoji: "🌳" }, { name: "Great Buddha Statue", emoji: "☮️" }, { name: "Sujata Stupa", emoji: "🛕" }] },
  rajgir:      { name: "Rajgir", coords: [25.0293, 85.4232], zoom: 13, spots: [{ name: "Vishwa Shanti Stupa", coords: [25.0150, 85.4300], emoji: "☮️" }, { name: "Griddhakuta Hill", coords: [25.0200, 85.4350], emoji: "🏔️" }, { name: "Hot Springs", coords: [25.0280, 85.4230], emoji: "♨️" }, { name: "Nalanda Ruins", coords: [25.1356, 85.4428], emoji: "🏛️" }], suggestions: [{ name: "Vishwa Shanti Stupa", emoji: "☮️" }, { name: "Griddhakuta Hill", emoji: "🏔️" }, { name: "Hot Springs", emoji: "♨️" }, { name: "Nalanda Ruins", emoji: "🏛️" }] },
  nalanda:     { name: "Nalanda", coords: [25.1356, 85.4428], zoom: 13, spots: [{ name: "Nalanda University Ruins", coords: [25.1356, 85.4428], emoji: "📚" }, { name: "Nalanda Museum", coords: [25.1350, 85.4420], emoji: "🏛️" }, { name: "Hiuen Tsang Memorial", coords: [25.1370, 85.4440], emoji: "🏛️" }], suggestions: [{ name: "Nalanda University Ruins", emoji: "📚" }, { name: "Nalanda Museum", emoji: "🏛️" }, { name: "Hiuen Tsang Memorial", emoji: "🏛️" }] },
  kurukshetra: { name: "Kurukshetra", coords: [29.9695, 76.8783], zoom: 13, spots: [{ name: "Brahma Sarovar", coords: [29.9680, 76.8700], emoji: "🌊" }, { name: "Krishna Museum", coords: [29.9700, 76.8780], emoji: "🏛️" }, { name: "Jyotisar", coords: [29.9650, 76.8350], emoji: "🛕" }, { name: "Panorama Centre", coords: [29.9690, 76.8790], emoji: "🎭" }], suggestions: [{ name: "Brahma Sarovar", emoji: "🌊" }, { name: "Krishna Museum", emoji: "🏛️" }, { name: "Jyotisar", emoji: "🛕" }, { name: "Panorama Centre", emoji: "🎭" }] },
  sultanpur:   { name: "Sultanpur Bird Sanctuary", coords: [28.4679, 76.8879], zoom: 13, spots: [{ name: "Bird Sanctuary", coords: [28.4679, 76.8879], emoji: "🦅" }, { name: "Watch Tower", coords: [28.4680, 76.8880], emoji: "🏗️" }, { name: "Nature Trail", coords: [28.4670, 76.8870], emoji: "🌿" }], suggestions: [{ name: "Bird Sanctuary", emoji: "🦅" }, { name: "Watch Tower", emoji: "🏗️" }, { name: "Nature Trail", emoji: "🌿" }] },
  portblair:   { name: "Port Blair", coords: [11.6234, 92.7265], zoom: 12, spots: [{ name: "Cellular Jail", coords: [11.6762, 92.7478], emoji: "🏰" }, { name: "Corbyn's Cove Beach", coords: [11.6400, 92.7500], emoji: "🏖️" }, { name: "Ross Island", coords: [11.6800, 92.7600], emoji: "🏝️" }, { name: "North Bay Island", coords: [11.7000, 92.7500], emoji: "🤿" }], suggestions: [{ name: "Cellular Jail", emoji: "🏰" }, { name: "Corbyn's Cove Beach", emoji: "🏖️" }, { name: "Ross Island", emoji: "🏝️" }, { name: "North Bay Island", emoji: "🤿" }] },
  havelock:    { name: "Havelock Island", coords: [11.9820, 92.9830], zoom: 12, spots: [{ name: "Radhanagar Beach", coords: [11.9700, 92.9400], emoji: "🏖️" }, { name: "Elephanta Beach", coords: [12.0200, 92.9900], emoji: "🤿" }, { name: "Kalapathar Beach", coords: [12.0100, 93.0000], emoji: "🌊" }], suggestions: [{ name: "Radhanagar Beach", emoji: "🏖️" }, { name: "Elephanta Beach", emoji: "🤿" }, { name: "Kalapathar Beach", emoji: "🌊" }] },
  neilisland:  { name: "Neil Island", coords: [11.8333, 93.0500], zoom: 13, spots: [{ name: "Natural Bridge", coords: [11.8200, 93.0600], emoji: "🗿" }, { name: "Bharatpur Beach", coords: [11.8350, 93.0550], emoji: "🏖️" }, { name: "Laxmanpur Beach", coords: [11.8300, 93.0400], emoji: "🌅" }], suggestions: [{ name: "Natural Bridge", emoji: "🗿" }, { name: "Bharatpur Beach", emoji: "🏖️" }, { name: "Laxmanpur Beach", emoji: "🌅" }] },
  kavaratti:   { name: "Kavaratti", coords: [10.5669, 72.6358], zoom: 13, spots: [{ name: "Kavaratti Beach", coords: [10.5670, 72.6360], emoji: "🏖️" }, { name: "Marine Aquarium", coords: [10.5660, 72.6350], emoji: "🐠" }, { name: "Ujra Mosque", coords: [10.5680, 72.6370], emoji: "🕌" }], suggestions: [{ name: "Kavaratti Beach", emoji: "🏖️" }, { name: "Marine Aquarium", emoji: "🐠" }, { name: "Ujra Mosque", emoji: "🕌" }] },
  bangaram:    { name: "Bangaram Island", coords: [10.9428, 72.2896], zoom: 14, spots: [{ name: "Bangaram Lagoon", coords: [10.9428, 72.2896], emoji: "🌊" }, { name: "Coral Reef", coords: [10.9430, 72.2900], emoji: "🐠" }, { name: "Beach Resort", coords: [10.9425, 72.2890], emoji: "🏝️" }], suggestions: [{ name: "Bangaram Lagoon", emoji: "🌊" }, { name: "Coral Reef", emoji: "🐠" }, { name: "Beach Resort", emoji: "🏝️" }] },
  agatti:      { name: "Agatti Island", coords: [10.8894, 72.1939], zoom: 14, spots: [{ name: "Agatti Beach", coords: [10.8894, 72.1939], emoji: "🏖️" }, { name: "Agatti Airport", coords: [10.8240, 72.1760], emoji: "✈️" }, { name: "Lagoon", coords: [10.8900, 72.1950], emoji: "🌊" }], suggestions: [{ name: "Agatti Beach", emoji: "🏖️" }, { name: "Lagoon", emoji: "🌊" }] },
}
