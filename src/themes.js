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
  // RAJASTHAN CITIES
  // ══════════════════════════════════════════════════════════
  jaipur:      t("jaipur",      "#0a0304", "#E8556D", "#FFB3C1", "#C9184A", "#1a0a10"),
  udaipur:     t("udaipur",     "#040608", "#5E9FD8", "#A3D5FF", "#2E6BA4", "#0a1420"),
  jodhpur:     t("jodhpur",     "#03050a", "#5B8DEF", "#93B5F5", "#2563EB", "#0a1028"),
  jaisalmer:   t("jaisalmer",   "#0a0800", "#E8B84A", "#F5D98A", "#B8860B", "#1a1200"),
  pushkar:     t("pushkar",     "#080408", "#C084FC", "#E0B0FF", "#8B5CF6", "#140a1e"),
  mountabu:    t("mountabu",    "#020806", "#4CAF50", "#81C784", "#2E7D32", "#0a1a10"),

  // ══════════════════════════════════════════════════════════
  // HIMACHAL PRADESH CITIES
  // ══════════════════════════════════════════════════════════
  shimla:      t("shimla",      "#060208", "#9C7AB8", "#C4A6D9", "#7B2D8E", "#120a1c"),
  dharamshala: t("dharamshala", "#0a0402", "#D97706", "#FBBF24", "#92400E", "#1a0e06"),
  kasol:       t("kasol",       "#020a04", "#34D399", "#6EE7B7", "#059669", "#0a1e10"),
  spiti:       t("spiti",       "#080604", "#C4956A", "#DEBA8E", "#8B6914", "#1a1208"),
  birbilling:  t("birbilling",  "#020608", "#38BDF8", "#7DD3FC", "#0284C7", "#0a1420"),

  // ══════════════════════════════════════════════════════════
  // UTTARAKHAND CITIES
  // ══════════════════════════════════════════════════════════
  rishikesh:   t("rishikesh",   "#020806", "#14B8A6", "#5EEAD4", "#0D9488", "#0a1a14"),
  nainital:    t("nainital",    "#030610", "#60A5FA", "#93C5FD", "#2563EB", "#0a1228"),
  mussoorie:   t("mussoorie",   "#040804", "#84CC16", "#BEF264", "#65A30D", "#0e1a0a"),
  haridwar:    t("haridwar",    "#0a0600", "#F59E0B", "#FCD34D", "#B45309", "#1a1000"),
  chopta:      t("chopta",      "#020a06", "#22C55E", "#86EFAC", "#15803D", "#0a1e0e"),
  auli:        t("auli",        "#030818", "#818CF8", "#A5B4FC", "#4F46E5", "#0a1030"),

  // ══════════════════════════════════════════════════════════
  // KERALA CITIES
  // ══════════════════════════════════════════════════════════
  kochi:       t("kochi",       "#06020a", "#E879F9", "#F0ABFC", "#C026D3", "#14081e"),
  munnar:      t("munnar",      "#020a02", "#4ADE80", "#86EFAC", "#16A34A", "#0a1e0a"),
  alleppey:    t("alleppey",    "#020610", "#3B82F6", "#93C5FD", "#1D4ED8", "#0a1228"),
  wayanad:     t("wayanad",     "#060a02", "#A3E635", "#D9F99D", "#65A30D", "#121e06"),
  varkala:     t("varkala",     "#020808", "#2DD4BF", "#99F6E4", "#0D9488", "#0a1a18"),
  thekkady:    t("thekkady",    "#040802", "#A3A830", "#D4D95A", "#6B8E23", "#101a06"),

  // ══════════════════════════════════════════════════════════
  // KARNATAKA CITIES
  // ══════════════════════════════════════════════════════════
  bangalore:   t("bangalore",   "#060406", "#A78BFA", "#C4B5FD", "#7C3AED", "#120e18"),
  mysore:      t("mysore",      "#0a0600", "#EAB308", "#FDE047", "#A16207", "#1a1200"),
  hampi:       t("hampi",       "#080402", "#D97706", "#FCD34D", "#92400E", "#1a0e06"),
  coorg:       t("coorg",       "#040802", "#6B8E23", "#9AB055", "#4A6316", "#0e1a06"),
  gokarna:     t("gokarna",     "#020608", "#06B6D4", "#67E8F9", "#0891B2", "#0a1420"),
  dandeli:     t("dandeli",     "#020802", "#22C55E", "#86EFAC", "#15803D", "#0a1a08"),

  // ══════════════════════════════════════════════════════════
  // TAMIL NADU CITIES
  // ══════════════════════════════════════════════════════════
  chennai:     t("chennai",     "#0a0204", "#F43F5E", "#FDA4AF", "#BE123C", "#1a0810"),
  pondicherry: t("pondicherry", "#0a0800", "#FACC15", "#FEF08A", "#CA8A04", "#1a1400"),
  ooty:        t("ooty",        "#040a06", "#4ADE80", "#BBF7D0", "#16A34A", "#0e1e10"),
  madurai:     t("madurai",     "#080204", "#DC2626", "#FCA5A5", "#991B1B", "#1a0808"),
  kodaikanal:  t("kodaikanal",  "#020610", "#6366F1", "#A5B4FC", "#4338CA", "#0a1028"),
  rameswaram:  t("rameswaram",  "#040608", "#0EA5E9", "#7DD3FC", "#0369A1", "#0e1420"),

  // ══════════════════════════════════════════════════════════
  // MAHARASHTRA CITIES
  // ══════════════════════════════════════════════════════════
  mumbai:      t("mumbai",      "#04040a", "#6366F1", "#A5B4FC", "#4338CA", "#0e0e20"),
  pune:        t("pune",        "#060406", "#8B5CF6", "#C4B5FD", "#6D28D9", "#120e1a"),
  lonavala:    t("lonavala",    "#020806", "#10B981", "#6EE7B7", "#047857", "#0a1a10"),
  mahabaleshwar: t("mahabaleshwar", "#020a04", "#059669", "#34D399", "#065F46", "#0a1e0e"),
  ajantaellora: t("ajantaellora", "#0a0602", "#B45309", "#F59E0B", "#78350F", "#1a1006"),
  konkan:      t("konkan",      "#020608", "#0891B2", "#22D3EE", "#155E75", "#0a1418"),

  // ══════════════════════════════════════════════════════════
  // WEST BENGAL CITIES
  // ══════════════════════════════════════════════════════════
  kolkata:     t("kolkata",     "#0a0602", "#D97706", "#FBBF24", "#92400E", "#1a1006"),
  darjeeling:  t("darjeeling",  "#040604", "#65A30D", "#A3E635", "#3F6212", "#0e1408"),
  sundarbans:  t("sundarbans",  "#020604", "#0D9488", "#5EEAD4", "#115E59", "#0a1410"),
  shantiniketan: t("shantiniketan", "#080602", "#CA8A04", "#EAB308", "#854D0E", "#181206"),

  // ══════════════════════════════════════════════════════════
  // PUNJAB CITIES
  // ══════════════════════════════════════════════════════════
  amritsar:    t("amritsar",    "#0a0800", "#F59E0B", "#FDE047", "#B45309", "#1a1400"),
  chandigarh:  t("chandigarh",  "#020804", "#16A34A", "#4ADE80", "#15803D", "#0a1a0a"),

  // ══════════════════════════════════════════════════════════
  // GUJARAT CITIES
  // ══════════════════════════════════════════════════════════
  ahmedabad:   t("ahmedabad",   "#080402", "#EA580C", "#FB923C", "#9A3412", "#1a0e06"),
  rannofkutch: t("rannofkutch", "#06060a", "#94A3B8", "#CBD5E1", "#64748B", "#121420"),
  somnath:     t("somnath",     "#080600", "#EAB308", "#FDE047", "#A16207", "#1a1200"),
  dwarka:      t("dwarka",      "#020608", "#0EA5E9", "#7DD3FC", "#0369A1", "#0a1418"),
  girforest:   t("girforest",   "#040802", "#4D7C0F", "#84CC16", "#365314", "#101a06"),

  // ══════════════════════════════════════════════════════════
  // JAMMU & KASHMIR CITIES
  // ══════════════════════════════════════════════════════════
  srinagar:    t("srinagar",    "#040210", "#7C3AED", "#A78BFA", "#5B21B6", "#0e0820"),
  gulmarg:     t("gulmarg",     "#030818", "#60A5FA", "#BFDBFE", "#1D4ED8", "#0a1030"),
  pahalgam:    t("pahalgam",    "#020a06", "#22C55E", "#86EFAC", "#15803D", "#0a1e0e"),
  sonamarg:    t("sonamarg",    "#040818", "#818CF8", "#C7D2FE", "#4F46E5", "#0e1430"),

  // ══════════════════════════════════════════════════════════
  // LADAKH CITIES
  // ══════════════════════════════════════════════════════════
  leh:         t("leh",         "#080604", "#A0845C", "#C4A87A", "#7A6240", "#1a1208"),
  pangonglake: t("pangonglake", "#020610", "#2563EB", "#60A5FA", "#1E40AF", "#0a1228"),
  nubravalley: t("nubravalley", "#060804", "#B8860B", "#DAA520", "#8B6508", "#141a08"),

  // ══════════════════════════════════════════════════════════
  // MEGHALAYA CITIES
  // ══════════════════════════════════════════════════════════
  shillong:    t("shillong",    "#040608", "#0EA5E9", "#7DD3FC", "#0369A1", "#0e1420"),
  cherrapunji: t("cherrapunji", "#020608", "#06B6D4", "#67E8F9", "#0E7490", "#0a1418"),
  dawki:       t("dawki",       "#020a0a", "#14B8A6", "#5EEAD4", "#0F766E", "#0a1e1e"),

  // ══════════════════════════════════════════════════════════
  // ASSAM CITIES
  // ══════════════════════════════════════════════════════════
  guwahati:    t("guwahati",    "#060402", "#B45309", "#F59E0B", "#78350F", "#140e06"),
  kaziranga:   t("kaziranga",   "#040802", "#4D7C0F", "#84CC16", "#365314", "#101a06"),
  majuli:      t("majuli",      "#040608", "#0284C7", "#38BDF8", "#075985", "#0e1420"),

  // ══════════════════════════════════════════════════════════
  // ODISHA CITIES
  // ══════════════════════════════════════════════════════════
  bhubaneswar: t("bhubaneswar", "#080402", "#D97706", "#FBBF24", "#92400E", "#1a0e06"),
  puri:        t("puri",        "#020608", "#0891B2", "#22D3EE", "#155E75", "#0a1418"),
  konark:      t("konark",      "#0a0600", "#CA8A04", "#EAB308", "#854D0E", "#1a1200"),

  // ══════════════════════════════════════════════════════════
  // MADHYA PRADESH CITIES
  // ══════════════════════════════════════════════════════════
  indore:      t("indore",      "#080204", "#E11D48", "#FB7185", "#9F1239", "#1a0810"),
  khajuraho:   t("khajuraho",   "#080602", "#A0522D", "#CD853F", "#8B4513", "#1a1206"),
  ujjain:      t("ujjain",      "#060208", "#9333EA", "#C084FC", "#6B21A8", "#120a1e"),
  pachmarhi:   t("pachmarhi",   "#020802", "#16A34A", "#4ADE80", "#0F5323", "#0a1a08"),
  sanchi:      t("sanchi",      "#080600", "#B8860B", "#DAA520", "#8B6508", "#1a1200"),

  // ══════════════════════════════════════════════════════════
  // ANDHRA PRADESH CITIES
  // ══════════════════════════════════════════════════════════
  vizag:       t("vizag",       "#020608", "#0EA5E9", "#7DD3FC", "#0369A1", "#0a1420"),
  tirupati:    t("tirupati",    "#0a0800", "#EAB308", "#FDE047", "#A16207", "#1a1400"),
  arakuvalley: t("arakuvalley", "#020a04", "#22C55E", "#86EFAC", "#15803D", "#0a1e0e"),

  // ══════════════════════════════════════════════════════════
  // TELANGANA
  // ══════════════════════════════════════════════════════════
  hyderabad:   t("hyderabad",   "#080208", "#D946EF", "#F0ABFC", "#A21CAF", "#1a0a1e"),

  // ══════════════════════════════════════════════════════════
  // SIKKIM CITIES
  // ══════════════════════════════════════════════════════════
  gangtok:     t("gangtok",     "#040610", "#7C3AED", "#A78BFA", "#5B21B6", "#0e1028"),
  pelling:     t("pelling",     "#020a08", "#0D9488", "#5EEAD4", "#115E59", "#0a1e18"),
  ravangla:    t("ravangla",    "#040608", "#0284C7", "#38BDF8", "#075985", "#0e1420"),

  // ══════════════════════════════════════════════════════════
  // ARUNACHAL PRADESH CITIES
  // ══════════════════════════════════════════════════════════
  tawang:      t("tawang",      "#080210", "#DC2626", "#FCA5A5", "#991B1B", "#1a0820"),
  zirovalley:  t("zirovalley",  "#020804", "#16A34A", "#4ADE80", "#0F5323", "#0a1a0a"),

  // ══════════════════════════════════════════════════════════
  // NAGALAND CITIES
  // ══════════════════════════════════════════════════════════
  kohima:      t("kohima",      "#0a0402", "#EA580C", "#FB923C", "#9A3412", "#1a0e06"),
  dimapur:     t("dimapur",     "#040602", "#65A30D", "#A3E635", "#3F6212", "#0e1406"),

  // ══════════════════════════════════════════════════════════
  // MANIPUR CITIES
  // ══════════════════════════════════════════════════════════
  imphal:      t("imphal",      "#060408", "#8B5CF6", "#C4B5FD", "#6D28D9", "#120e1e"),
  loktaklake:  t("loktaklake",  "#020a08", "#0D9488", "#5EEAD4", "#0F766E", "#0a1e18"),

  // ══════════════════════════════════════════════════════════
  // MIZORAM
  // ══════════════════════════════════════════════════════════
  aizawl:      t("aizawl",      "#040604", "#15803D", "#4ADE80", "#166534", "#0e1408"),

  // ══════════════════════════════════════════════════════════
  // TRIPURA CITIES
  // ══════════════════════════════════════════════════════════
  agartala:    t("agartala",    "#060408", "#7C3AED", "#A78BFA", "#5B21B6", "#120e1e"),
  neermahal:   t("neermahal",   "#020610", "#3B82F6", "#93C5FD", "#1D4ED8", "#0a1228"),

  // ══════════════════════════════════════════════════════════
  // CHHATTISGARH CITIES
  // ══════════════════════════════════════════════════════════
  jagdalpur:   t("jagdalpur",   "#020804", "#059669", "#34D399", "#065F46", "#0a1a0e"),
  chitrakote:  t("chitrakote",  "#020608", "#0891B2", "#22D3EE", "#155E75", "#0a1418"),

  // ══════════════════════════════════════════════════════════
  // JHARKHAND CITIES
  // ══════════════════════════════════════════════════════════
  ranchi:      t("ranchi",      "#040604", "#65A30D", "#A3E635", "#3F6212", "#0e1408"),
  deoghar:     t("deoghar",     "#080600", "#CA8A04", "#EAB308", "#854D0E", "#181200"),
  netarhat:    t("netarhat",    "#020806", "#10B981", "#6EE7B7", "#047857", "#0a1a10"),

  // ══════════════════════════════════════════════════════════
  // BIHAR CITIES
  // ══════════════════════════════════════════════════════════
  bodhgaya:    t("bodhgaya",    "#0a0800", "#F59E0B", "#FDE047", "#B45309", "#1a1400"),
  rajgir:      t("rajgir",      "#060602", "#A0522D", "#CD853F", "#8B4513", "#141206"),
  nalanda:     t("nalanda",     "#080602", "#B8860B", "#DAA520", "#8B6508", "#1a1206"),

  // ══════════════════════════════════════════════════════════
  // UTTAR PRADESH CITIES
  // ══════════════════════════════════════════════════════════
  varanasi:    t("varanasi",    "#0a0400", "#FF8C00", "#FFB347", "#CC5500", "#1a0e00"),
  agra:        t("agra",        "#060608", "#94A3B8", "#CBD5E1", "#64748B", "#121420"),
  lucknow:     t("lucknow",     "#080208", "#EC4899", "#F9A8D4", "#BE185D", "#1a0a1a"),
  mathura:     t("mathura",     "#060208", "#8B5CF6", "#C4B5FD", "#6D28D9", "#120a1e"),
  prayagraj:   t("prayagraj",   "#080600", "#D97706", "#FBBF24", "#92400E", "#1a1200"),

  // ══════════════════════════════════════════════════════════
  // HARYANA CITIES
  // ══════════════════════════════════════════════════════════
  kurukshetra: t("kurukshetra", "#0a0600", "#EAB308", "#FDE047", "#A16207", "#1a1200"),
  sultanpur:   t("sultanpur",   "#020804", "#16A34A", "#4ADE80", "#15803D", "#0a1a0a"),

  // ══════════════════════════════════════════════════════════
  // ANDAMAN & NICOBAR CITIES
  // ══════════════════════════════════════════════════════════
  portblair:   t("portblair",   "#020608", "#06B6D4", "#67E8F9", "#0E7490", "#0a1418"),
  havelock:    t("havelock",    "#020a0a", "#14B8A6", "#5EEAD4", "#0F766E", "#0a1e1e"),
  neilisland:  t("neilisland",  "#020810", "#0EA5E9", "#7DD3FC", "#0369A1", "#0a1828"),

  // ══════════════════════════════════════════════════════════
  // LAKSHADWEEP CITIES
  // ══════════════════════════════════════════════════════════
  kavaratti:   t("kavaratti",   "#020808", "#2DD4BF", "#99F6E4", "#0D9488", "#0a1a18"),
  bangaram:    t("bangaram",    "#020a0a", "#14B8A6", "#5EEAD4", "#0F766E", "#0a1e1e"),
  agatti:      t("agatti",      "#020610", "#3B82F6", "#93C5FD", "#1D4ED8", "#0a1228"),
}

//export const getSeasonTheme = () => {
  //const month = new Date().getMonth() + 1
  //if (month >= 3 && month <= 6) return themes.summer
  //if (month >= 7 && month <= 9) return themes.monsoon
  //if (month >= 10 && month <= 11) return themes.autumn
  //if (month === 12 || month <= 2) return themes.winter
  //return themes.spring
//}
export const getSeasonTheme = () => {
  return themes.summer // temporarily hardcoded for competition
}