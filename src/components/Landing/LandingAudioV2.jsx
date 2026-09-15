import React, { useEffect, useRef, useState } from 'react';
import './LandingStyles.css'; // Reusing styles

const LandingAudioV2 = () => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // The user wants audio from 3 - 17 seconds
        const startTime = 3;
        const endTime = 17;

        const handleTimeUpdate = () => {
            if (audio.currentTime >= endTime) {
                audio.currentTime = startTime;
            }
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, []);

    const toggleAudio = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.currentTime = 3; // Ensure it starts from 3s when manually played
            audio.play().then(() => {
                setIsPlaying(true);
            }).catch(err => {
                console.log("Audio play blocked: ", err);
            });
        }
    };

    return (
        <>
            <audio ref={audioRef} src="/landing2/purnanand_wasave-autumn-124158.mp3" loop />
            <button 
                id="audio-toggle" 
                className="audio-btn" 
                onClick={toggleAudio}
                style={{
                    position: 'fixed',
                    bottom: 'clamp(16px, 3vw, 28px)',
                    right: 'clamp(16px, 3vw, 28px)',
                    zIndex: 60,
                    padding: '10px 20px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    transition: 'background 0.3s'
                }}
            >
                {isPlaying ? (
                    <><span className="icon">🔊</span> Sound Off</>
                ) : (
                    <><span className="icon">🔈</span> Sound On</>
                )}
            </button>
        </>
    );
};

export default LandingAudioV2;
