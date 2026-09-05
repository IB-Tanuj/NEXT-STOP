import React from 'react';
import './Dashboard.css';

const LiquidCityAnimation = ({ percentage, city }) => {
    // Determine color based on completion
    let liquidColor = '#3498db'; // default blue
    if (percentage >= 100) liquidColor = '#2ecc71'; // green for complete
    else if (percentage >= 50) liquidColor = '#f39c12'; // orange for halfway

    return (
        <div className="liquid-city-container">
            <div className="city-title">{city}</div>
            <div className="percentage-display">{percentage}%</div>
            
            <div className="animation-wrapper">
                {/* SVG Skyline Mask */}
                <svg className="city-mask" viewBox="0 0 1000 400" preserveAspectRatio="none">
                    <defs>
                        <clipPath id="city-clip">
                            <path d="M0,400 L0,250 L50,250 L50,150 L100,150 L100,200 L150,200 L150,50 L200,50 L200,180 L250,180 L250,120 L300,120 L300,150 L350,150 L350,20 L400,20 L400,100 L450,100 L450,80 L500,80 L500,180 L550,180 L550,60 L600,60 L600,220 L650,220 L650,130 L700,130 L700,170 L750,170 L750,90 L800,90 L800,240 L850,240 L850,160 L900,160 L900,200 L950,200 L950,280 L1000,280 L1000,400 Z" />
                        </clipPath>
                    </defs>
                    <rect width="1000" height="400" fill="#e0e0e0" clipPath="url(#city-clip)" />
                </svg>

                {/* Liquid Fill Element */}
                <div 
                    className="liquid-fill"
                    style={{ 
                        height: `${percentage}%`,
                        backgroundColor: liquidColor
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
                </div>
            </div>
            
            <p className="animation-caption">
                {percentage === 0 ? "Let's start saving!" :
                 percentage < 50 ? "Building the foundation..." :
                 percentage < 100 ? "More than halfway there!" :
                 "Trip fully funded! Time to pack!"}
            </p>
        </div>
    );
};

export default LiquidCityAnimation;
