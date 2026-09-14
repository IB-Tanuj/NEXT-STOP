document.addEventListener("DOMContentLoaded", () => {
    const leafContainer = document.getElementById("leaf-container");
    const audio = document.getElementById("ambient-sound");
    const audioBtn = document.getElementById("audio-toggle");

    // 1. Audio Control Logic (Handles Browser Autoplay Restrictions)
    audioBtn.addEventListener("click", () => {
        if (audio.paused) {
            audio.play().then(() => {
                audioBtn.innerHTML = '<span class="icon">🔊</span> Sound Off';
            }).catch(err => console.log("Audio play blocked: ", err));
        } else {
            audio.pause();
            audioBtn.innerHTML = '<span class="icon">🔈</span> Sound On';
        }
    });

    // 2. Leaf Generation Logic
    const leafCount = 25; // Total leaves on screen at one time

    // Inline SVG path for a generic crisp autumn leaf
    const leafSVG = `
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17,8C15.31,7.27 13,7.5 11.27,9.22C9.5,11 9.5,14 8,16C7.22,17.06 6,18 4,18C5.78,16.22 7.06,14.78 8,14C10,12.5 13,12.5 14.78,10.73C16.5,9 16.73,6.69 16,5C17.69,6.69 17.73,9.72 17,8Z"/>
        </svg>
    `;

    // Autumn-specific warm & crisp color scheme palette
    const colors = ["#f59e0b", "#d97706", "#b45309", "#78350f", "#eab308"];

    function createLeaf() {
        const leaf = document.createElement("div");
        leaf.classList.add("leaf");
        leaf.innerHTML = leafSVG;

        // Randomize leaf characteristics
        const size = Math.random() * 20 + 15; // 15px to 35px
        const startPositionX = Math.random() * window.innerWidth;
        const duration = Math.random() * 5 + 6; // 6s to 11s animation time
        const delay = Math.random() * -10; // Negative delay ensures instant organic scattering on load
        const chosenColor = colors[Math.floor(Math.random() * colors.length)];

        // Apply dynamic styles
        leaf.style.width = `${size}px`;
        leaf.style.height = `${size}px`;
        leaf.style.left = `${startPositionX}px`;
        leaf.style.color = chosenColor;
        leaf.style.animationDuration = `${duration}s`;
        leaf.style.animationDelay = `${delay}s`;

        leafContainer.appendChild(leaf);

        // Recycle leaf element once its animation loop completes
        leaf.addEventListener('animationiteration', () => {
            leaf.style.left = `${Math.random() * window.innerWidth}px`;
            leaf.style.animationDuration = `${Math.random() * 5 + 6}s`;
        });
    }

    // Initialize the leaf pool
    for (let i = 0; i < leafCount; i++) {
        createLeaf();
    }
});
