export const bestTimeData = {
  goa: {
    best: "October — March",
    avoid: "June — September (Monsoon)",
    current: "June", // we'll make this dynamic
    summary: "Goa is best enjoyed in winter when the weather is cool, dry and perfect for beaches. Monsoon brings heavy rains but also lush greenery and fewer crowds.",
    months: [
      { month: "Jan", rating: 5, label: "Perfect", note: "Cool & dry, peak season" },
      { month: "Feb", rating: 5, label: "Perfect", note: "Best beach weather" },
      { month: "Mar", rating: 4, label: "Good", note: "Getting warmer" },
      { month: "Apr", rating: 3, label: "Okay", note: "Hot & humid" },
      { month: "May", rating: 2, label: "Avoid", note: "Very hot, pre-monsoon" },
      { month: "Jun", rating: 1, label: "Avoid", note: "Heavy monsoon rains" },
      { month: "Jul", rating: 1, label: "Avoid", note: "Heaviest rainfall" },
      { month: "Aug", rating: 1, label: "Avoid", note: "Still raining heavily" },
      { month: "Sep", rating: 2, label: "Poor", note: "Rains reducing" },
      { month: "Oct", rating: 4, label: "Good", note: "Post monsoon, greenery" },
      { month: "Nov", rating: 5, label: "Perfect", note: "Season begins, festive" },
      { month: "Dec", rating: 5, label: "Perfect", note: "Peak season, Christmas" },
    ],
    tips: [
      "🏖️ Beach shacks open October to May only",
      "🎉 Sunburn Festival happens in December",
      "🌊 Water sports available October to March",
      "🐢 Olive Ridley turtles nest November to March",
    ]
  },

  manali: {
    best: "October — June",
    avoid: "July — September (Monsoon/Landslides)",
    summary: "Manali is a year-round destination but best avoided during monsoon due to landslides. Summer is great for trekking, winter for snow activities.",
    months: [
      { month: "Jan", rating: 4, label: "Snow!", note: "Heavy snow, great for skiing" },
      { month: "Feb", rating: 4, label: "Snow!", note: "Snowfall, Rohtang closed" },
      { month: "Mar", rating: 4, label: "Good", note: "Snow melting, beautiful" },
      { month: "Apr", rating: 5, label: "Perfect", note: "Pleasant, trekking begins" },
      { month: "May", rating: 5, label: "Perfect", note: "Best weather, Rohtang open" },
      { month: "Jun", rating: 5, label: "Perfect", note: "Peak summer, crowded" },
      { month: "Jul", rating: 2, label: "Risky", note: "Landslides, road blocks" },
      { month: "Aug", rating: 2, label: "Risky", note: "Heavy rains, dangerous" },
      { month: "Sep", rating: 3, label: "Okay", note: "Rains reducing" },
      { month: "Oct", rating: 5, label: "Perfect", note: "Clear skies, snow peaks" },
      { month: "Nov", rating: 3, label: "Cold", note: "Getting very cold" },
      { month: "Dec", rating: 3, label: "Snow!", note: "Snow activities begin" },
    ],
    tips: [
      "🏔️ Rohtang Pass open May to October only",
      "⚠️ July-August: Landslide risk on highway",
      "❄️ January-February: Perfect for snow activities",
      "🌸 April-June: Best for trekking and sightseeing",
    ]
  },

  kerala: {
    best: "September — March",
    avoid: "June — August (Heavy Monsoon)",
    summary: "Kerala has two monsoon seasons. The best time is post-monsoon when everything is lush and green. Backwaters are magical year-round except heavy monsoon.",
    months: [
      { month: "Jan", rating: 5, label: "Perfect", note: "Cool & dry, ideal" },
      { month: "Feb", rating: 5, label: "Perfect", note: "Best weather" },
      { month: "Mar", rating: 4, label: "Good", note: "Warm but pleasant" },
      { month: "Apr", rating: 3, label: "Okay", note: "Getting hot" },
      { month: "May", rating: 2, label: "Avoid", note: "Pre-monsoon, hot" },
      { month: "Jun", rating: 1, label: "Avoid", note: "Southwest monsoon begins" },
      { month: "Jul", rating: 1, label: "Avoid", note: "Heaviest rainfall" },
      { month: "Aug", rating: 2, label: "Poor", note: "Still heavy rains" },
      { month: "Sep", rating: 3, label: "Okay", note: "Rains reducing, green" },
      { month: "Oct", rating: 4, label: "Good", note: "Northeast monsoon starts" },
      { month: "Nov", rating: 4, label: "Good", note: "Onam festival season" },
      { month: "Dec", rating: 5, label: "Perfect", note: "Peak season, Christmas" },
    ],
    tips: [
      "🚢 Houseboat rides best October to February",
      "🐘 Thrissur Pooram festival in April/May",
      "🌊 Monsoon Ayurveda treatments are popular in June-August",
      "🦋 Eravikulam National Park closes Feb-March for calving",
    ]
  },

  rajasthan: {
    best: "October — March",
    avoid: "April — June (Extreme Heat)",
    summary: "Rajasthan is best in winter when the desert is cool and comfortable. Summer temperatures can exceed 45°C making sightseeing very difficult.",
    months: [
      { month: "Jan", rating: 5, label: "Perfect", note: "Cool desert, festivals" },
      { month: "Feb", rating: 5, label: "Perfect", note: "Ideal weather" },
      { month: "Mar", rating: 4, label: "Good", note: "Holi festival, warm" },
      { month: "Apr", rating: 2, label: "Hot", note: "Getting very hot 40°C+" },
      { month: "May", rating: 1, label: "Avoid", note: "Extreme heat 45°C+" },
      { month: "Jun", rating: 1, label: "Avoid", note: "Hottest month" },
      { month: "Jul", rating: 2, label: "Monsoon", note: "Some rain, still hot" },
      { month: "Aug", rating: 2, label: "Monsoon", note: "Rains, humidity" },
      { month: "Sep", rating: 3, label: "Okay", note: "Cooling down" },
      { month: "Oct", rating: 4, label: "Good", note: "Season begins" },
      { month: "Nov", rating: 5, label: "Perfect", note: "Pushkar fair, ideal" },
      { month: "Dec", rating: 5, label: "Perfect", note: "Peak season, cool nights" },
    ],
    tips: [
      "🐪 Pushkar Camel Fair happens in November",
      "🌡️ May-June: Temperatures can reach 48°C",
      "🎆 Diwali in October/November is magical in Jaipur",
      "🏰 Winter nights can be very cold — carry warm clothes",
    ]
  },
}