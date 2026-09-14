import React, { useEffect, useRef } from 'react';
import './FallingLeaves.css';

const leafSVG = `
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17,8C15.31,7.27 13,7.5 11.27,9.22C9.5,11 9.5,14 8,16C7.22,17.06 6,18 4,18C5.78,16.22 7.06,14.78 8,14C10,12.5 13,12.5 14.78,10.73C16.5,9 16.73,6.69 16,5C17.69,6.69 17.73,9.72 17,8Z"/>
    </svg>
`;

const colors = ["#f59e0b", "#d97706", "#b45309", "#78350f", "#eab308"];

const FallingLeaves = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const leafContainer = containerRef.current;
        if (!leafContainer) return;

        const leafCount = 25;
        const leaves = [];

        const createLeaf = () => {
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
            leaves.push(leaf);

            // Recycle leaf element once its animation loop completes
            leaf.addEventListener('animationiteration', () => {
                leaf.style.left = `${Math.random() * window.innerWidth}px`;
                leaf.style.animationDuration = `${Math.random() * 5 + 6}s`;
            });
        };

        for (let i = 0; i < leafCount; i++) {
            createLeaf();
        }

        return () => {
            leaves.forEach(leaf => leaf.remove());
        };
    }, []);

    return <div id="leaf-container" ref={containerRef}></div>;
};

export default FallingLeaves;
