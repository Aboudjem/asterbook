'use client';

import { useEffect, useState } from 'react';

interface Star {
  id: number;
  top: string;
  left: string;
  delay: string;
}

export function ShootingStars() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate 5 shooting stars with random positions and staggered delays
    const generatedStars: Star[] = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 40}%`,
      left: `${Math.random() * 100}%`,
      delay: `${i * 800}ms`,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <>
      <style jsx>{`
        .shooting-star {
          position: absolute;
          width: 4px;
          height: 4px;
          background: linear-gradient(135deg, #fff, rgba(122, 166, 255, 0.8));
          border-radius: 50%;
          box-shadow: 0 0 6px 2px rgba(122, 166, 255, 0.6),
                      0 0 12px 4px rgba(34, 211, 238, 0.4);
          animation: shootingStar 4000ms linear infinite;
          opacity: 0;
          pointer-events: none;
        }

        .shooting-star::after {
          content: '';
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          width: 80px;
          height: 2px;
          background: linear-gradient(90deg,
            rgba(122, 166, 255, 0.8),
            rgba(34, 211, 238, 0.4),
            transparent
          );
          border-radius: 100px;
        }

        @keyframes shootingStar {
          0% {
            opacity: 0;
            transform: translate(0, 0) rotate(-45deg);
          }
          5% {
            opacity: 1;
          }
          25% {
            opacity: 1;
            transform: translate(-300px, 300px) rotate(-45deg);
          }
          30%, 100% {
            opacity: 0;
            transform: translate(-350px, 350px) rotate(-45deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .shooting-star {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>
      <div className="shooting-stars-container" style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
      }}>
        {stars.map((star) => (
          <div
            key={star.id}
            className="shooting-star"
            style={{
              top: star.top,
              left: star.left,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>
    </>
  );
}

export default ShootingStars;
