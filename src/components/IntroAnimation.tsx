import React, { useState, useEffect } from 'react';
import { Playfair_Display } from 'next/font/google';

// Load premium fonts
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] });

const IntroAnimation: React.FC = () => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Auto-advance the animation progress
  useEffect(() => {
    // Initial delay before animation starts
    const initialDelay = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimationProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsComplete(true);
            return 100;
          }
          return prev + 0.4; // Reduced from 0.5 to 0.4 for even slower animation
        });
      }, 30); // Update every 30ms for smoother animation

      return () => clearInterval(interval);
    }, 2000); // 2 second delay before animation starts

    return () => clearTimeout(initialDelay);
  }, []);

  // Calculate animation values based on progress
  // Name starts at normal size (1) and stays visible for a moment before animation
  const nameOpacity = animationProgress < 40 ? 1 :
                     animationProgress < 45 ? 1 - (animationProgress - 40) / 5 : 0;

  const nameScale = animationProgress < 20 ? 1 :
                   animationProgress < 40 ? 1 + ((animationProgress - 20) * 0.35) :
                   animationProgress < 45 ? 15 + (animationProgress - 40) * 5 : 40;

  const nameBlur = animationProgress < 35 ? 0 :
                  animationProgress < 45 ? (animationProgress - 35) * 3 : 30;

  // Title (Entrepreneur) appears only after name animation has completely faded out
  // Added a clear 2-second delay between name fade-out and title fade-in
  const titleOpacity = animationProgress < 50 ? 0 : // Wait until name is completely gone (45%)
                      animationProgress < 55 ? (animationProgress - 50) / 5 : // Fade in over 5%
                      animationProgress < 80 ? 1 : // Stay visible
                      animationProgress < 85 ? 1 - (animationProgress - 80) / 5 : 0; // Fade out

  const titleScale = animationProgress < 50 ? 0.8 : // Start slightly smaller
                    animationProgress < 55 ? 1 : // Scale to normal size as it fades in
                    animationProgress < 80 ? 1 + ((animationProgress - 55) * 0.5) : // Grow slowly
                    animationProgress < 85 ? 15 + (animationProgress - 80) * 5 : 40; // Grow rapidly as it fades out

  const titleBlur = animationProgress < 75 ? 0 : // No blur initially
                   animationProgress < 85 ? (animationProgress - 75) * 3 : 30; // Add blur as it fades out

  const overlayOpacity = animationProgress < 95 ? 0 : // Adjusted from 90 to 95
                        animationProgress < 100 ? (animationProgress - 95) / 5 : 1; // Adjusted from 95 to 100

  const overlayScale = animationProgress < 95 ? 0.001 : // Adjusted from 90 to 95
                      animationProgress < 100 ? 0.001 + (animationProgress - 95) * 10 : 50; // Adjusted from 90 to 95 and increased multiplier

  return (
    <div
      className="h-screen w-full fixed inset-0 bg-white overflow-hidden flex items-center justify-center"
      style={{
        opacity: 1,
        zIndex: 100,
        pointerEvents: isComplete ? 'none' : 'auto'
      }}
    >
      {/* NAME - centered, grows, then fades out */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="absolute text-center"
          style={{
            opacity: nameOpacity,
            filter: `blur(${nameBlur}px)`,
            transform: `scale(${nameScale})`,
            transformOrigin: 'center center',
            position: 'absolute',
            width: 'max-content',
          }}
        >
          <h1 className={`${playfair.className} text-7xl font-semibold text-black uppercase tracking-wider text-center whitespace-nowrap`}>
            Chirantan Bhardwaj
          </h1>
        </div>
      </div>

      {/* TITLE - centered, appears after name starts to fade */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="absolute text-center"
          style={{
            opacity: titleOpacity,
            filter: `blur(${titleBlur}px)`,
            transform: `scale(${titleScale})`,
            transformOrigin: 'center center',
            position: 'absolute',
            width: 'max-content',
            zIndex: 20,
          }}
        >
          <h2 className={`${playfair.className} text-6xl font-medium text-black uppercase tracking-wider text-center whitespace-nowrap`}>
            Entrepreneur
          </h2>
        </div>
      </div>

      {/* FINAL OVERLAY - emerges from center and expands to fill screen */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="absolute bg-white rounded-full z-30"
          style={{
            opacity: overlayOpacity,
            transform: `scale(${overlayScale})`,
            width: '100px',
            height: '100px',
            transformOrigin: 'center center',
            position: 'absolute',
          }}
        />
      </div>
    </div>
  );
};

export default IntroAnimation;
