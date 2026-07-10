// All India locations for budget recommendation
// Phase 2: Every state + famous tourist cities
// No transport/stay costs for new locations yet

export const allIndiaLocations = [
  // ══════════════════════════════════════════════════════════
  // EXISTING 4 BUILT LOCATIONS (preserved)
  // ══════════════════════════════════════════════════════════
  { name: "Goa", state: "Goa", emoji: "🏖️", tags: ["Beach", "Nightlife", "Food"], built: true, locationKey: "goa", description: "India's party capital with beaches, seafood and Portuguese charm" },
  { name: "Manali", state: "Himachal Pradesh", emoji: "🏔️", tags: ["Mountains", "Adventure", "Snow"], built: true, locationKey: "manali", description: "Snow-capped Himalayan valley with adventure sports and scenic beauty" },
  { name: "Kerala", state: "Kerala", emoji: "🌿", tags: ["Backwaters", "Nature", "Food"], built: true, locationKey: "kerala", description: "God's own country — backwaters, tea gardens and beaches" },
  { name: "Rajasthan", state: "Rajasthan", emoji: "🏯", tags: ["Heritage", "Desert", "Culture"], built: true, locationKey: "rajasthan", description: "Royal forts, desert dunes and vibrant culture" },

  // ══════════════════════════════════════════════════════════
  // RAJASTHAN CITIES
  // ══════════════════════════════════════════════════════════
  { name: "Jaipur", state: "Rajasthan", emoji: "🏛️", tags: ["Heritage", "Culture", "Shopping"], built: true, locationKey: "jaipur", description: "The Pink City — Hawa Mahal, Amber Fort and vibrant bazaars" },
  { name: "Udaipur", state: "Rajasthan", emoji: "🌊", tags: ["Lakes", "Romance", "Heritage"], built: true, locationKey: "udaipur", description: "City of Lakes — romantic palaces and stunning lake views" },
  { name: "Jodhpur", state: "Rajasthan", emoji: "🔵", tags: ["Heritage", "Desert", "Culture"], built: true, locationKey: "jodhpur", description: "The Blue City — Mehrangarh Fort and blue painted streets" },
  { name: "Jaisalmer", state: "Rajasthan", emoji: "🏰", tags: ["Desert", "Heritage", "Photography"], built: true, locationKey: "jaisalmer", description: "Golden fort city rising from the Thar desert" },
  { name: "Pushkar", state: "Rajasthan", emoji: "🐪", tags: ["Spiritual", "Desert", "Festival"], built: true, locationKey: "pushkar", description: "Sacred lake town with world famous camel fair" },
  { name: "Mount Abu", state: "Rajasthan", emoji: "⛰️", tags: ["Hills", "Nature", "Spiritual"], built: true, locationKey: "mountabu", description: "Rajasthan's only hill station with stunning Dilwara temples" },

  // ══════════════════════════════════════════════════════════
  // HIMACHAL PRADESH CITIES
  // ══════════════════════════════════════════════════════════
  { name: "Shimla", state: "Himachal Pradesh", emoji: "🏔️", tags: ["Hills", "Colonial", "Scenic"], built: true, locationKey: "shimla", description: "Colonial hill station with toy train and apple orchards" },
  { name: "Dharamshala", state: "Himachal Pradesh", emoji: "🕉️", tags: ["Spiritual", "Mountains", "Culture"], built: true, locationKey: "dharamshala", description: "Home of the Dalai Lama — Tibetan culture meets Himalayan beauty" },
  { name: "Kasol", state: "Himachal Pradesh", emoji: "🌿", tags: ["Offbeat", "Mountains", "Budget"], built: true, locationKey: "kasol", description: "Backpacker's paradise in the magical Parvati Valley" },
  { name: "Spiti Valley", state: "Himachal Pradesh", emoji: "🏜️", tags: ["Offbeat", "Mountains", "Buddhist"], built: true, locationKey: "spiti", description: "Cold desert monastery trail at 12,500 feet" },
  { name: "Bir Billing", state: "Himachal Pradesh", emoji: "🪂", tags: ["Adventure", "Paragliding", "Offbeat"], built: true, locationKey: "birbilling", description: "Paragliding capital of India with world-class thermals" },

  // ══════════════════════════════════════════════════════════
  // UTTARAKHAND CITIES
  // ══════════════════════════════════════════════════════════
  { name: "Rishikesh", state: "Uttarakhand", emoji: "🕉️", tags: ["Adventure", "Spiritual", "Rafting"], built: true, locationKey: "rishikesh", description: "Yoga capital with river rafting and Ganga Aarti" },
  { name: "Nainital", state: "Uttarakhand", emoji: "🌊", tags: ["Hills", "Lakes", "Scenic"], built: true, locationKey: "nainital", description: "Lake district with boating, cable car and snow views" },
  { name: "Mussoorie", state: "Uttarakhand", emoji: "🌲", tags: ["Hills", "Colonial", "Scenic"], built: true, locationKey: "mussoorie", description: "Queen of the hills with stunning Kempty Falls and mountain views" },
  { name: "Haridwar", state: "Uttarakhand", emoji: "🪔", tags: ["Spiritual", "Ghats", "Culture"], built: true, locationKey: "haridwar", description: "Sacred city on the Ganga — mesmerizing Ganga Aarti" },
  { name: "Chopta", state: "Uttarakhand", emoji: "⛺", tags: ["Trekking", "Nature", "Budget"], built: true, locationKey: "chopta", description: "Mini Switzerland of India — meadows and Tungnath temple trek" },
  { name: "Auli", state: "Uttarakhand", emoji: "⛷️", tags: ["Snow", "Skiing", "Mountains"], built: true, locationKey: "auli", description: "Ski resort with panoramic Himalayan views" },

  // ══════════════════════════════════════════════════════════
  // KERALA CITIES
  // ══════════════════════════════════════════════════════════
  { name: "Kochi", state: "Kerala", emoji: "🎣", tags: ["Culture", "Coastal", "Heritage"], built: true, locationKey: "kochi", description: "Historic port city with Chinese fishing nets and Fort Kochi" },
  { name: "Munnar", state: "Kerala", emoji: "🍵", tags: ["Hills", "Tea", "Nature"], built: true, locationKey: "munnar", description: "Misty tea gardens, waterfalls and cool climate paradise" },
  { name: "Alleppey", state: "Kerala", emoji: "🚢", tags: ["Backwaters", "Houseboat", "Peaceful"], built: true, locationKey: "alleppey", description: "Houseboat capital of India on serene backwaters" },
  { name: "Wayanad", state: "Kerala", emoji: "🐘", tags: ["Wildlife", "Nature", "Hills"], built: true, locationKey: "wayanad", description: "Lush wildlife sanctuaries, caves and misty hills" },
  { name: "Varkala", state: "Kerala", emoji: "🏖️", tags: ["Beach", "Cliff", "Wellness"], built: true, locationKey: "varkala", description: "Stunning cliff beach with natural springs and yoga retreats" },
  { name: "Thekkady", state: "Kerala", emoji: "🐯", tags: ["Wildlife", "Nature", "Spice"], built: true, locationKey: "thekkady", description: "Periyar Tiger Reserve and spice plantations" },

  // ══════════════════════════════════════════════════════════
  // KARNATAKA CITIES
  // ══════════════════════════════════════════════════════════
  { name: "Bangalore", state: "Karnataka", emoji: "💻", tags: ["City", "Culture", "Food"], built: true, locationKey: "bangalore", description: "Garden city with stunning parks, pubs and tech culture" },
  { name: "Mysore", state: "Karnataka", emoji: "🏯", tags: ["Heritage", "Culture", "Palaces"], built: true, locationKey: "mysore", description: "Royal city with magnificent Mysore Palace and Chamundi Hills" },
  { name: "Hampi", state: "Karnataka", emoji: "🗿", tags: ["Heritage", "Budget", "Ruins"], built: true, locationKey: "hampi", description: "UNESCO ruins with magical boulder landscapes" },
  { name: "Coorg", state: "Karnataka", emoji: "☕", tags: ["Hills", "Coffee", "Nature"], built: true, locationKey: "coorg", description: "Coffee country with waterfalls and misty hills" },
  { name: "Gokarna", state: "Karnataka", emoji: "🏖️", tags: ["Beach", "Spiritual", "Offbeat"], built: true, locationKey: "gokarna", description: "Laid-back beach town with ancient Shiva temple" },
  { name: "Dandeli", state: "Karnataka", emoji: "🌊", tags: ["Adventure", "Rafting", "Wildlife"], built: true, locationKey: "dandeli", description: "White water rafting in Kali River and jungle safaris" },

  // ══════════════════════════════════════════════════════════
  // TAMIL NADU CITIES
  // ══════════════════════════════════════════════════════════
  { name: "Chennai", state: "Tamil Nadu", emoji: "🏖️", tags: ["City", "Beach", "Culture"], built: true, locationKey: "chennai", description: "Marina Beach, ancient temples and filter coffee capital" },
  { name: "Pondicherry", state: "Tamil Nadu", emoji: "🇫🇷", tags: ["Beach", "French", "Budget"], built: true, locationKey: "pondicherry", description: "French quarter, beaches and ashrams — incredibly affordable" },
  { name: "Ooty", state: "Tamil Nadu", emoji: "🌸", tags: ["Hills", "Nature", "Colonial"], built: true, locationKey: "ooty", description: "Queen of hill stations with tea gardens and toy train" },
  { name: "Madurai", state: "Tamil Nadu", emoji: "🛕", tags: ["Temple", "Culture", "Heritage"], built: true, locationKey: "madurai", description: "Temple city with the magnificent Meenakshi Amman Temple" },
  { name: "Kodaikanal", state: "Tamil Nadu", emoji: "🌲", tags: ["Hills", "Nature", "Lakes"], built: true, locationKey: "kodaikanal", description: "Princess of hill stations with stunning Kodai Lake" },
  { name: "Rameswaram", state: "Tamil Nadu", emoji: "🌉", tags: ["Spiritual", "Beach", "Heritage"], built: true, locationKey: "rameswaram", description: "Sacred island with Pamban Bridge and Ramanathaswamy Temple" },

  // ══════════════════════════════════════════════════════════
  // MAHARASHTRA CITIES
  // ══════════════════════════════════════════════════════════
  { name: "Mumbai", state: "Maharashtra", emoji: "🌆", tags: ["City", "Beach", "Nightlife"], built: true, locationKey: "mumbai", description: "City of dreams — Gateway of India, Marine Drive and Bollywood" },
  { name: "Pune", state: "Maharashtra", emoji: "🏰", tags: ["City", "Culture", "Food"], built: true, locationKey: "pune", description: "Oxford of the East with historic forts and vibrant food scene" },
  { name: "Lonavala", state: "Maharashtra", emoji: "🌧️", tags: ["Hills", "Nature", "Weekend"], built: true, locationKey: "lonavala", description: "Hill station with caves, waterfalls and chikki" },
  { name: "Mahabaleshwar", state: "Maharashtra", emoji: "🍓", tags: ["Hills", "Nature", "Scenic"], built: true, locationKey: "mahabaleshwar", description: "Strawberry heaven with stunning viewpoints and lush valleys" },
  { name: "Ajanta & Ellora", state: "Maharashtra", emoji: "🗿", tags: ["Heritage", "Caves", "UNESCO"], built: true, locationKey: "ajantaellora", description: "UNESCO rock-cut caves — ancient Buddhist, Hindu and Jain art" },
  { name: "Konkan", state: "Maharashtra", emoji: "🏖️", tags: ["Beach", "Coastal", "Scenic"], built: true, locationKey: "konkan", description: "Pristine coastline with forts, beaches and Konkani cuisine" },

  // ══════════════════════════════════════════════════════════
  // WEST BENGAL CITIES
  // ══════════════════════════════════════════════════════════
  { name: "Kolkata", state: "West Bengal", emoji: "🌉", tags: ["City", "Culture", "Food"], built: true, locationKey: "kolkata", description: "City of Joy — Howrah Bridge, Victoria Memorial and street food" },
  { name: "Darjeeling", state: "West Bengal", emoji: "🍵", tags: ["Hills", "Tea", "Scenic"], built: true, locationKey: "darjeeling", description: "Tea gardens, toy train and Himalayan sunrise views" },
  { name: "Sundarbans", state: "West Bengal", emoji: "🐯", tags: ["Wildlife", "Nature", "Offbeat"], built: true, locationKey: "sundarbans", description: "Mangrove forests and Royal Bengal Tigers" },
  { name: "Shantiniketan", state: "West Bengal", emoji: "📚", tags: ["Culture", "Art", "Heritage"], built: true, locationKey: "shantiniketan", description: "Tagore's university town — art, culture and Baul music" },

  // ══════════════════════════════════════════════════════════
  // PUNJAB CITIES
  // ══════════════════════════════════════════════════════════
  { name: "Amritsar", state: "Punjab", emoji: "🙏", tags: ["Spiritual", "Food", "Heritage"], built: true, locationKey: "amritsar", description: "Golden Temple, langar and the best kulcha in India" },
  { name: "Chandigarh", state: "Punjab", emoji: "🗿", tags: ["City", "Modern", "Gardens"], built: true, locationKey: "chandigarh", description: "Le Corbusier's planned city with Rock Garden and Sukhna Lake" },

  // ══════════════════════════════════════════════════════════
  // GUJARAT CITIES
  // ══════════════════════════════════════════════════════════
  { name: "Ahmedabad", state: "Gujarat", emoji: "🕌", tags: ["Heritage", "Culture", "Food"], built: true, locationKey: "ahmedabad", description: "UNESCO heritage city with Sabarmati Ashram and stepwells" },
  { name: "Rann of Kutch", state: "Gujarat", emoji: "🌕", tags: ["Unique", "Desert", "Photography"], built: true, locationKey: "rannofkutch", description: "White salt desert under full moon — otherworldly" },
  { name: "Somnath", state: "Gujarat", emoji: "🛕", tags: ["Spiritual", "Heritage", "Beach"], built: true, locationKey: "somnath", description: "One of the 12 Jyotirlingas — ancient temple on the Arabian Sea" },
  { name: "Dwarka", state: "Gujarat", emoji: "🛕", tags: ["Spiritual", "Heritage", "Coastal"], built: true, locationKey: "dwarka", description: "Ancient holy city of Lord Krishna on the western coast" },
  { name: "Gir Forest", state: "Gujarat", emoji: "🦁", tags: ["Wildlife", "Safari", "Nature"], built: true, locationKey: "girforest", description: "Last home of the Asiatic lion — incredible wildlife safari" },

  // ══════════════════════════════════════════════════════════
  // JAMMU & KASHMIR CITIES
  // ══════════════════════════════════════════════════════════
  { name: "Srinagar", state: "Jammu & Kashmir", emoji: "🌷", tags: ["Lakes", "Gardens", "Scenic"], built: true, locationKey: "srinagar", description: "Paradise on Earth — Dal Lake, Mughal Gardens and shikaras" },
  { name: "Gulmarg", state: "Jammu & Kashmir", emoji: "❄️", tags: ["Snow", "Skiing", "Adventure"], built: true, locationKey: "gulmarg", description: "Best skiing in Asia with gondola to 13,000 feet" },
  { name: "Pahalgam", state: "Jammu & Kashmir", emoji: "🌿", tags: ["Nature", "Valleys", "Scenic"], built: true, locationKey: "pahalgam", description: "Valley of Shepherds — Betaab Valley and Lidder River" },
  { name: "Sonamarg", state: "Jammu & Kashmir", emoji: "🏔️", tags: ["Mountains", "Glaciers", "Scenic"], built: true, locationKey: "sonamarg", description: "Meadow of Gold — Thajiwas Glacier and alpine beauty" },

  // ══════════════════════════════════════════════════════════
  // LADAKH CITIES
  // ══════════════════════════════════════════════════════════
  { name: "Leh", state: "Ladakh", emoji: "🏜️", tags: ["Adventure", "Mountains", "Buddhist"], built: true, locationKey: "leh", description: "High altitude desert with monasteries and surreal landscapes" },
  { name: "Pangong Lake", state: "Ladakh", emoji: "🌊", tags: ["Nature", "Photography", "Scenic"], built: true, locationKey: "pangonglake", description: "Changing blue waters against brown Himalayan mountains" },
  { name: "Nubra Valley", state: "Ladakh", emoji: "🐪", tags: ["Desert", "Offbeat", "Adventure"], built: true, locationKey: "nubravalley", description: "Double-humped camels on sand dunes at 10,000 feet" },

  // ══════════════════════════════════════════════════════════
  // MEGHALAYA CITIES
  // ══════════════════════════════════════════════════════════
  { name: "Shillong", state: "Meghalaya", emoji: "🎵", tags: ["Hills", "Music", "Nature"], built: true, locationKey: "shillong", description: "Rock capital of India with waterfalls and pine forests" },
  { name: "Cherrapunji", state: "Meghalaya", emoji: "🌧️", tags: ["Nature", "Offbeat", "Caves"], built: true, locationKey: "cherrapunji", description: "Wettest place on earth — living root bridges and waterfalls" },
  { name: "Dawki", state: "Meghalaya", emoji: "🌊", tags: ["Nature", "Offbeat", "Photography"], built: true, locationKey: "dawki", description: "Crystal clear Umngot River — India's clearest water" },

  // ══════════════════════════════════════════════════════════
  // ASSAM CITIES
  // ══════════════════════════════════════════════════════════
  { name: "Guwahati", state: "Assam", emoji: "🛕", tags: ["Spiritual", "Culture", "Gateway"], built: true, locationKey: "guwahati", description: "Gateway to Northeast India with Kamakhya Temple" },
  { name: "Kaziranga", state: "Assam", emoji: "🦏", tags: ["Wildlife", "Safari", "Nature"], built: true, locationKey: "kaziranga", description: "Home of the one-horned rhinoceros — UNESCO World Heritage" },
  { name: "Majuli", state: "Assam", emoji: "🏝️", tags: ["Offbeat", "Culture", "Nature"], built: true, locationKey: "majuli", description: "World's largest river island with Vaishnavite monasteries" },

  // ══════════════════════════════════════════════════════════
  // ODISHA CITIES
  // ══════════════════════════════════════════════════════════
  { name: "Bhubaneswar", state: "Odisha", emoji: "🛕", tags: ["Temple", "Heritage", "Culture"], built: true, locationKey: "bhubaneswar", description: "Temple city of India with 1,000+ ancient temples" },
  { name: "Puri", state: "Odisha", emoji: "🏖️", tags: ["Beach", "Spiritual", "Heritage"], built: true, locationKey: "puri", description: "Jagannath Temple and sacred beaches on the Bay of Bengal" },
  { name: "Konark", state: "Odisha", emoji: "🛕", tags: ["Heritage", "UNESCO", "Architecture"], built: true, locationKey: "konark", description: "UNESCO Sun Temple — masterpiece of Kalinga architecture" },

  // ══════════════════════════════════════════════════════════
  // MADHYA PRADESH CITIES
  // ══════════════════════════════════════════════════════════
  { name: "Indore", state: "Madhya Pradesh", emoji: "🍛", tags: ["Food", "City", "Culture"], built: true, locationKey: "indore", description: "Best street food city in India — poha, jalebi and Sarafa Bazaar" },
  { name: "Khajuraho", state: "Madhya Pradesh", emoji: "🛕", tags: ["Heritage", "UNESCO", "Art"], built: true, locationKey: "khajuraho", description: "UNESCO temples with world famous sculptural art" },
  { name: "Ujjain", state: "Madhya Pradesh", emoji: "🕉️", tags: ["Spiritual", "Heritage", "Festival"], built: true, locationKey: "ujjain", description: "Ancient Mahakaleshwar Jyotirlinga and Kumbh Mela city" },
  { name: "Pachmarhi", state: "Madhya Pradesh", emoji: "🌿", tags: ["Hills", "Nature", "Wildlife"], built: true, locationKey: "pachmarhi", description: "Queen of Satpura — waterfalls, caves and Satpura Tiger Reserve" },
  { name: "Sanchi", state: "Madhya Pradesh", emoji: "☮️", tags: ["Heritage", "Buddhist", "UNESCO"], built: true, locationKey: "sanchi", description: "Great Stupa — oldest stone structure in India" },

  // ══════════════════════════════════════════════════════════
  // ANDHRA PRADESH + TELANGANA
  // ══════════════════════════════════════════════════════════
  { name: "Visakhapatnam", state: "Andhra Pradesh", emoji: "🏖️", tags: ["Beach", "City", "Caves"], built: true, locationKey: "vizag", description: "City of Destiny with stunning beaches and Borra Caves" },
  { name: "Tirupati", state: "Andhra Pradesh", emoji: "🛕", tags: ["Spiritual", "Heritage", "Temple"], built: true, locationKey: "tirupati", description: "World's richest temple — Tirumala Venkateswara" },
  { name: "Araku Valley", state: "Andhra Pradesh", emoji: "☕", tags: ["Hills", "Coffee", "Nature"], built: true, locationKey: "arakuvalley", description: "Hill station with coffee plantations and tribal culture" },
  { name: "Hyderabad", state: "Telangana", emoji: "🕌", tags: ["City", "Food", "Heritage"], built: true, locationKey: "hyderabad", description: "Biryani capital — Charminar, Golconda Fort and Irani chai" },

  // ══════════════════════════════════════════════════════════
  // SIKKIM CITIES
  // ══════════════════════════════════════════════════════════
  { name: "Gangtok", state: "Sikkim", emoji: "🏔️", tags: ["Mountains", "Buddhist", "Scenic"], built: true, locationKey: "gangtok", description: "Capital of Sikkim with stunning monastery views and MG Marg" },
  { name: "Pelling", state: "Sikkim", emoji: "🏔️", tags: ["Mountains", "Offbeat", "Nature"], built: true, locationKey: "pelling", description: "Kanchenjunga views and Pemayangtse Monastery" },
  { name: "Ravangla", state: "Sikkim", emoji: "☮️", tags: ["Buddhist", "Nature", "Offbeat"], built: true, locationKey: "ravangla", description: "Serene Buddha Park with panoramic Himalayan views" },

  // ══════════════════════════════════════════════════════════
  // NORTH EAST STATES
  // ══════════════════════════════════════════════════════════
  { name: "Tawang", state: "Arunachal Pradesh", emoji: "🛕", tags: ["Offbeat", "Spiritual", "Mountains"], built: true, locationKey: "tawang", description: "Remote Buddhist monastery town near China border" },
  { name: "Ziro Valley", state: "Arunachal Pradesh", emoji: "🌾", tags: ["Offbeat", "Culture", "Nature"], built: true, locationKey: "zirovalley", description: "UNESCO tentative site — Apatani tribal culture and music festival" },
  { name: "Kohima", state: "Nagaland", emoji: "🎭", tags: ["Culture", "Tribal", "Heritage"], built: true, locationKey: "kohima", description: "WWII history and gateway to Hornbill Festival" },
  { name: "Dimapur", state: "Nagaland", emoji: "🗿", tags: ["Heritage", "Culture", "Ruins"], built: true, locationKey: "dimapur", description: "Ancient Kachari ruins and gateway to Nagaland" },
  { name: "Imphal", state: "Manipur", emoji: "🏰", tags: ["Culture", "Heritage", "Offbeat"], built: true, locationKey: "imphal", description: "Kangla Fort and the world's only all-women market" },
  { name: "Loktak Lake", state: "Manipur", emoji: "🏝️", tags: ["Nature", "Unique", "Wildlife"], built: true, locationKey: "loktaklake", description: "World's only floating lake with phumdis and Sangai deer" },
  { name: "Aizawl", state: "Mizoram", emoji: "🏔️", tags: ["Hills", "Culture", "Offbeat"], built: true, locationKey: "aizawl", description: "City on a ridge — vibrant Mizo culture and bamboo forests" },
  { name: "Agartala", state: "Tripura", emoji: "🏯", tags: ["Heritage", "Culture", "Offbeat"], built: true, locationKey: "agartala", description: "Ujjayanta Palace and gateway to Unakoti rock carvings" },
  { name: "Neermahal", state: "Tripura", emoji: "🏰", tags: ["Heritage", "Lakes", "Unique"], built: true, locationKey: "neermahal", description: "India's only water palace on Rudrasagar Lake" },

  // ══════════════════════════════════════════════════════════
  // CENTRAL + OTHER STATES
  // ══════════════════════════════════════════════════════════
  { name: "Jagdalpur", state: "Chhattisgarh", emoji: "💧", tags: ["Nature", "Waterfalls", "Tribal"], built: true, locationKey: "jagdalpur", description: "Chitrakote Falls — Niagara of India — and tribal Bastar" },
  { name: "Chitrakote Falls", state: "Chhattisgarh", emoji: "💧", tags: ["Nature", "Waterfalls", "Scenic"], built: true, locationKey: "chitrakote", description: "India's widest waterfall — the Niagara of India" },
  { name: "Ranchi", state: "Jharkhand", emoji: "💧", tags: ["Nature", "Waterfalls", "Hills"], built: true, locationKey: "ranchi", description: "City of waterfalls — Hundru Falls and Jonha Falls" },
  { name: "Deoghar", state: "Jharkhand", emoji: "🛕", tags: ["Spiritual", "Heritage", "Temple"], built: true, locationKey: "deoghar", description: "One of the 12 Jyotirlingas — Baidyanath Temple" },
  { name: "Netarhat", state: "Jharkhand", emoji: "🌅", tags: ["Hills", "Offbeat", "Nature"], built: true, locationKey: "netarhat", description: "Queen of Chotanagpur — sunrise point and pine forests" },
  { name: "Bodh Gaya", state: "Bihar", emoji: "🌳", tags: ["Spiritual", "Buddhist", "Heritage"], built: true, locationKey: "bodhgaya", description: "Where Buddha attained enlightenment — Mahabodhi Temple" },
  { name: "Rajgir", state: "Bihar", emoji: "♨️", tags: ["Spiritual", "Heritage", "Nature"], built: true, locationKey: "rajgir", description: "Ancient city of kings with hot springs and Shanti Stupa" },
  { name: "Nalanda", state: "Bihar", emoji: "📚", tags: ["Heritage", "Buddhist", "UNESCO"], built: true, locationKey: "nalanda", description: "Ruins of world's first university — UNESCO World Heritage" },

  // ══════════════════════════════════════════════════════════
  // UTTAR PRADESH CITIES
  // ══════════════════════════════════════════════════════════
  { name: "Varanasi", state: "Uttar Pradesh", emoji: "🪔", tags: ["Spiritual", "Culture", "Ghats"], built: true, locationKey: "varanasi", description: "Oldest living city — Ganga Aarti and spiritual awakening" },
  { name: "Agra", state: "Uttar Pradesh", emoji: "🕌", tags: ["Heritage", "UNESCO", "Romance"], built: true, locationKey: "agra", description: "Taj Mahal — one of the seven wonders of the world" },
  { name: "Lucknow", state: "Uttar Pradesh", emoji: "🍛", tags: ["Food", "Heritage", "Culture"], built: true, locationKey: "lucknow", description: "City of Nawabs — Awadhi cuisine, kebabs and Bara Imambara" },
  { name: "Mathura", state: "Uttar Pradesh", emoji: "🛕", tags: ["Spiritual", "Culture", "Festival"], built: true, locationKey: "mathura", description: "Birthplace of Lord Krishna — Holi celebrations and temples" },
  { name: "Prayagraj", state: "Uttar Pradesh", emoji: "🌊", tags: ["Spiritual", "Heritage", "Rivers"], built: true, locationKey: "prayagraj", description: "Triveni Sangam — confluence of Ganga, Yamuna and Saraswati" },

  // ══════════════════════════════════════════════════════════
  // HARYANA
  // ══════════════════════════════════════════════════════════
  { name: "Kurukshetra", state: "Haryana", emoji: "📖", tags: ["Spiritual", "Heritage", "History"], built: true, locationKey: "kurukshetra", description: "Land of the Mahabharata war — Brahma Sarovar and temples" },
  { name: "Sultanpur Bird Sanctuary", state: "Haryana", emoji: "🦅", tags: ["Wildlife", "Nature", "Birds"], built: true, locationKey: "sultanpur", description: "Bird lover's paradise with 250+ species near Delhi" },

  // ══════════════════════════════════════════════════════════
  // ANDAMAN & NICOBAR + LAKSHADWEEP
  // ══════════════════════════════════════════════════════════
  { name: "Port Blair", state: "Andaman & Nicobar", emoji: "🏰", tags: ["Beach", "Heritage", "Tropical"], built: true, locationKey: "portblair", description: "Cellular Jail and gateway to Andaman's pristine beaches" },
  { name: "Havelock Island", state: "Andaman & Nicobar", emoji: "🏝️", tags: ["Beach", "Scuba", "Tropical"], built: true, locationKey: "havelock", description: "Radhanagar Beach — Asia's best beach and world-class diving" },
  { name: "Neil Island", state: "Andaman & Nicobar", emoji: "🐠", tags: ["Beach", "Offbeat", "Tropical"], built: true, locationKey: "neilisland", description: "Untouched coral beaches with natural bridge and bioluminescence" },
  { name: "Kavaratti", state: "Lakshadweep", emoji: "🌊", tags: ["Beach", "Tropical", "Coral"], built: true, locationKey: "kavaratti", description: "Capital of Lakshadweep with crystal clear lagoons" },
  { name: "Bangaram Island", state: "Lakshadweep", emoji: "🏝️", tags: ["Beach", "Tropical", "Exclusive"], built: true, locationKey: "bangaram", description: "Uninhabited coral island with pristine lagoon" },
  { name: "Agatti Island", state: "Lakshadweep", emoji: "✈️", tags: ["Beach", "Tropical", "Coral"], built: true, locationKey: "agatti", description: "Gateway to Lakshadweep with stunning coral reef" },
]

// Budget recommendation engine
export const getRecommendations = (budget, groupSize = 1, days = 3) => {
  const perPersonBudget = budget / groupSize

  return allIndiaLocations.map(loc => {
    const transportTotal = (loc.minTransport || 0) * 2 * groupSize // round trip
    const stayTotal = (loc.minStayPerNight || 0) * days * (groupSize > 2 ? Math.ceil(groupSize / 2) : 1)
    const minTotal = transportTotal + stayTotal
    const remaining = budget - minTotal
    const remainingPerPerson = remaining / groupSize
    const percentUsed = minTotal > 0 ? (minTotal / budget) * 100 : 0

    let status = "recommended"
    if (minTotal === 0) status = "recommended" // no cost data yet
    else if (percentUsed > 100) status = "outofreach"
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
