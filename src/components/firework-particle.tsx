'use client';

import { useMemo } from "react";

const PARTICLE_COUNT = 50;
const SPREAD = 80; // The radius of the explosion in pixels
const GRAVITY = 0.5;

const colors = ['#FFC700', '#FF0000', '#00FF00', '#0000FF', '#FF00FF', '#00FFFF', '#FFFFFF'];

const FireworkParticle = ({ x, y }: { x: number, y: number }) => {

  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const initialVelocity = Math.random() * 4 + 2; // Random initial speed
      const color = colors[Math.floor(Math.random() * colors.length)];
      const animationDuration = Math.random() * 1 + 0.8; // 0.8s to 1.8s

      return {
        id: i,
        color,
        style: {
            '--angle': angle,
            '--initial-velocity': initialVelocity,
            '--duration': `${animationDuration}s`,
            animationName: `explode-particle-${i}`,
        } as React.CSSProperties,
        animation: `
          @keyframes explode-particle-${i} {
            0% {
              transform: translate(0, 0);
              opacity: 1;
            }
            100% {
              transform: translate(
                ${Math.cos(angle) * SPREAD * (Math.random() + 0.5)}px,
                ${Math.sin(angle) * SPREAD * (Math.random() + 0.5) + SPREAD * GRAVITY}px
              );
              opacity: 0;
            }
          }
        `,
      };
    });
  }, []);

  return (
    <>
        <style>
            {particles.map(p => p.animation).join('\n')}
        </style>
        <div className="absolute pointer-events-none" style={{ top: y, left: x }}>
        {particles.map((p) => {
            return (
            <div
                key={p.id}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                backgroundColor: p.color,
                animation: `${p.style.animationName} ${p.style['--duration']} ease-out forwards`,
                }}
            />
            );
        })}
        </div>
    </>
  );
};

export { FireworkParticle };
