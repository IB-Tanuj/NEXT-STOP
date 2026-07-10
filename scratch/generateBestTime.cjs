const fs = require('fs');

const templates = {
  coastal: {
    best: "October — March",
    avoid: "June — September (Monsoon)",
    summary: "Best enjoyed in winter when the weather is cool, dry and perfect for beaches. Monsoon brings heavy rains but also lush greenery.",
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
      { month: "Dec", rating: 5, label: "Perfect", note: "Peak season" },
    ],
    tips: [
      "🏖️ Beach activities are best from October to May",
      "🌅 Sunsets are spectacular in the winter months",
      "🌊 Water sports might be closed during the monsoon",
    ]
  },
  himalayan: {
    best: "October — June",
    avoid: "July — September (Monsoon/Landslides)",
    summary: "A year-round destination but best avoided during monsoon due to landslides. Summer is great for trekking, winter for snow activities.",
    months: [
      { month: "Jan", rating: 4, label: "Snow!", note: "Heavy snow, great for winter sports" },
      { month: "Feb", rating: 4, label: "Snow!", note: "Snowfall continues" },
      { month: "Mar", rating: 4, label: "Good", note: "Snow melting, beautiful" },
      { month: "Apr", rating: 5, label: "Perfect", note: "Pleasant, trekking begins" },
      { month: "May", rating: 5, label: "Perfect", note: "Best weather, passes open" },
      { month: "Jun", rating: 5, label: "Perfect", note: "Peak summer, crowded" },
      { month: "Jul", rating: 2, label: "Risky", note: "Landslides, road blocks" },
      { month: "Aug", rating: 2, label: "Risky", note: "Heavy rains, dangerous" },
      { month: "Sep", rating: 3, label: "Okay", note: "Rains reducing" },
      { month: "Oct", rating: 5, label: "Perfect", note: "Clear skies, snow peaks visible" },
      { month: "Nov", rating: 3, label: "Cold", note: "Getting very cold" },
      { month: "Dec", rating: 3, label: "Snow!", note: "Snow activities begin" },
    ],
    tips: [
      "⚠️ July-August: Landslide risk on mountain roads",
      "❄️ January-February: Perfect for snow activities",
      "🌸 April-June: Best for trekking and sightseeing",
    ]
  },
  desert: {
    best: "October — March",
    avoid: "April — June (Extreme Heat)",
    summary: "Best visited in winter when the desert is cool and comfortable. Summer temperatures can exceed 45°C making sightseeing very difficult.",
    months: [
      { month: "Jan", rating: 5, label: "Perfect", note: "Cool desert, festivals" },
      { month: "Feb", rating: 5, label: "Perfect", note: "Ideal weather" },
      { month: "Mar", rating: 4, label: "Good", note: "Warm days, cool nights" },
      { month: "Apr", rating: 2, label: "Hot", note: "Getting very hot 40°C+" },
      { month: "May", rating: 1, label: "Avoid", note: "Extreme heat 45°C+" },
      { month: "Jun", rating: 1, label: "Avoid", note: "Hottest month" },
      { month: "Jul", rating: 2, label: "Monsoon", note: "Some rain, still hot" },
      { month: "Aug", rating: 2, label: "Monsoon", note: "Rains, humidity" },
      { month: "Sep", rating: 3, label: "Okay", note: "Cooling down" },
      { month: "Oct", rating: 4, label: "Good", note: "Season begins" },
      { month: "Nov", rating: 5, label: "Perfect", note: "Pleasant weather, ideal" },
      { month: "Dec", rating: 5, label: "Perfect", note: "Peak season, cool nights" },
    ],
    tips: [
      "🌡️ May-June: Temperatures can reach 48°C",
      "🏰 Winter nights can be very cold — carry warm clothes",
      "🐪 Best time for desert safaris is November to February",
    ]
  },
  plains: {
    best: "October — March",
    avoid: "May — June (Extreme Heat)",
    summary: "Best visited in winter when the weather is cool and pleasant. Summers are extremely hot, and monsoons can be humid.",
    months: [
      { month: "Jan", rating: 5, label: "Perfect", note: "Cool and pleasant" },
      { month: "Feb", rating: 5, label: "Perfect", note: "Ideal sightseeing weather" },
      { month: "Mar", rating: 4, label: "Good", note: "Getting warmer" },
      { month: "Apr", rating: 2, label: "Hot", note: "Hot and dry" },
      { month: "May", rating: 1, label: "Avoid", note: "Extreme heat waves" },
      { month: "Jun", rating: 1, label: "Avoid", note: "Very hot, pre-monsoon" },
      { month: "Jul", rating: 3, label: "Okay", note: "Monsoon showers bring relief" },
      { month: "Aug", rating: 3, label: "Okay", note: "Humid but green" },
      { month: "Sep", rating: 3, label: "Okay", note: "Rains subsiding" },
      { month: "Oct", rating: 4, label: "Good", note: "Pleasant autumn weather" },
      { month: "Nov", rating: 5, label: "Perfect", note: "Cool and comfortable" },
      { month: "Dec", rating: 5, label: "Perfect", note: "Cold mornings, sunny days" },
    ],
    tips: [
      "🌞 Always carry water and sunscreen during the day",
      "🏛️ Early mornings are best for monument visits",
      "🧣 Winters can get surprisingly chilly, pack a light jacket",
    ]
  },
  south_hills: {
    best: "September — March",
    avoid: "June — August (Heavy Monsoon)",
    summary: "Lush green hills that are pleasant year-round, but best visited post-monsoon. Heavy rains in monsoon can restrict outdoor activities.",
    months: [
      { month: "Jan", rating: 5, label: "Perfect", note: "Cool & dry, ideal" },
      { month: "Feb", rating: 5, label: "Perfect", note: "Best weather" },
      { month: "Mar", rating: 4, label: "Good", note: "Warm but pleasant" },
      { month: "Apr", rating: 3, label: "Okay", note: "Getting hot" },
      { month: "May", rating: 3, label: "Okay", note: "Occasional showers" },
      { month: "Jun", rating: 1, label: "Avoid", note: "Southwest monsoon begins" },
      { month: "Jul", rating: 1, label: "Avoid", note: "Heaviest rainfall" },
      { month: "Aug", rating: 2, label: "Poor", note: "Still heavy rains" },
      { month: "Sep", rating: 4, label: "Good", note: "Rains reducing, very green" },
      { month: "Oct", rating: 4, label: "Good", note: "Pleasant weather" },
      { month: "Nov", rating: 4, label: "Good", note: "Cooling down" },
      { month: "Dec", rating: 5, label: "Perfect", note: "Peak season" },
    ],
    tips: [
      "🌿 The hills are incredibly green right after the monsoon",
      "☕ Best time to visit coffee and tea plantations is winter",
      "🌧️ Always carry an umbrella as rain is unpredictable",
    ]
  }
};

