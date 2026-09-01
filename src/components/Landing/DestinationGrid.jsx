import { useNavigate } from "react-router-dom"

// Season-specific destination data with static images
const SEASON_DESTINATIONS = {
  varsha: [
    { name: "Munnar", state: "Kerala", tag: "PHOTO 1", desc: "Tea slopes drowned in mist and rain-washed green.", img: "/landing/munnar.jpg" },
    { name: "Coorg", state: "Karnataka", tag: "PHOTO 2", desc: "Coffee country where clouds walk the hills.", img: "/landing/coorg.png" },
    { name: "Leh", state: "Ladakh", tag: "PHOTO 3", desc: "Snowlit ridgelines over a high cold desert.", img: "/landing/leh-ladakh.png" },
    { name: "Udaipur", state: "Rajasthan", tag: "PHOTO 4", desc: "Lake palaces floating on full monsoon waters.", img: "/landing/udaipur.png" },
  ],
  // Other seasons will use the same images for now — content varies
  grishma: [
    { name: "Leh", state: "Ladakh", tag: "ESCAPE 1", desc: "High passes and cold desert air.", img: "/landing/leh-ladakh.png" },
    { name: "Munnar", state: "Kerala", tag: "ESCAPE 2", desc: "Misty tea gardens far from the heat.", img: "/landing/munnar.jpg" },
    { name: "Coorg", state: "Karnataka", tag: "ESCAPE 3", desc: "Cool coffee hills, shaded waterfalls.", img: "/landing/coorg.png" },
    { name: "Udaipur", state: "Rajasthan", tag: "ESCAPE 4", desc: "Lake breezes in the city of palaces.", img: "/landing/udaipur.png" },
  ],
  sharad: [
    { name: "Udaipur", state: "Rajasthan", tag: "GOLDEN 1", desc: "Lake palaces bathed in autumn light.", img: "/landing/udaipur.png" },
    { name: "Munnar", state: "Kerala", tag: "GOLDEN 2", desc: "Emerald hills under golden skies.", img: "/landing/munnar.jpg" },
    { name: "Coorg", state: "Karnataka", tag: "GOLDEN 3", desc: "Coffee harvest in crisp autumn air.", img: "/landing/coorg.png" },
    { name: "Leh", state: "Ladakh", tag: "GOLDEN 4", desc: "Last window before snow closes the passes.", img: "/landing/leh-ladakh.png" },
  ],
  hemant: [
    { name: "Leh", state: "Ladakh", tag: "WINTER 1", desc: "Frozen lakes under a vast winter sky.", img: "/landing/leh-ladakh.png" },
    { name: "Udaipur", state: "Rajasthan", tag: "WINTER 2", desc: "Cool desert nights, warm palace glow.", img: "/landing/udaipur.png" },
    { name: "Munnar", state: "Kerala", tag: "WINTER 3", desc: "Misty mornings in the Western Ghats.", img: "/landing/munnar.jpg" },
    { name: "Coorg", state: "Karnataka", tag: "WINTER 4", desc: "Spice gardens in the gentle cold.", img: "/landing/coorg.png" },
  ],
  shishir: [
    { name: "Udaipur", state: "Rajasthan", tag: "FROST 1", desc: "Desert city glowing in late winter sun.", img: "/landing/udaipur.png" },
    { name: "Munnar", state: "Kerala", tag: "FROST 2", desc: "Dew on tea leaves at dawn.", img: "/landing/munnar.jpg" },
    { name: "Leh", state: "Ladakh", tag: "FROST 3", desc: "Chadar trek season on frozen rivers.", img: "/landing/leh-ladakh.png" },
    { name: "Coorg", state: "Karnataka", tag: "FROST 4", desc: "Quiet coffee plantations, misty mornings.", img: "/landing/coorg.png" },
  ],
  vasant: [
    { name: "Munnar", state: "Kerala", tag: "BLOOM 1", desc: "Wildflowers carpet the hill slopes.", img: "/landing/munnar.jpg" },
    { name: "Coorg", state: "Karnataka", tag: "BLOOM 2", desc: "Spring blossoms over coffee country.", img: "/landing/coorg.png" },
    { name: "Udaipur", state: "Rajasthan", tag: "BLOOM 3", desc: "Lakeside gardens in full spring colour.", img: "/landing/udaipur.png" },
    { name: "Leh", state: "Ladakh", tag: "BLOOM 4", desc: "Apricot blossoms in the high valleys.", img: "/landing/leh-ladakh.png" },
  ],
}

const SEASON_COPY = {
  varsha: { eyebrow: "Monsoon Edit · Varsha 🌧️", heading: "Where the rain wants you right now", sub: "Four stops that peak between July and September — priced live, guided deeply." },
  grishma: { eyebrow: "Summer Edit · Grishma ☀️", heading: "Cool escapes from the Indian heat", sub: "Hill stations and high passes to beat the scorching plains." },
  sharad: { eyebrow: "Autumn Edit · Sharad 🍁", heading: "Golden light, golden journeys", sub: "Four spots that glow when the monsoon retreats and autumn arrives." },
  hemant: { eyebrow: "Winter Edit · Hemant ❄️", heading: "Where winter is kindest", sub: "From snow-peaked north to sun-warmed south — pick your December." },
  shishir: { eyebrow: "Late Winter · Shishir ☃️", heading: "Crisp trails before the spring", sub: "Frost-kissed mornings and clear skies — India at its quietest." },
  vasant: { eyebrow: "Spring Edit · Vasant 🌸", heading: "Bloom season across India", sub: "Flowers, festivals and perfect weather — travel at its finest." },
}

const DestinationGrid = ({ seasonKey }) => {
  const navigate = useNavigate()
  const destinations = SEASON_DESTINATIONS[seasonKey] || SEASON_DESTINATIONS.varsha
  const copy = SEASON_COPY[seasonKey] || SEASON_COPY.varsha

  return (
    <section className="destinations reveal" id="destinations">
      <div className="section-head">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.heading}</h2>
        <p className="sub">{copy.sub}</p>
      </div>

      <div className="destination-grid">
        {destinations.map((dest, i) => (
          <article key={i} className="dest-card">
            <img src={dest.img} alt={`${dest.name}, ${dest.state}`} loading="lazy" />
            <div className="dest-info">
              <span className="dest-tag">{dest.tag} · {dest.state}</span>
              <h3>{dest.name}</h3>
              <p>{dest.desc}</p>
              <button
                className="btn btn-solid plan-btn"
                type="button"
                onClick={() => navigate("/login")}
              >
                Plan Now
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default DestinationGrid
