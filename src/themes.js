export const themes = {
  summer: {
    name: "summer",
    bg: "#0a0a0a",
    primary: "#FF6B00",
    secondary: "#FFB347",
    accent: "#FF4500",
    text: "#FFFFFF",
    subtext: "#FFD4A8",
    card: "#1a1a1a",
    gradient: "linear-gradient(135deg, #FF6B00 0%, #FF4500 50%, #FFB347 100%)",
    heroGradient: "linear-gradient(180deg, #0a0a0a 0%, #1a0800 100%)",
    glowColor: "rgba(255, 107, 0, 0.35)",
    particleColor: "#FF6B00",
    orbColors: ["#FF6B00", "#FF4500", "#FFB347"],
  },
  monsoon: {
    name: "monsoon",
    bg: "#050a0f",
    primary: "#00B4D8",
    secondary: "#48CAE4",
    accent: "#0077B6",
    text: "#FFFFFF",
    subtext: "#ADE8F4",
    card: "#0a1628",
    gradient: "linear-gradient(135deg, #0077B6 0%, #00B4D8 50%, #48CAE4 100%)",
    heroGradient: "linear-gradient(180deg, #050a0f 0%, #0a1628 100%)",
    glowColor: "rgba(0, 180, 216, 0.35)",
    particleColor: "#00B4D8",
    orbColors: ["#0077B6", "#00B4D8", "#48CAE4"],
  },
  autumn: {
    name: "autumn",
    bg: "#0a0600",
    primary: "#E85D04",
    secondary: "#F48C06",
    accent: "#DC2F02",
    text: "#FFFFFF",
    subtext: "#FFCBA4",
    card: "#1a0e00",
    gradient: "linear-gradient(135deg, #DC2F02 0%, #E85D04 50%, #F48C06 100%)",
    heroGradient: "linear-gradient(180deg, #0a0600 0%, #1a0e00 100%)",
    glowColor: "rgba(232, 93, 4, 0.35)",
    particleColor: "#E85D04",
    orbColors: ["#DC2F02", "#E85D04", "#F48C06"],
  },
  winter: {
    name: "winter",
    bg: "#030a1a",
    primary: "#4CC9F0",
    secondary: "#7DF9FF",
    accent: "#3A86FF",
    text: "#FFFFFF",
    subtext: "#BDE0FE",
    card: "#0a1628",
    gradient: "linear-gradient(135deg, #3A86FF 0%, #4CC9F0 50%, #7DF9FF 100%)",
    heroGradient: "linear-gradient(180deg, #030a1a 0%, #0a1628 100%)",
    glowColor: "rgba(76, 201, 240, 0.35)",
    particleColor: "#4CC9F0",
    orbColors: ["#3A86FF", "#4CC9F0", "#7DF9FF"],
  },
  spring: {
    name: "spring",
    bg: "#020a00",
    primary: "#70E000",
    secondary: "#9EF01A",
    accent: "#38B000",
    text: "#FFFFFF",
    subtext: "#CCFF33",
    card: "#0a1a00",
    gradient: "linear-gradient(135deg, #38B000 0%, #70E000 50%, #9EF01A 100%)",
    heroGradient: "linear-gradient(180deg, #020a00 0%, #0a1a00 100%)",
    glowColor: "rgba(112, 224, 0, 0.35)",
    particleColor: "#70E000",
    orbColors: ["#38B000", "#70E000", "#9EF01A"],
  },
}

// Helper to generate a theme from a color triplet
const t = (name, bg, primary, secondary, accent, card, heroBgEnd) => ({
  name,
  bg,
  primary,
  secondary,
  accent,
  text: "#FFFFFF",
  subtext: secondary,
  card,
  gradient: `linear-gradient(135deg, ${accent} 0%, ${primary} 50%, ${secondary} 100%)`,
  heroGradient: `linear-gradient(180deg, ${bg} 0%, ${heroBgEnd || card} 100%)`,
  glowColor: `${primary}59`,
  particleColor: primary,
  orbColors: [accent, primary, secondary],
})