const mapToTemplate = {
  goa: 'coastal', manali: 'himalayan', kerala: 'south_hills', rajasthan: 'desert',
  jaipur: 'desert', udaipur: 'desert', jodhpur: 'desert', jaisalmer: 'desert', pushkar: 'desert', mountabu: 'south_hills',
  shimla: 'himalayan', dharamshala: 'himalayan', kasol: 'himalayan', spiti: 'himalayan', birbilling: 'himalayan',
  rishikesh: 'himalayan', nainital: 'himalayan', mussoorie: 'himalayan', haridwar: 'plains', chopta: 'himalayan', auli: 'himalayan',
  kochi: 'coastal', munnar: 'south_hills', alleppey: 'coastal', wayanad: 'south_hills', varkala: 'coastal', thekkady: 'south_hills',
  bangalore: 'plains', mysore: 'plains', hampi: 'plains', coorg: 'south_hills', gokarna: 'coastal', dandeli: 'south_hills',
  chennai: 'coastal', pondicherry: 'coastal', ooty: 'south_hills', madurai: 'plains', kodaikanal: 'south_hills', rameswaram: 'coastal',
  mumbai: 'coastal', pune: 'plains', lonavala: 'south_hills', mahabaleshwar: 'south_hills', ajantaellora: 'plains', konkan: 'coastal',
  kolkata: 'coastal', darjeeling: 'himalayan', sundarbans: 'coastal', shantiniketan: 'plains',
  amritsar: 'plains', chandigarh: 'plains',
  ahmedabad: 'desert', rannofkutch: 'desert', somnath: 'coastal', dwarka: 'coastal', girforest: 'plains',
  srinagar: 'himalayan', gulmarg: 'himalayan', pahalgam: 'himalayan', sonamarg: 'himalayan',
  leh: 'himalayan', pangonglake: 'himalayan', nubravalley: 'himalayan',
  shillong: 'south_hills', cherrapunji: 'south_hills', dawki: 'south_hills',
  guwahati: 'plains', kaziranga: 'plains', majuli: 'plains',
  bhubaneswar: 'coastal', puri: 'coastal', konark: 'coastal',
  indore: 'plains', khajuraho: 'plains', ujjain: 'plains', pachmarhi: 'south_hills', sanchi: 'plains',
  vizag: 'coastal', tirupati: 'plains', arakuvalley: 'south_hills',
  hyderabad: 'plains',
  gangtok: 'himalayan', pelling: 'himalayan', ravangla: 'himalayan',
  tawang: 'himalayan', zirovalley: 'himalayan', kohima: 'himalayan', dimapur: 'plains', imphal: 'himalayan', loktaklake: 'plains', aizawl: 'himalayan', agartala: 'plains', neermahal: 'plains',
  jagdalpur: 'plains', chitrakote: 'plains', ranchi: 'plains', deoghar: 'plains', netarhat: 'south_hills', bodhgaya: 'plains', rajgir: 'plains', nalanda: 'plains',
  varanasi: 'plains', agra: 'plains', lucknow: 'plains', mathura: 'plains', prayagraj: 'plains',
  kurukshetra: 'plains', sultanpur: 'plains',
  portblair: 'coastal', havelock: 'coastal', neilisland: 'coastal', kavaratti: 'coastal', bangaram: 'coastal', agatti: 'coastal'
};

const output = [];
output.push('export const bestTimeData = {');

for (const [loc, tmpl] of Object.entries(mapToTemplate)) {
  const data = templates[tmpl];
  output.push(`  ${loc}: {`);
  output.push(`    best: "${data.best}",`);
  output.push(`    avoid: "${data.avoid}",`);
  if (loc === 'goa') output.push(`    current: "June", // dynamic fallback`);
  output.push(`    summary: "${data.summary}",`);
  output.push(`    months: ${JSON.stringify(data.months, null, 6).replace(/\\"/g, '"').replace(/\n\s*}/g, ' }').replace(/{\n\s*/g, '{ ')},`);
  output.push(`    tips: ${JSON.stringify(data.tips, null, 6)}`);
  output.push(`  },`);
}

output.push('};\n');

fs.writeFileSync('../src/data/bestTime.js', output.join('\n'));
console.log('Successfully generated bestTime.js with ' + Object.keys(mapToTemplate).length + ' locations.');
