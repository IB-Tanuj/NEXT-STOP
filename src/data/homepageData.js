// ── Season-specific getaway data — Indian 6-Season (Ritu) system ──
// No image imports — fetched from API at runtime

export const seasonGetaways = {
  shishir: {
    emoji: "☃️",
    label: "Dew & Frost",
    title: "Shishir — Late Winter Retreats",
    subtitle: "Crisp mornings, misty horizons — the quiet beauty before spring.",
    spots: [
      { name: "Rann of Kutch", locationKey: "kutch", state: "Gujarat", tagline: "White salt desert under winter stars", temp: "8°C – 22°C" },
      { name: "Goa", locationKey: "goa", state: "Goa", tagline: "Peak season, golden sunsets", temp: "20°C – 32°C" },
      { name: "Hampi", locationKey: "hampi", state: "Karnataka", tagline: "Boulder country in perfect light", temp: "16°C – 28°C" },
      { name: "Pondicherry", locationKey: "pondicherry", state: "Tamil Nadu", tagline: "French Quarter & café mornings", temp: "20°C – 30°C" },
      { name: "Varanasi", locationKey: "varanasi", state: "Uttar Pradesh", tagline: "Ghats draped in winter fog", temp: "6°C – 18°C" },
      { name: "Jaisalmer", locationKey: "jaisalmer", state: "Rajasthan", tagline: "Golden desert, starry nights", temp: "8°C – 24°C" },
    ],
  },
  vasant: {
    emoji: "🌸",
    label: "Bloom Season",
    title: "Vasant — Spring Awakens",
    subtitle: "Flowers bloom, festivals stir — India comes alive in colour.",
    spots: [
      { name: "Valley of Flowers", locationKey: "valleyofflowers", state: "Uttarakhand", tagline: "Alpine meadows in full bloom", temp: "8°C – 18°C" },
      { name: "Shillong", locationKey: "shillong", state: "Meghalaya", tagline: "Cherry blossoms & living root bridges", temp: "12°C – 22°C" },
      { name: "Munnar", locationKey: "munnar", state: "Kerala", tagline: "Neelakurinji season approaches", temp: "14°C – 24°C" },
      { name: "Darjeeling", locationKey: "darjeeling", state: "West Bengal", tagline: "Tea gardens with Kanchenjunga views", temp: "10°C – 20°C" },
      { name: "Kodaikanal", locationKey: "kodaikanal", state: "Tamil Nadu", tagline: "Princess of hill stations", temp: "12°C – 22°C" },
      { name: "Srinagar", locationKey: "srinagar", state: "Jammu & Kashmir", tagline: "Tulip gardens & shikara rides", temp: "8°C – 20°C" },
    ],
  },
  grishma: {
    emoji: "☀️",
    label: "Beat The Heat",
    title: "Grishma — Summer Escapes",
    subtitle: "It's hot out there — here's where India is running off to right now.",
    spots: [
      { name: "Manali", locationKey: "manali", state: "Himachal Pradesh", tagline: "Snow-capped peaks & cool valleys", temp: "12°C – 22°C" },
      { name: "Leh Ladakh", locationKey: "ladakh", state: "Ladakh", tagline: "High altitude desert, clear skies", temp: "5°C – 18°C" },
      { name: "Shimla", locationKey: "shimla", state: "Himachal Pradesh", tagline: "Colonial charm, pine forests", temp: "15°C – 25°C" },
      { name: "Spiti Valley", locationKey: "spiti", state: "Himachal Pradesh", tagline: "Cold desert, ancient monasteries", temp: "10°C – 20°C" },
      { name: "Munnar", locationKey: "munnar", state: "Kerala", tagline: "Misty tea gardens & waterfalls", temp: "18°C – 26°C" },
      { name: "Gulmarg", locationKey: "gulmarg", state: "Jammu & Kashmir", tagline: "Meadows of flowers, gondola rides", temp: "8°C – 20°C" },
    ],
  },
  varsha: {
    emoji: "🌧️",
    label: "Chase The Rains",
    title: "Varsha — Monsoon Magic",
    subtitle: "The rains make everything magical — here's where to go.",
    spots: [
      { name: "Coorg", locationKey: "coorg", state: "Karnataka", tagline: "Coffee estates drenched in mist", temp: "15°C – 25°C" },
      { name: "Munnar", locationKey: "munnar", state: "Kerala", tagline: "Tea gardens in the rain clouds", temp: "16°C – 24°C" },
      { name: "Lonavala", locationKey: "lonavala", state: "Maharashtra", tagline: "Waterfalls & misty ghats", temp: "20°C – 28°C" },
      { name: "Udaipur", locationKey: "udaipur", state: "Rajasthan", tagline: "Lakes shimmer in the rain", temp: "24°C – 32°C" },
      { name: "Goa", locationKey: "goa", state: "Goa", tagline: "Off-season charm, empty beaches", temp: "25°C – 30°C" },
      { name: "Wayanad", locationKey: "wayanad", state: "Kerala", tagline: "Lush green spice plantations", temp: "18°C – 26°C" },
    ],
  },
  sharad: {
    emoji: "🍁",
    label: "Golden Trails",
    title: "Sharad — Autumn Adventures",
    subtitle: "Cool weather, golden light — India's best kept travel secret.",
    spots: [
      { name: "Rajasthan", locationKey: "rajasthan", state: "Rajasthan", tagline: "Forts glow in autumn light", temp: "20°C – 30°C" },
      { name: "Varanasi", locationKey: "varanasi", state: "Uttar Pradesh", tagline: "Ghats, spirituality & Dev Deepawali", temp: "18°C – 28°C" },
      { name: "Hampi", locationKey: "hampi", state: "Karnataka", tagline: "Ancient ruins, golden boulders", temp: "22°C – 32°C" },
      { name: "Rishikesh", locationKey: "rishikesh", state: "Uttarakhand", tagline: "River rafting & yoga", temp: "16°C – 28°C" },
      { name: "Darjeeling", locationKey: "darjeeling", state: "West Bengal", tagline: "Tea, trains & Kangchenjunga", temp: "8°C – 18°C" },
      { name: "Jodhpur", locationKey: "jodhpur", state: "Rajasthan", tagline: "The Blue City awakens", temp: "20°C – 32°C" },
    ],
  },
  hemant: {
    emoji: "❄️",
    label: "Winter Wonders",
    title: "Hemant — Early Winter Escapes",
    subtitle: "From snow-capped peaks to warm beaches — pick your vibe.",
    spots: [
      { name: "Goa", locationKey: "goa", state: "Goa", tagline: "Peak season, perfect weather", temp: "20°C – 32°C" },
      { name: "Kerala", locationKey: "kerala", state: "Kerala", tagline: "Backwaters in perfect weather", temp: "22°C – 32°C" },
      { name: "Jaisalmer", locationKey: "jaisalmer", state: "Rajasthan", tagline: "Golden desert, starry nights", temp: "8°C – 24°C" },
      { name: "Auli", locationKey: "auli", state: "Uttarakhand", tagline: "India's skiing paradise", temp: "−5°C – 10°C" },
      { name: "Manali", locationKey: "manali", state: "Himachal Pradesh", tagline: "Snowfall & cozy cafes", temp: "−2°C – 10°C" },
      { name: "Shimla", locationKey: "shimla", state: "Himachal Pradesh", tagline: "First snow on the ridge", temp: "0°C – 12°C" },
    ],
  },
}