export const locationThemes = {
  // ══════════════════════════════════════════════════════════
  // EXISTING 4 LOCATIONS (preserved exactly)
  // ══════════════════════════════════════════════════════════
  goa: {
    name: "goa",
    bg: "#0a0700",
    primary: "#E8C47A",
    secondary: "#F5DFA0",
    accent: "#C49A3C",
    text: "#FFFFFF",
    subtext: "#F5DFA0",
    card: "#1a1200",
    gradient: "linear-gradient(135deg, #C49A3C 0%, #E8C47A 50%, #F5DFA0 100%)",
    heroGradient: "linear-gradient(180deg, #0a0700 0%, #1a1200 100%)",
    glowColor: "rgba(232, 196, 122, 0.35)",
    particleColor: "#E8C47A",
    orbColors: ["#C49A3C", "#E8C47A", "#F5DFA0"],
  },
  manali: {
    name: "manali",
    bg: "#030a1a",
    primary: "#4CC9F0",
    secondary: "#FFFFFF",
    accent: "#3A86FF",
    text: "#FFFFFF",
    subtext: "#BDE0FE",
    card: "#0a1628",
    gradient: "linear-gradient(135deg, #3A86FF 0%, #4CC9F0 50%, #FFFFFF 100%)",
    heroGradient: "linear-gradient(180deg, #030a1a 0%, #0a1628 100%)",
    glowColor: "rgba(76, 201, 240, 0.35)",
    particleColor: "#4CC9F0",
    orbColors: ["#3A86FF", "#4CC9F0", "#BDE0FE"],
  },
  kerala: {
    name: "kerala",
    bg: "#020a00",
    primary: "#70E000",
    secondary: "#FFD60A",
    accent: "#38B000",
    text: "#FFFFFF",
    subtext: "#CCFF33",
    card: "#0a1a00",
    gradient: "linear-gradient(135deg, #38B000 0%, #70E000 50%, #FFD60A 100%)",
    heroGradient: "linear-gradient(180deg, #020a00 0%, #0a1a00 100%)",
    glowColor: "rgba(112, 224, 0, 0.35)",
    particleColor: "#70E000",
    orbColors: ["#38B000", "#70E000", "#FFD60A"],
  },
  rajasthan: {
    name: "rajasthan",
    bg: "#0a0500",
    primary: "#FF9500",
    secondary: "#FF6B00",
    accent: "#C1440E",
    text: "#FFFFFF",
    subtext: "#FFD4A8",
    card: "#1a0a00",
    gradient: "linear-gradient(135deg, #C1440E 0%, #FF6B00 50%, #FF9500 100%)",
    heroGradient: "linear-gradient(180deg, #0a0500 0%, #1a0a00 100%)",
    glowColor: "rgba(255, 149, 0, 0.35)",
    particleColor: "#FF9500",
    orbColors: ["#C1440E", "#FF6B00", "#FF9500"],
  },

  // ══════════════════════════════════════════════════════════
  // RAJASTHAN CITIES (Desert golds, sandstone oranges, royal blues)
  // ══════════════════════════════════════════════════════════
  jaipur:      t("jaipur",      "#0a0502", "#e85d04", "#faa307", "#dc2f02", "#1a0f05"), // Pinkish orange
  udaipur:     t("udaipur",     "#020610", "#0284c7", "#38bdf8", "#0369a1", "#0a1220"), // Lake blue
  jodhpur:     t("jodhpur",     "#02040a", "#2563eb", "#60a5fa", "#1d4ed8", "#081020"), // Royal blue
  jaisalmer:   t("jaisalmer",   "#0a0800", "#d97706", "#fbbf24", "#b45309", "#1a1605"), // Desert gold
  pushkar:     t("pushkar",     "#0a0400", "#ea580c", "#fb923c", "#c2410c", "#1a0b05"), // Sandstone
  mountabu:    t("mountabu",    "#020804", "#16a34a", "#4ade80", "#15803d", "#0a1a0f"), // Hill green

  // ══════════════════════════════════════════════════════════
  // HIMACHAL PRADESH CITIES (Pine greens, snow whites, mountain blues)
  // ══════════════════════════════════════════════════════════
  shimla:      t("shimla",      "#020806", "#059669", "#e2e8f0", "#047857", "#0a1a14"), // Pine green / Snow
  dharamshala: t("dharamshala", "#040608", "#0ea5e9", "#e0f2fe", "#0284c7", "#0a121a"), // Mountain blue
  kasol:       t("kasol",       "#020804", "#10b981", "#6ee7b7", "#059669", "#0a1a0f"), // Pine green
  spiti:       t("spiti",       "#02040a", "#3b82f6", "#e2e8f0", "#2563eb", "#081020"), // Deep blue / Snow
  birbilling:  t("birbilling",  "#02080a", "#06b6d4", "#cffafe", "#0891b2", "#0a1a20"), // Sky blue

  // ══════════════════════════════════════════════════════════
  // UTTARAKHAND CITIES (River teal, forest greens)
  // ══════════════════════════════════════════════════════════
  rishikesh:   t("rishikesh",   "#02080a", "#0d9488", "#5eead4", "#0f766e", "#0a1a20"), // River teal
  nainital:    t("nainital",    "#020808", "#0891b2", "#67e8f9", "#0e7490", "#0a1a1c"), // Teal/Lake
  mussoorie:   t("mussoorie",   "#020804", "#15803d", "#86efac", "#166534", "#0a1a0f"), // Forest green
  haridwar:    t("haridwar",    "#0a0600", "#ea580c", "#fdba74", "#c2410c", "#1a1005"), // Aarti orange (spiritual)
  chopta:      t("chopta",      "#020806", "#059669", "#6ee7b7", "#047857", "#0a1a14"), // Meadow green
  auli:        t("auli",        "#04060a", "#38bdf8", "#f8fafc", "#0284c7", "#0a101a"), // Snow white / sky blue

  // ══════════════════════════════════════════════════════════
  // KERALA CITIES (Tropical greens, backwater blues)
  // ══════════════════════════════════════════════════════════
  kochi:       t("kochi",       "#02080a", "#0284c7", "#7dd3fc", "#0369a1", "#0a1a20"), // Backwater blue
  munnar:      t("munnar",      "#020802", "#16a34a", "#4ade80", "#15803d", "#0a1a0a"), // Tea green
  alleppey:    t("alleppey",    "#020808", "#0891b2", "#67e8f9", "#0e7490", "#0a1a1c"), // Tropical blue
  wayanad:     t("wayanad",     "#020804", "#15803d", "#86efac", "#166534", "#0a1a0f"), // Forest green
  varkala:     t("varkala",     "#02080a", "#0d9488", "#5eead4", "#0f766e", "#0a1a20"), // Beach teal
  thekkady:    t("thekkady",    "#020802", "#4d7c0f", "#a3e635", "#3f6212", "#0a1a0a"), // Spice green

  // ══════════════════════════════════════════════════════════
  // KARNATAKA CITIES (Heritage reds, coffee browns)
  // ══════════════════════════════════════════════════════════
  bangalore:   t("bangalore",   "#080404", "#dc2626", "#fca5a5", "#b91c1c", "#1a0a0a"), // Red
  mysore:      t("mysore",      "#0a0502", "#d97706", "#fcd34d", "#b45309", "#1a0e05"), // Heritage gold/red
  hampi:       t("hampi",       "#0a0602", "#b45309", "#fde047", "#92400e", "#1a1205"), // Ruin brown
  coorg:       t("coorg",       "#080502", "#78350f", "#d97706", "#451a03", "#1a1005"), // Coffee brown
  gokarna:     t("gokarna",     "#020808", "#0d9488", "#5eead4", "#0f766e", "#0a1a1c"), // Beach teal
  dandeli:     t("dandeli",     "#020804", "#15803d", "#86efac", "#166534", "#0a1a0f"), // Forest green

  // ══════════════════════════════════════════════════════════
  // TAMIL NADU CITIES (Temple reds, French yellows)
  // ══════════════════════════════════════════════════════════
  chennai:     t("chennai",     "#0a0202", "#ef4444", "#fca5a5", "#dc2626", "#1a0a0a"), // Temple red
  pondicherry: t("pondicherry", "#0a0800", "#eab308", "#fef08a", "#ca8a04", "#1a1605"), // French yellow
  ooty:        t("ooty",        "#020804", "#10b981", "#6ee7b7", "#059669", "#0a1a0f"), // Hill green
  madurai:     t("madurai",     "#0a0302", "#ea580c", "#fdba74", "#c2410c", "#1a0a05"), // Temple red/orange
  kodaikanal:  t("kodaikanal",  "#020806", "#059669", "#6ee7b7", "#047857", "#0a1a14"), // Mist green
  rameswaram:  t("rameswaram",  "#02060a", "#0284c7", "#7dd3fc", "#0369a1", "#0a101a"), // Ocean blue

  // ══════════════════════════════════════════════════════════
  // MAHARASHTRA CITIES (Sea blues, cave greys)
  // ══════════════════════════════════════════════════════════
  mumbai:      t("mumbai",      "#02060a", "#2563eb", "#93c5fd", "#1d4ed8", "#0a101a"), // Sea blue
  pune:        t("pune",        "#060606", "#475569", "#94a3b8", "#334155", "#141414"), // Cave/Fort grey
  lonavala:    t("lonavala",    "#020804", "#16a34a", "#86efac", "#15803d", "#0a1a0f"), // Hill green
  mahabaleshwar: t("mahabaleshwar", "#0a0204", "#e11d48", "#fecdd3", "#be123c", "#1a0a10"), // Strawberry red
  ajantaellora: t("ajantaellora", "#060606", "#64748b", "#cbd5e1", "#475569", "#141414"), // Cave grey
  konkan:      t("konkan",      "#02080a", "#0891b2", "#67e8f9", "#0e7490", "#0a1a20"), // Sea blue

  // ══════════════════════════════════════════════════════════
  // WEST BENGAL CITIES (Tea greens, cultural golds)
  // ══════════════════════════════════════════════════════════
  kolkata:     t("kolkata",     "#0a0600", "#d97706", "#fde047", "#b45309", "#1a1205"), // Cultural gold
  darjeeling:  t("darjeeling",  "#020804", "#15803d", "#86efac", "#166534", "#0a1a0f"), // Tea green
  sundarbans:  t("sundarbans",  "#040802", "#4d7c0f", "#a3e635", "#3f6212", "#0a1a0a"), // Mangrove green
  shantiniketan: t("shantiniketan", "#0a0502", "#ea580c", "#fdba74", "#c2410c", "#1a0e05"), // Terracotta orange

  // ══════════════════════════════════════════════════════════
  // PUNJAB CITIES (Golden temple golds, modern greens)
  // ══════════════════════════════════════════════════════════
  amritsar:    t("amritsar",    "#0a0800", "#f59e0b", "#fef08a", "#d97706", "#1a1605"), // Golden temple gold
  chandigarh:  t("chandigarh",  "#020804", "#16a34a", "#4ade80", "#15803d", "#0a1a0a"), // Modern green

  // ══════════════════════════════════════════════════════════
  // GUJARAT CITIES (White desert silvers, temple golds)
  // ══════════════════════════════════════════════════════════
  ahmedabad:   t("ahmedabad",   "#0a0502", "#ea580c", "#fdba74", "#c2410c", "#1a0e05"), // Heritage orange
  rannofkutch: t("rannofkutch", "#060608", "#94a3b8", "#f1f5f9", "#64748b", "#14141a"), // White desert silver
  somnath:     t("somnath",     "#0a0600", "#d97706", "#fde047", "#b45309", "#1a1205"), // Temple gold
  dwarka:      t("dwarka",      "#02060a", "#0284c7", "#7dd3fc", "#0369a1", "#0a101a"), // Coastal blue
  girforest:   t("girforest",   "#040802", "#4d7c0f", "#a3e635", "#3f6212", "#0a1a0a"), // Forest green

  // ══════════════════════════════════════════════════════════
  // JAMMU & KASHMIR CITIES (Snow whites, saffron purples)
  // ══════════════════════════════════════════════════════════
  srinagar:    t("srinagar",    "#060206", "#9333ea", "#d8b4fe", "#7e22ce", "#140a14"), // Saffron purple
  gulmarg:     t("gulmarg",     "#040608", "#38bdf8", "#f8fafc", "#0284c7", "#0e141a"), // Snow white / sky blue
  pahalgam:    t("pahalgam",    "#020804", "#10b981", "#6ee7b7", "#059669", "#0a1a0f"), // Valley green
  sonamarg:    t("sonamarg",    "#0a0804", "#eab308", "#fef08a", "#ca8a04", "#1a160a"), // Meadow gold

  // ══════════════════════════════════════════════════════════
  // LADAKH CITIES (Desert browns, sky blues)
  // ══════════════════════════════════════════════════════════
  leh:         t("leh",         "#080504", "#a16207", "#fcd34d", "#713f12", "#140e0a"), // Desert brown
  pangonglake: t("pangonglake", "#02040a", "#2563eb", "#93c5fd", "#1d4ed8", "#08101a"), // Deep lake blue
  nubravalley: t("nubravalley", "#080604", "#b45309", "#fde047", "#92400e", "#14100a"), // Sand dune brown

  // ══════════════════════════════════════════════════════════
  // MEGHALAYA CITIES (Cloud greys, waterfall blues)
  // ══════════════════════════════════════════════════════════
  shillong:    t("shillong",    "#060608", "#64748b", "#cbd5e1", "#475569", "#14141a"), // Cloud grey
  cherrapunji: t("cherrapunji", "#04060a", "#0284c7", "#e0f2fe", "#0369a1", "#0e121a"), // Rain blue/white
  dawki:       t("dawki",       "#02080a", "#0891b2", "#67e8f9", "#0e7490", "#0a1a20"), // Clear water cyan

  // ══════════════════════════════════════════════════════════
  // ASSAM CITIES (Tea greens, rhino greys)
  // ══════════════════════════════════════════════════════════
  guwahati:    t("guwahati",    "#040804", "#15803d", "#86efac", "#166534", "#0a1a0a"), // Tea green
  kaziranga:   t("kaziranga",   "#060606", "#475569", "#94a3b8", "#334155", "#141414"), // Rhino grey
  majuli:      t("majuli",      "#020804", "#16a34a", "#86efac", "#15803d", "#0a1a0f"), // Island green

  // ══════════════════════════════════════════════════════════
  // ODISHA CITIES (Temple sandstone, ocean blues)
  // ══════════════════════════════════════════════════════════
  bhubaneswar: t("bhubaneswar", "#080402", "#c2410c", "#fdba74", "#9a3412", "#140e05"), // Sandstone orange
  puri:        t("puri",        "#02060a", "#0284c7", "#7dd3fc", "#0369a1", "#0a101a"), // Ocean blue
  konark:      t("konark",      "#0a0502", "#ea580c", "#fdba74", "#c2410c", "#1a0e05"), // Sun temple orange

  // ══════════════════════════════════════════════════════════
  // MADHYA PRADESH CITIES (Sandstone reds, forest greens)
  // ══════════════════════════════════════════════════════════
  indore:      t("indore",      "#0a0404", "#ef4444", "#fca5a5", "#dc2626", "#1a0a0a"), // Heritage red
  khajuraho:   t("khajuraho",   "#080402", "#c2410c", "#fdba74", "#9a3412", "#140a05"), // Sandstone orange
  ujjain:      t("ujjain",      "#0a0500", "#d97706", "#fde047", "#b45309", "#1a1005"), // Spiritual gold
  pachmarhi:   t("pachmarhi",   "#020804", "#15803d", "#86efac", "#166534", "#0a1a0f"), // Forest green
  sanchi:      t("sanchi",      "#080402", "#c2410c", "#fdba74", "#9a3412", "#140a05"), // Sandstone

  // ══════════════════════════════════════════════════════════
  // ANDHRA PRADESH CITIES (Sea blues, temple golds)
  // ══════════════════════════════════════════════════════════
  vizag:       t("vizag",       "#02060a", "#0284c7", "#7dd3fc", "#0369a1", "#0a101a"), // Sea blue
  tirupati:    t("tirupati",    "#0a0600", "#eab308", "#fef08a", "#ca8a04", "#1a1205"), // Temple gold
  arakuvalley: t("arakuvalley", "#020804", "#10b981", "#6ee7b7", "#059669", "#0a1a0f"), // Valley green

  // ══════════════════════════════════════════════════════════
  // TELANGANA
  // ══════════════════════════════════════════════════════════
  hyderabad:   t("hyderabad",   "#0a0406", "#f43f5e", "#fda4af", "#e11d48", "#1a0a10"), // Charminar pink/red

  // ══════════════════════════════════════════════════════════
  // SIKKIM CITIES (Mountain purples, monastery reds)
  // ══════════════════════════════════════════════════════════
  gangtok:     t("gangtok",     "#060408", "#8b5cf6", "#c4b5fd", "#7c3aed", "#140e1a"), // Mountain purple
  pelling:     t("pelling",     "#080202", "#ef4444", "#fca5a5", "#dc2626", "#1a0808"), // Monastery red
  ravangla:    t("ravangla",    "#0a0502", "#ea580c", "#fdba74", "#c2410c", "#1a0e05"), // Monastery orange

  // ══════════════════════════════════════════════════════════
  // ARUNACHAL PRADESH CITIES (Monastery crimsons, pine greens)
  // ══════════════════════════════════════════════════════════
  tawang:      t("tawang",      "#0a0202", "#dc2626", "#fca5a5", "#b91c1c", "#1a0808"), // Crimson red
  zirovalley:  t("zirovalley",  "#020804", "#15803d", "#86efac", "#166534", "#0a1a0f"), // Pine green

  // ══════════════════════════════════════════════════════════
  // NAGALAND CITIES (Tribal oranges, forest greens)
  // ══════════════════════════════════════════════════════════
  kohima:      t("kohima",      "#0a0400", "#ea580c", "#fdba74", "#c2410c", "#1a0b05"), // Tribal orange
  dimapur:     t("dimapur",     "#020804", "#15803d", "#86efac", "#166534", "#0a1a0f"), // Forest green

  // ══════════════════════════════════════════════════════════
  // MANIPUR CITIES (Lake blues, lily greens)
  // ══════════════════════════════════════════════════════════
  imphal:      t("imphal",      "#020806", "#059669", "#6ee7b7", "#047857", "#0a1a14"), // Lily green
  loktaklake:  t("loktaklake",  "#02060a", "#0284c7", "#7dd3fc", "#0369a1", "#0a101a"), // Lake blue

  // ══════════════════════════════════════════════════════════
  // MIZORAM
  // ══════════════════════════════════════════════════════════
  aizawl:      t("aizawl",      "#020804", "#16a34a", "#4ade80", "#15803d", "#0a1a0f"), // Bamboo green

  // ══════════════════════════════════════════════════════════
  // TRIPURA CITIES (Palace whites, lake blues)
  // ══════════════════════════════════════════════════════════
  agartala:    t("agartala",    "#060608", "#94a3b8", "#f1f5f9", "#64748b", "#14141a"), // Palace white/grey
  neermahal:   t("neermahal",   "#02060a", "#0284c7", "#7dd3fc", "#0369a1", "#0a101a"), // Lake blue

  // ══════════════════════════════════════════════════════════
  // CHHATTISGARH CITIES (Waterfall blues, tribal reds)
  // ══════════════════════════════════════════════════════════
  jagdalpur:   t("jagdalpur",   "#0a0202", "#ef4444", "#fca5a5", "#dc2626", "#1a0a0a"), // Tribal red
  chitrakote:  t("chitrakote",  "#02060a", "#0284c7", "#7dd3fc", "#0369a1", "#0a101a"), // Waterfall blue

  // ══════════════════════════════════════════════════════════
  // JHARKHAND CITIES (Forest greens, hill blues)
  // ══════════════════════════════════════════════════════════
  ranchi:      t("ranchi",      "#020804", "#15803d", "#86efac", "#166534", "#0a1a0f"), // Forest green
  deoghar:     t("deoghar",     "#0a0600", "#ea580c", "#fdba74", "#c2410c", "#1a1205"), // Spiritual orange
  netarhat:    t("netarhat",    "#02060a", "#0284c7", "#7dd3fc", "#0369a1", "#0a101a"), // Hill blue

  // ══════════════════════════════════════════════════════════
  // BIHAR CITIES (Buddhist saffrons, ruin browns)
  // ══════════════════════════════════════════════════════════
  bodhgaya:    t("bodhgaya",    "#0a0500", "#d97706", "#fde047", "#b45309", "#1a1005"), // Saffron gold
  rajgir:      t("rajgir",      "#080502", "#78350f", "#d97706", "#451a03", "#140e05"), // Ruin brown
  nalanda:     t("nalanda",     "#080502", "#9a3412", "#fdba74", "#7c2d12", "#140e05"), // Ruin red/brown

  // ══════════════════════════════════════════════════════════
  // UTTAR PRADESH CITIES (Ganga blues, Mughal greens, spiritual saffrons)
  // ══════════════════════════════════════════════════════════
  varanasi:    t("varanasi",    "#0a0400", "#ea580c", "#fdba74", "#c2410c", "#1a0e05"), // Saffron
  agra:        t("agra",        "#060806", "#0f766e", "#5eead4", "#115e59", "#141a14"), // Mughal green
  lucknow:     t("lucknow",     "#080204", "#db2777", "#fbcfe8", "#be185d", "#140a10"), // Nawabi pink
  mathura:     t("mathura",     "#0a0600", "#d97706", "#fef08a", "#b45309", "#1a1205"), // Spiritual gold
  prayagraj:   t("prayagraj",   "#02060a", "#0284c7", "#7dd3fc", "#0369a1", "#0a101a"), // Ganga blue

  // ══════════════════════════════════════════════════════════
  // HARYANA
  // ══════════════════════════════════════════════════════════
  kurukshetra: t("kurukshetra", "#0a0502", "#c2410c", "#fdba74", "#9a3412", "#1a0e05"), // Heritage orange
  sultanpur:   t("sultanpur",   "#020804", "#16a34a", "#86efac", "#15803d", "#0a1a0f"), // Green

  // ══════════════════════════════════════════════════════════
  // ANDAMAN & NICOBAR CITIES (Coral turquoises, beach whites)
  // ══════════════════════════════════════════════════════════
  portblair:   t("portblair",   "#02080a", "#06b6d4", "#cffafe", "#0891b2", "#0a1a20"), // Turquoise
  havelock:    t("havelock",    "#02080a", "#0891b2", "#67e8f9", "#0e7490", "#0a1a20"), // Coral blue
  neilisland:  t("neilisland",  "#040608", "#38bdf8", "#f8fafc", "#0284c7", "#0e141a"), // Beach white / Sky blue

  // ══════════════════════════════════════════════════════════
  // LAKSHADWEEP CITIES (Lagoon cyans, coral whites)
  // ══════════════════════════════════════════════════════════
  kavaratti:   t("kavaratti",   "#02080a", "#06b6d4", "#cffafe", "#0891b2", "#0a1a20"), // Cyan
  bangaram:    t("bangaram",    "#02080a", "#0891b2", "#67e8f9", "#0e7490", "#0a1a20"), // Lagoon blue
  agatti:      t("agatti",      "#040608", "#38bdf8", "#f8fafc", "#0284c7", "#0e141a"), // White sand / light blue
}

export const getSeasonTheme = () => {
  return themes.summer // temporarily hardcoded for competition
}