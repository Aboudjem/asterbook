'use client';

import { useEffect, useRef } from 'react';

export function AnimatedBackground() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (bgRef.current) {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        bgRef.current.style.setProperty('--mx', `${x}%`);
        bgRef.current.style.setProperty('--my', `${y}%`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={bgRef}
      className="asterbook-animated-bg"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: `
          radial-gradient(1200px 900px at 12% 15%, rgba(34, 211, 238, 0.10), transparent 58%),
          radial-gradient(900px 650px at 82% 24%, rgba(122, 166, 255, 0.12), transparent 60%),
          radial-gradient(900px 700px at 55% 88%, rgba(245, 158, 11, 0.08), transparent 60%),
          linear-gradient(180deg, #070A14, #0B1020)
        `,
        // CSS custom properties for mouse tracking
        ['--mx' as string]: '50%',
        ['--my' as string]: '30%',
      }}
    >
      {/* Starfield Layer - Using inline styles for the pseudo-element effect */}
      <div
        className="absolute"
        style={{
          inset: '-20px',
          backgroundImage: `
            radial-gradient(rgba(255,255,255,0.70) 1px, transparent 1px),
            radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px),
            radial-gradient(rgba(255,255,255,0.22) 1px, transparent 1px)
          `,
          backgroundSize: '140px 140px, 92px 92px, 56px 56px',
          backgroundPosition: '0 0, 18px 32px, 44px 12px',
          opacity: 0.07,
          transform: 'translate3d(0,0,0)',
          animation: 'abStars 10s ease-in-out infinite',
          maskImage: 'radial-gradient(circle at 50% 35%, rgba(0,0,0,1), transparent 62%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 35%, rgba(0,0,0,1), transparent 62%)',
        }}
      />

      {/* Nebula Layer */}
      <div
        className="absolute"
        style={{
          inset: '-30%',
          background: `
            radial-gradient(900px 520px at var(--mx, 50%) var(--my, 30%), rgba(122, 166, 255, 0.20), transparent 62%),
            radial-gradient(900px 600px at 18% 80%, rgba(34, 211, 238, 0.16), transparent 62%),
            radial-gradient(900px 700px at 86% 42%, rgba(245, 158, 11, 0.12), transparent 64%),
            radial-gradient(760px 560px at 62% 8%, rgba(168, 85, 247, 0.12), transparent 62%),
            conic-gradient(from 220deg at 50% 40%, rgba(122, 166, 255, 0.10), rgba(34, 211, 238, 0.07), rgba(245, 158, 11, 0.06), rgba(168, 85, 247, 0.08), rgba(122, 166, 255, 0.10))
          `,
          filter: 'blur(26px) saturate(1.1)',
          opacity: 0.38,
          transform: 'translate3d(0,0,0) rotate(0deg) scale(1.06)',
          transformOrigin: '50% 50%',
          mixBlendMode: 'screen',
          animation: 'abNebula 18s ease-in-out infinite',
        }}
      />

      {/* Keyframes - Injected as a style tag */}
      <style jsx>{`
        @keyframes abStars {
          0% {
            opacity: 0.05;
            transform: translate3d(-6px, 4px, 0);
          }
          45% {
            opacity: 0.11;
            transform: translate3d(8px, -6px, 0);
          }
          100% {
            opacity: 0.06;
            transform: translate3d(-4px, 8px, 0);
          }
        }

        @keyframes abNebula {
          0% {
            opacity: 0.30;
            transform: translate3d(-2%, -1%, 0) rotate(-2deg) scale(1.04);
          }
          50% {
            opacity: 0.42;
            transform: translate3d(2%, 1%, 0) rotate(3deg) scale(1.08);
          }
          100% {
            opacity: 0.34;
            transform: translate3d(-1%, 2%, 0) rotate(6deg) scale(1.06);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .asterbook-animated-bg * {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default AnimatedBackground;
