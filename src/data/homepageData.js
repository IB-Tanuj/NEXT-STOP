// ── Summer Getaway Images (optimized WebP) ─────────────
import goa1 from "../assets/spotlight-optimized/goa-1.webp"
import goa2 from "../assets/spotlight-optimized/goa-2.webp"
import goa3 from "../assets/spotlight-optimized/goa-3.webp"
import goa4 from "../assets/spotlight-optimized/goa-4.webp"

import gulmarg1 from "../assets/spotlight-optimized/gulmarg-1.webp"
import gulmarg2 from "../assets/spotlight-optimized/gulmarg-2.webp"
import gulmarg3 from "../assets/spotlight-optimized/gulmarg-3.webp"
import gulmarg4 from "../assets/spotlight-optimized/gulmarg-4.webp"

import kerala1 from "../assets/spotlight-optimized/kerala-1.webp"
import kerala2 from "../assets/spotlight-optimized/kerala-2.webp"
import kerala3 from "../assets/spotlight-optimized/kerala-3.webp"
import kerala4 from "../assets/spotlight-optimized/kerala-4.webp"

import ladhak1 from "../assets/spotlight-optimized/ladhak-1.webp"
import ladhak2 from "../assets/spotlight-optimized/ladhak-2.webp"
import ladhak3 from "../assets/spotlight-optimized/ladhak-3.webp"
import ladhak4 from "../assets/spotlight-optimized/ladhak-4.webp"
import ladhak5 from "../assets/spotlight-optimized/ladhak-5.webp"

import manali1 from "../assets/spotlight-optimized/manali-1.webp"
import manali2 from "../assets/spotlight-optimized/manali-2.webp"
import manali3 from "../assets/spotlight-optimized/manali-3.webp"
import manali4 from "../assets/spotlight-optimized/manali-4.webp"
import manali5 from "../assets/spotlight-optimized/manali-5.webp"

import munnar1 from "../assets/spotlight-optimized/munnar-1.webp"
import munnar2 from "../assets/spotlight-optimized/munnar-2.webp"
import munnar3 from "../assets/spotlight-optimized/munnar-3.webp"
import munnar4 from "../assets/spotlight-optimized/munnar-4.webp"

import rajasthan1 from "../assets/spotlight-optimized/rajasthan-1.webp"
import rajasthan2 from "../assets/spotlight-optimized/rajasthan-2.webp"
import rajasthan3 from "../assets/spotlight-optimized/rajasthan-3.webp"
import rajasthan4 from "../assets/spotlight-optimized/rajasthan-4.webp"
import rajasthan5 from "../assets/spotlight-optimized/rajasthan-5.webp"
import rajasthan6 from "../assets/spotlight-optimized/rajasthan-6.webp"

import shimla1 from "../assets/spotlight-optimized/shimla-1.webp"
import shimla2 from "../assets/spotlight-optimized/shimla-2.webp"
import shimla3 from "../assets/spotlight-optimized/shimla-3.webp"
import shimla4 from "../assets/spotlight-optimized/shimla-4.webp"

import spiti1 from "../assets/spotlight-optimized/spiti-1.webp"
import spiti2 from "../assets/spotlight-optimized/spiti-2.webp"
import spiti3 from "../assets/spotlight-optimized/spiti-3.webp"
import spiti4 from "../assets/spotlight-optimized/spiti-4.webp"

// ── Summer Getaways Data ────────────────────────────────
export const summerGetaways = [
  {
    name: "Manali",
    state: "Himachal Pradesh",
    tagline: "Snow-capped peaks & cool valleys",
    temp: "12°C - 22°C",
    images: [manali1, manali2, manali3, manali4, manali5],
    isExisting: true,
  },
  {
    name: "Leh Ladakh",
    state: "Ladakh",
    tagline: "High altitude desert, clear skies",
    temp: "5°C - 18°C",
    images: [ladhak1, ladhak2, ladhak3, ladhak4, ladhak5],
    isExisting: false,
  },
  {
    name: "Shimla",
    state: "Himachal Pradesh",
    tagline: "Colonial charm, pine forests",
    temp: "15°C - 25°C",
    images: [shimla1, shimla2, shimla3, shimla4],
    isExisting: false,
  },
  {
    name: "Spiti Valley",
    state: "Himachal Pradesh",
    tagline: "Cold desert, ancient monasteries",
    temp: "10°C - 20°C",
    images: [spiti1, spiti2, spiti3, spiti4],
    isExisting: false,
  },
  {
    name: "Munnar",
    state: "Kerala",
    tagline: "Misty tea gardens & waterfalls",
    temp: "18°C - 26°C",
    images: [munnar1, munnar2, munnar3, munnar4],
    isExisting: true,
  },
  {
    name: "Gulmarg",
    state: "Jammu & Kashmir",
    tagline: "Meadows of flowers, gondola rides",
    temp: "8°C - 20°C",
    images: [gulmarg1, gulmarg2, gulmarg3, gulmarg4],
    isExisting: false,
  },
]

// ── 4 Built Locations Spotlight ─────────────────────────
export const spotPhotos = {
  goa: { heroImages: [goa1, goa2, goa3, goa4] },
  manali: { heroImages: [manali1, manali2, manali3, manali4] },
  kerala: { heroImages: [kerala1, kerala2, kerala3, kerala4] },
  rajasthan: { heroImages: [rajasthan1, rajasthan2, rajasthan3, rajasthan4,rajasthan5,rajasthan6] },
}