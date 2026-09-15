import React from 'react';
import { useNavigate } from "react-router-dom";
import './ScrollableDestinationGrid.css';

const SPOT_IMAGES = [
  { name: "Gangtok", state: "Sikkim", desc: "Himalayan beauty and serene monasteries.", img: "/landing2/gangtok.webp" },
  { name: "Jaipur", state: "Rajasthan", desc: "The Pink City glowing under autumn skies.", img: "/landing2/jaipur.webp" },
  { name: "Kolkata", state: "West Bengal", desc: "Festive vibes and colonial charm.", img: "/landing2/kolkata.webp" },
  { name: "Leh", state: "Ladakh", desc: "Cold desert skies and high altitude passes.", img: "/landing2/leh.webp" },
  { name: "Shimla", state: "Himachal Pradesh", desc: "Pine forests and colonial architecture.", img: "/landing2/shimla.webp" },
  { name: "Srinagar", state: "Jammu & Kashmir", desc: "Dal lake reflecting the chinar leaves.", img: "/landing2/srinagar.webp" }
];

const ScrollableDestinationGrid = () => {
  const navigate = useNavigate();

  return (
    <section className="scrollable-destinations reveal" id="destinations">
      <div className="section-head">
        <p className="eyebrow">Autumn Edit · Sharad 🍁</p>
        <h2>Golden light, golden journeys</h2>
        <p className="sub">Six spots that glow when the monsoon retreats and autumn arrives.</p>
      </div>

      <div className="horizontal-scroll-container">
        {SPOT_IMAGES.map((dest, i) => (
          <article key={i} className="scroll-card">
            <img src={dest.img} alt={`${dest.name}, ${dest.state}`} loading="lazy" />
            <div className="scroll-card-info">
              <span className="dest-tag">AUTUMN · {dest.state}</span>
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
  );
};

export default ScrollableDestinationGrid;
