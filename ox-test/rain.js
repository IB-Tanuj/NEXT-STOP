(() => {
  "use strict";

  const canvas = document.getElementById("rainCanvas");
  const toggleBtn = document.getElementById("rainSoundToggle");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MUTED_KEY = "nextstop-rain-muted";
  const AUDIO_FILES = [
    "dragon-studio-gentle-rain-07-437321.mp3",
    "rain.mp3",
    "rain.ogg",
    "assets/rain.mp3"
  ];
  const LOOP_SECONDS = 40;
  const FILE_LEVEL = 0.35;
  const SYNTH_LEVEL = 0.14;
  const FADE_MS = 1200;

  /* ---------- rain canvas ---------- */

  const ctx = canvas.getContext("2d");
  const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
  const DROP_COUNT = 170;
  let vw = 0;
  let vh = 0;
  const drops = [];

  function resize() {
    vw = window.innerWidth;
    vh = window.innerHeight;
    canvas.width = Math.round(vw * DPR);
    canvas.height = Math.round(vh * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    for (let i = 0; i < drops.length; i++) {
      if (drops[i].x > vw) drops[i].x = Math.random() * vw;
      if (drops[i].y > vh) drops[i].y = -drops[i].len;
    }
  }

  function spawnDrop(fromTop) {
    const depth = Math.random();
    return {
      x: Math.random() * vw,
      y: fromTop ? Math.random() * -vh : Math.random() * vh,
      len: 9 + depth * 24,
      spd: 5.5 + depth * 11,
      alpha: 0.08 + depth * 0.28,
      wgt: 0.8 + depth * 1.4
    };
  }

  function step() {
    ctx.clearRect(0, 0, vw, vh);
    ctx.lineCap = "round";
    for (let i = 0; i < drops.length; i++) {
      const d = drops[i];
      ctx.beginPath();
      ctx.lineWidth = d.wgt;
      ctx.strokeStyle = "rgba(188, 232, 224, " + d.alpha + ")";
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - d.len * 0.06, d.y + d.len);
      ctx.stroke();

      d.y += d.spd;
      if (d.y - d.len > vh) drops[i] = spawnDrop(true);
    }
    requestAnimationFrame(step);
  }

  function startRain() {
    resize();
    for (let i = 0; i < DROP_COUNT; i++) drops.push(spawnDrop(false));
    requestAnimationFrame(step);
  }

  window.addEventListener("resize", resize);

  /* ---------- rain audio ---------- */

  let audioCtx = null;
  let master = null;
  let synthNodes = null;
  let started = false;
  let muted = false;
  try { muted = localStorage.getItem(MUTED_KEY) === "1"; } catch (_) {}

  const audioSupported = !!(window.AudioContext || window.webkitAudioContext);

  let fileEl = null;
  let loopStart = 0;
  let loopEnd = 0;
  let fileFadeId = null;
  let loopWatchId = null;
  let pauseTimer = null;

  function ensureCtx() {
    if (audioCtx) return audioCtx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
    master = audioCtx.createGain();
    master.gain.value = 0;
    master.connect(audioCtx.destination);
    return audioCtx;
  }

  function fadeTo(target) {
    if (!master) return;
    const t = audioCtx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setTargetAtTime(target, t, 0.7);
  }

  function stopSynth() {
    if (!synthNodes) return;
    try { synthNodes.noise.stop(); } catch (_) {}
    try { synthNodes.swell.stop(); } catch (_) {}
    synthNodes = null;
  }

  function stopSynthSmooth() {
    if (!synthNodes) return;
    fadeTo(0);
    const nodes = synthNodes;
    synthNodes = null;
    setTimeout(() => {
      try { nodes.noise.stop(); } catch (_) {}
      try { nodes.swell.stop(); } catch (_) {}
    }, 500);
  }

  function fadeFileVolume(target) {
    if (!fileEl) return;
    if (fileFadeId) cancelAnimationFrame(fileFadeId);
    const from = fileEl.volume;
    const t0 = performance.now();
    const tickFn = (now) => {
      if (!fileEl) return;
      const t = Math.min(1, (now - t0) / FADE_MS);
      const ease = t * (2 - t);
      fileEl.volume = Math.min(1, Math.max(0, from + (target - from) * ease));
      fileFadeId = t < 1 ? requestAnimationFrame(tickFn) : null;
    };
    fileFadeId = requestAnimationFrame(tickFn);
  }

  function startFile() {
    if (!fileEl) return;
    if (loopEnd && (fileEl.currentTime < loopStart || fileEl.currentTime >= loopEnd - 0.05)) {
      fileEl.currentTime = loopStart;
    }
    fileEl.volume = 0;
    fileEl.play().catch(() => {});
    if (!muted) fadeFileVolume(FILE_LEVEL);
  }

  function muteFile() {
    fadeFileVolume(0);
    clearTimeout(pauseTimer);
    pauseTimer = setTimeout(() => {
      if (muted && fileEl && !fileEl.paused) fileEl.pause();
    }, FADE_MS + 200);
  }

  function unmuteFile() {
    if (!fileEl) return;
    clearTimeout(pauseTimer);
    if (loopEnd && fileEl.currentTime >= loopEnd - 0.05) fileEl.currentTime = loopStart;
    if (fileEl.paused) fileEl.play().catch(() => {});
    fadeFileVolume(FILE_LEVEL);
  }

  function startAudio() {
    if (started) {
      if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
      return;
    }
    started = true;
    if (fileEl) {
      startFile();
    } else {
      if (!ensureCtx()) return;
      buildSynth();
      if (!muted) fadeTo(SYNTH_LEVEL);
    }
  }

  function buildSynth() {
    if (synthNodes || !ensureCtx()) return;
    const ac = audioCtx;
    const buf = ac.createBuffer(1, ac.sampleRate * 4, ac.sampleRate);
    const data = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < data.length; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + w * 0.099046;
      b1 = 0.963 * b1 + w * 0.2965164;
      b2 = 0.57 * b2 + w * 1.0526913;
      data[i] = (b0 + b1 + b2 + w * 0.1848) * 0.22;
    }
    const noise = ac.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const hp = ac.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 400;
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 5200;
    const swell = ac.createOscillator();
    swell.frequency.value = 0.11;
    const swellAmt = ac.createGain();
    swellAmt.gain.value = 1100;
    swell.connect(swellAmt);
    swellAmt.connect(lp.frequency);
    const out = ac.createGain();
    out.gain.value = 1;
    noise.connect(hp);
    hp.connect(lp);
    lp.connect(out);
    out.connect(master);
    noise.start();
    swell.start();
    synthNodes = { noise, swell, out };
  }

  function syncToggle() {
    toggleBtn.textContent = muted ? "\u{1F507}" : "\u{1F50A}";
    toggleBtn.classList.toggle("is-muted", muted);
    toggleBtn.setAttribute("aria-pressed", String(muted));
    toggleBtn.setAttribute("aria-label", muted ? "Unmute rain sound" : "Mute rain sound");
    toggleBtn.title = muted ? "Turn rain sound on" : "Turn rain sound off";
  }

  toggleBtn.addEventListener("click", () => {
    muted = !muted;
    try { localStorage.setItem(MUTED_KEY, muted ? "1" : "0"); } catch (_) {}
    syncToggle();
    if (muted) {
      if (fileEl) muteFile();
      else fadeTo(0);
    } else {
      startAudio();
      if (fileEl) unmuteFile();
      else fadeTo(SYNTH_LEVEL);
    }
  });

  function startLoopWatch() {
    if (loopWatchId == null) loopWatchId = requestAnimationFrame(loopWatchTick);
  }

  function loopWatchTick() {
    if (!fileEl || fileEl.paused) {
      loopWatchId = null;
      return;
    }
    if (loopEnd && fileEl.currentTime >= loopEnd - 0.15) {
      fileEl.currentTime = loopStart;
    }
    loopWatchId = requestAnimationFrame(loopWatchTick);
  }

  function stopLoopWatch() {
    if (loopWatchId != null) {
      cancelAnimationFrame(loopWatchId);
      loopWatchId = null;
    }
  }

  (function probeFiles(i) {
    if (i >= AUDIO_FILES.length || !audioSupported) return;
    const el = new Audio();
    el.preload = "auto";
    el.loop = false;
    el.src = AUDIO_FILES[i];

    el.addEventListener("loadedmetadata", () => {
      if (fileEl) return;
      fileEl = el;
      const d = el.duration;
      if (isFinite(d) && d) {
        loopEnd = d;
        loopStart = Math.max(0, d - LOOP_SECONDS);
        if (!started) el.currentTime = loopStart;
      }
    }, { once: true });

    el.addEventListener("loadeddata", () => {
      if (fileEl !== el || !started) return;
      if (muted) {
        stopSynthSmooth();
        return;
      }
      el.volume = 0;
      if (loopEnd) el.currentTime = loopStart;
      el.play().catch(() => {});
      fadeFileVolume(FILE_LEVEL);
      stopSynthSmooth();
    }, { once: true });

    el.addEventListener("play", startLoopWatch);
    el.addEventListener("pause", stopLoopWatch);
    el.addEventListener("timeupdate", () => {
      if (loopEnd && el.currentTime >= loopEnd - 0.05) el.currentTime = loopStart;
    });
    el.addEventListener("ended", () => {
      if (!loopEnd) return;
      el.currentTime = loopStart;
      el.play().catch(() => {});
    });
    el.addEventListener("error", () => probeFiles(i + 1), { once: true });
    el.load();
  })(0);

  const GESTURES = ["pointerdown", "keydown", "touchstart"];
  function onFirstGesture() {
    GESTURES.forEach((g) => window.removeEventListener(g, onFirstGesture));
    if (!muted) startAudio();
  }
  GESTURES.forEach((g) => window.addEventListener(g, onFirstGesture, { passive: true }));

  /* ---------- init ---------- */

  if (reduceMotion) {
    canvas.hidden = true;
  } else {
    startRain();
  }

  if (!audioSupported) {
    toggleBtn.hidden = true;
  } else {
    syncToggle();
  }
})();
