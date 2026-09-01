const SEASONS = [
  { name: "Shishir", emoji: "☃️", month: 0, day: 15 },
  { name: "Vasant", emoji: "🌸", month: 2, day: 15 },
  { name: "Grishma", emoji: "☀️", month: 4, day: 15 },
  { name: "Varsha", emoji: "🌧️", month: 6, day: 15 },
  { name: "Sharad", emoji: "🍁", month: 8, day: 15 },
  { name: "Hemant", emoji: "❄️", month: 10, day: 15 }
];

function seasonStart(year, s) {
  return new Date(year, s.month, s.day, 0, 0, 0);
}

function getSeasonInfo(now) {
  const year = now.getFullYear();
  const starts = [];
  for (let y = year - 1; y <= year + 1; y++) {
    SEASONS.forEach((s, i) => starts.push({ idx: i, at: seasonStart(y, s), s }));
  }
  starts.sort((a, b) => a.at - b.at);
  let current = null;
  let next = null;
  for (let i = 0; i < starts.length; i++) {
    if (starts[i].at <= now) {
      current = starts[i];
      next = starts[i + 1] || null;
    }
  }
  if (!current) {
    current = starts[0];
    next = starts[1] || null;
  }
  if (!next) {
    next = { ...current, at: new Date(current.at.getFullYear() + 1, current.at.getMonth(), current.at.getDate()) };
  }
  return { current, next };
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function updateTimer() {
  const now = new Date();
  const { current, next } = getSeasonInfo(now);
  const diff = Math.max(0, next.at - now);

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  document.getElementById("tDays").textContent = pad(days);
  document.getElementById("tHours").textContent = pad(hours);
  document.getElementById("tMins").textContent = pad(mins);
  document.getElementById("tSecs").textContent = pad(secs);

  const badge = document.getElementById("seasonBadge");
  badge.textContent = `${current.s.emoji} ${current.s.name}`;
  document.getElementById("seasonLineEmoji").textContent = current.s.emoji;
  document.getElementById("seasonLineName").textContent = current.s.name;
  document.getElementById("nextSeasonName").textContent = `${next.s.name} ${next.s.emoji}`;
}

updateTimer();
setInterval(updateTimer, 1000);

const stage = document.getElementById("carousel");
const ring = document.getElementById("carouselRing");
const cards3d = Array.from(ring.children);
const COUNT = cards3d.length;
const STEP = 360 / COUNT;
const SENSITIVITY = 0.42;
const AUTOSPIN = 0.045;

let rotation = 0;
let velocity = 0;
let radius = 380;
let dragging = false;
let moved = 0;
let lastX = 0;
let lastMoveT = 0;
let snapTarget = null;

function layoutCarousel() {
  const w = stage.clientWidth;
  const cardW = cards3d[0].offsetWidth;
  radius = Math.max(230, Math.min(w * 0.42, cardW * 1.4));
}

function renderCarousel() {
  ring.style.transform = "rotateY(" + rotation.toFixed(3) + "deg)";
  let frontIdx = -1;
  const angles = cards3d.map((card, i) => {
    const ang = (((i * STEP + rotation) % 360) + 360) % 360;
    if (ang < STEP / 2 || ang > 360 - STEP / 2) frontIdx = i;
    return ang;
  });
  cards3d.forEach((card, i) => {
    const ang = angles[i];
    const t = (Math.cos((ang * Math.PI) / 180) + 1) / 2;
    const isFront = i === frontIdx;
    const scale = isFront ? 1.14 : 1;
    card.style.opacity = (0.25 + 0.75 * t).toFixed(3);
    card.style.transform =
      "translate(-50%, -50%) rotateY(" + i * STEP + "deg) translateZ(" +
      radius + "px) scale(" + scale + ")";
    card.classList.toggle("is-front", isFront);
  });
}

function tick(now) {
  updateBg(now);
  if (!dragging) {
    if (snapTarget !== null) {
      const diff = snapTarget - rotation;
      rotation += diff * 0.14;
      if (Math.abs(diff) < 0.05) {
        rotation = snapTarget;
        snapTarget = null;
        velocity = 0;
      }
    } else {
      rotation += velocity + AUTOSPIN;
      velocity *= 0.94;
      if (Math.abs(velocity) < 0.001) velocity = 0;
    }
  }
  renderCarousel();
  requestAnimationFrame(tick);
}

stage.addEventListener("pointerdown", (e) => {
  dragging = true;
  moved = 0;
  lastX = e.clientX;
  lastMoveT = performance.now();
  velocity = 0;
  snapTarget = null;
  stage.classList.add("dragging");
  stage.setPointerCapture(e.pointerId);
});

stage.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  const dx = e.clientX - lastX;
  lastX = e.clientX;
  moved += Math.abs(dx);
  rotation += dx * SENSITIVITY;
  const now = performance.now();
  const dt = Math.max(1, now - lastMoveT);
  velocity = Math.max(-18, Math.min(18, ((dx * SENSITIVITY) / dt) * 16));
  lastMoveT = now;
});

stage.addEventListener("pointerup", (e) => {
  if (!dragging) return;
  dragging = false;
  stage.classList.remove("dragging");
  if (moved < 6) {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const card = el && el.closest(".feature-card");
    if (card) {
      const idx = cards3d.indexOf(card);
      let diff = (((idx * STEP - rotation) % 360) + 360) % 360;
      if (diff > 180) diff -= 360;
      snapTarget = rotation + diff;
    }
  }
});

stage.addEventListener("pointercancel", () => {
  dragging = false;
  stage.classList.remove("dragging");
});

window.addEventListener("resize", () => {
  layoutCarousel();
});

const bgImg = document.getElementById("bgImage");
const INTRO_MS = 1300;
const pageStart = performance.now();
let bgY = 0;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function updateBg(now) {
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const p = Math.min(1, window.scrollY / maxScroll);
  const maxY = Math.max(0, bgImg.offsetHeight - window.innerHeight);
  const targetY = -p * maxY;
  if (reduceMotion) {
    bgY = targetY;
    bgImg.style.transform = "translate3d(0, " + bgY.toFixed(2) + "px, 0)";
    return;
  }
  bgY += (targetY - bgY) * 0.09;
  const t = Math.min(1, (now - pageStart) / INTRO_MS);
  const ease = 1 - Math.pow(1 - t, 3);
  const scale = 1.34 - 0.34 * ease;
  bgImg.style.transform =
    "translate3d(0, " + bgY.toFixed(2) + "px, 0) scale(" + scale.toFixed(4) + ")";
}

layoutCarousel();
requestAnimationFrame(tick);

const revealables = document.querySelectorAll(".section-head, .dest-card, .carousel-hint, .footer");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealables.forEach((el, i) => {
  el.classList.add("reveal");
  el.style.animationDelay = (i % 4) * 90 + "ms";
  observer.observe(el);
});
