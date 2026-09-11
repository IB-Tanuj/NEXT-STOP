import React, { useMemo } from 'react';
import './Dashboard.css';

const LiquidCityAnimation = ({ percentage, city }) => {
    // Gradient color based on completion
    let liquidGradient = 'linear-gradient(180deg, #22d3ee, #0891b2)'; // cyan
    let glowColor = 'rgba(6, 182, 212, 0.3)';
    if (percentage >= 100) {
        liquidGradient = 'linear-gradient(180deg, #4ade80, #059669)'; // green
        glowColor = 'rgba(74, 222, 128, 0.4)';
    } else if (percentage >= 50) {
        liquidGradient = 'linear-gradient(180deg, #fbbf24, #d97706)'; // amber
        glowColor = 'rgba(251, 191, 36, 0.3)';
    }

    // Generate random bubbles
    const bubbles = useMemo(() => {
        if (percentage <= 0) return [];
        const count = Math.min(Math.max(Math.floor(percentage / 10), 2), 8);
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            left: 10 + Math.random() * 80,
            size: 4 + Math.random() * 8,
            duration: 2 + Math.random() * 3,
            delay: Math.random() * 2,
        }));
    }, [percentage]);

    // Building windows that light up based on percentage
    const windowPositions = useMemo(() => [
        // Row 1 (tallest buildings)
        { x: 160, y: 30, building: 1 },
        { x: 175, y: 45, building: 1 },
        { x: 160, y: 60, building: 1 },
        // Row 2
        { x: 360, y: 25, building: 2 },
        { x: 375, y: 40, building: 2 },
        { x: 360, y: 55, building: 2 },
        // Row 3
        { x: 560, y: 65, building: 3 },
        { x: 575, y: 80, building: 3 },
        // Row 4
        { x: 760, y: 95, building: 4 },
        { x: 775, y: 110, building: 4 },
        // Row 5
        { x: 260, y: 125, building: 5 },
        { x: 460, y: 105, building: 6 },
        { x: 660, y: 135, building: 7 },
        { x: 860, y: 165, building: 8 },
    ], []);

    const litCount = Math.floor((percentage / 100) * windowPositions.length);

    return (
        <div className="liquid-city-container" style={{ boxShadow: `0 10px 40px rgba(0,0,0,0.3), 0 0 60px ${glowColor}` }}>
            <div className="city-title">{city}</div>
            <div className="percentage-display">{percentage}%</div>
            
            <div className="animation-wrapper">
                {/* SVG Skyline Mask with lit windows */}
                <svg className="city-mask" viewBox="0 0 1000 400" preserveAspectRatio="none">
                    <defs>
                        <clipPath id="city-clip">
                            <path d="M0,400 L0,250 L50,250 L50,150 L100,150 L100,200 L150,200 L150,50 L200,50 L200,180 L250,180 L250,120 L300,120 L300,150 L350,150 L350,20 L400,20 L400,100 L450,100 L450,80 L500,80 L500,180 L550,180 L550,60 L600,60 L600,220 L650,220 L650,130 L700,130 L700,170 L750,170 L750,90 L800,90 L800,240 L850,240 L850,160 L900,160 L900,200 L950,200 L950,280 L1000,280 L1000,400 Z" />
                        </clipPath>
                    </defs>
                    <rect width="1000" height="400" fill="#1e293b" clipPath="url(#city-clip)" />
                    
                    {/* Lit windows */}
                    {windowPositions.map((win, idx) => (
                        <rect
                            key={idx}
                            x={win.x}
                            y={win.y}
                            width="12"
                            height="15"
                            rx="1"
                            fill={idx < litCount ? '#fbbf24' : '#334155'}
                            opacity={idx < litCount ? 0.9 : 0.3}
                            clipPath="url(#city-clip)"
                            style={{
                                transition: 'fill 0.5s ease, opacity 0.5s ease',
                                ...(idx < litCount ? {
                                    filter: 'drop-shadow(0 0 4px rgba(251,191,36,0.6))',
                                    animation: `windowFlicker ${2 + Math.random() * 3}s ease-in-out infinite`,
                                    animationDelay: `${Math.random() * 2}s`,
                                } : {}),
                            }}
                        />
                    ))}
                </svg>

                {/* Liquid Fill Element */}
                <div 
                    className="liquid-fill"
                    style={{ 
                        height: `${percentage}%`,
                        background: liquidGradient,
                        boxShadow: `0 -4px 20px ${glowColor}`,
                    }}
                >
                    <div className="waves">
                        {percentage > 0 && percentage < 100 && (
                            <>
                                <div className="wave wave1"></div>
                                <div className="wave wave2"></div>
                            </>
                        )}
                    </div>

                    {/* Floating Bubbles */}
                    {bubbles.map(bubble => (
                        <span
                            key={bubble.id}
                            className="bubble"
                            style={{
                                left: `${bubble.left}%`,
                                bottom: '10%',
                                width: `${bubble.size}px`,
                                height: `${bubble.size}px`,
                                animationDuration: `${bubble.duration}s`,
                                animationDelay: `${bubble.delay}s`,
                            }}
                        />
                    ))}
                </div>
            </div>
            
            <p className="animation-caption">
                {percentage === 0 ? "Let's start saving!" :
                 percentage < 25 ? "Building the foundation..." :
                 percentage < 50 ? "Making great progress!" :
                 percentage < 75 ? "More than halfway there!" :
                 percentage < 100 ? "Almost ready for takeoff!" :
                 "Trip fully funded! Time to pack!"}
            </p>
        </div>
    );
};

export default LiquidCityAnimation;
