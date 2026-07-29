// ── Season-specific getaway data (no image imports — fetched from API) ──

export const seasonGetaways = {
  summer: {
    emoji: "☀️",
    label: "Beat The Heat",
    title: "Summer Getaways To Escape To",
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
  monsoon: {
    emoji: "🌧️",
    label: "Chase The Rains",
    title: "Monsoon Escapes You'll Love",
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
  autumn: {
    emoji: "🍂",
    label: "Golden Trails",
    title: "Autumn Adventures Calling",
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
  winter: {
    emoji: "❄️",
    label: "Winter Wonders",
    title: "Winter Escapes Across India",
    subtitle: "From snow-capped peaks to warm beaches — pick your vibe.",
    spots: [
      { name: "Goa", locationKey: "goa", state: "Goa", tagline: "Peak season, perfect weather", temp: "20°C – 32°C" },
      { name: "Kerala", locationKey: "kerala", state: "Kerala", tagline: "Backwaters in perfect weather", temp: "22°C – 32°C" },
      { name: "Jaisalmer", locationKey: "jaisalmer", state: "Rajasthan", tagline: "Golden desert, starry nights", temp: "8°C – 24°C" },
      { name: "Auli", locationKey: "auli", state: "Uttarakhand", tagline: "India's skiing paradise", temp: "−5°C – 10°C" },
      { name: "Pondicherry", locationKey: "pondicherry", state: "Tamil Nadu", tagline: "French Quarter & beaches", temp: "20°C – 30°C" },
      { name: "Manali", locationKey: "manali", state: "Himachal Pradesh", tagline: "Snowfall & cozy cafes", temp: "−2°C – 10°C" },
    ],
  },
}

// Helper to detect current season key
export const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 6) return "summer"
  if (month >= 7 && month <= 9) return "monsoon"
  if (month >= 10 && month <= 11) return "autumn"
  return "winter"
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