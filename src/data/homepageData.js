// ── Summer Getaway Images (4 per location) ─────────────
import goa1 from "../assets/spotlight/goa-1.jpg"
import goa2 from "../assets/spotlight/goa-2.jpg"
import goa3 from "../assets/spotlight/goa-3.jpg"
import goa4 from "../assets/spotlight/goa-4.jpg"

import gulmarg1 from "../assets/spotlight/gulmarg-1.jpg"
import gulmarg2 from "../assets/spotlight/gulmarg-2.jpg"
import gulmarg3 from "../assets/spotlight/gulmarg-3.jpg"
import gulmarg4 from "../assets/spotlight/gulmarg-4.jpg"

import kerala1 from "../assets/spotlight/kerala-1.jpg"
import kerala2 from "../assets/spotlight/kerala-2.jpg"
import kerala3 from "../assets/spotlight/kerala-3.jpg"
import kerala4 from "../assets/spotlight/kerala-4.jpg"

import ladhak1 from "../assets/spotlight/ladhak-1.jpg"
import ladhak2 from "../assets/spotlight/ladhak-2.jpg"
import ladhak3 from "../assets/spotlight/ladhak-3.jpg"
import ladhak4 from "../assets/spotlight/ladhak-4.jpg"
import ladhak5 from "../assets/spotlight/ladhak-5.jpg"

import manali1 from "../assets/spotlight/manali-1.jpg"
import manali2 from "../assets/spotlight/manali-2.jpg"
import manali3 from "../assets/spotlight/manali-3.jpg"
import manali4 from "../assets/spotlight/manali-4.jpg"
import manali5 from "../assets/spotlight/manali-5.jpg"

import munnar1 from "../assets/spotlight/munnar-1.jpg"
import munnar2 from "../assets/spotlight/munnar-2.jpg"
import munnar3 from "../assets/spotlight/munnar-3.jpg"
import munnar4 from "../assets/spotlight/munnar-4.jpg"

import rajasthan1 from "../assets/spotlight/rajasthan-1.jpg"
import rajasthan2 from "../assets/spotlight/rajasthan-2.jpg"
import rajasthan3 from "../assets/spotlight/rajasthan-3.jpg"
import rajasthan4 from "../assets/spotlight/rajasthan-4.jpg"
import rajasthan5 from "../assets/spotlight/rajasthan-5.jpg"
import rajasthan6 from "../assets/spotlight/rajasthan-6.jpg"

import shimla1 from "../assets/spotlight/shimla-1.jpg"
import shimla2 from "../assets/spotlight/shimla-2.jpg"
import shimla3 from "../assets/spotlight/shimla-3.jpg"
import shimla4 from "../assets/spotlight/shimla-4.jpg"

import spiti1 from "../assets/spotlight/spiti-1.jpg"
import spiti2 from "../assets/spotlight/spiti-2.jpg"
import spiti3 from "../assets/spotlight/spiti-3.jpg"
import spiti4 from "../assets/spotlight/spiti-4.jpg"

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