// Helper to detect current Indian season key
export const getCurrentSeason = () => {
  const now = new Date()
  const m = now.getMonth()
  const d = now.getDate()
  // Walk backwards through season boundaries (15th of bi-monthly periods)
  const boundaries = [
    { season: "shishir",  month: 0,  day: 15 },
    { season: "vasant",   month: 2,  day: 15 },
    { season: "grishma",  month: 4,  day: 15 },
    { season: "varsha",   month: 6,  day: 15 },
    { season: "sharad",   month: 8,  day: 15 },
    { season: "hemant",   month: 10, day: 15 },
  ]
  for (let i = boundaries.length - 1; i >= 0; i--) {
    const b = boundaries[i]
    if (m > b.month || (m === b.month && d >= b.day)) return b.season
  }
  return "hemant" // Before Jan 15 → still Hemant
}

// ── Static fallback images for 4 built locations ────────
import goa1 from "../assets/spotlight-optimized/goa-1.webp"
import goa2 from "../assets/spotlight-optimized/goa-2.webp"
import goa3 from "../assets/spotlight-optimized/goa-3.webp"
import goa4 from "../assets/spotlight-optimized/goa-4.webp"

import manali1 from "../assets/spotlight-optimized/manali-1.webp"
import manali2 from "../assets/spotlight-optimized/manali-2.webp"
import manali3 from "../assets/spotlight-optimized/manali-3.webp"
import manali4 from "../assets/spotlight-optimized/manali-4.webp"

import kerala1 from "../assets/spotlight-optimized/kerala-1.webp"
import kerala2 from "../assets/spotlight-optimized/kerala-2.webp"
import kerala3 from "../assets/spotlight-optimized/kerala-3.webp"
import kerala4 from "../assets/spotlight-optimized/kerala-4.webp"

import rajasthan1 from "../assets/spotlight-optimized/rajasthan-1.webp"
import rajasthan2 from "../assets/spotlight-optimized/rajasthan-2.webp"
import rajasthan3 from "../assets/spotlight-optimized/rajasthan-3.webp"
import rajasthan4 from "../assets/spotlight-optimized/rajasthan-4.webp"

export const spotPhotos = {
  goa: { heroImages: [goa1, goa2, goa3, goa4] },
  manali: { heroImages: [manali1, manali2, manali3, manali4] },
  kerala: { heroImages: [kerala1, kerala2, kerala3, kerala4] },
  rajasthan: { heroImages: [rajasthan1, rajasthan2, rajasthan3, rajasthan4] },
}