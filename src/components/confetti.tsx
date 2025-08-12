'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const colors = ['#FFC700', '#FF0000', '#00FF00', '#0000FF', '#FF00FF', '#00FFFF'];

interface ConfettiPiece {
  id: number;
  style: React.CSSProperties;
  shape: 'rect' | 'circle';
}

const createConfettiPiece = (id: number): ConfettiPiece => {
  const color = colors[Math.floor(Math.random() * colors.length)];
  const left = Math.random() * 100;
  const animDuration = Math.random() * 3 + 4; // 4 to 7 seconds
  const animDelay = Math.random() * 5;
  const size = Math.random() * 8 + 6;
  
  return {
    id,
    shape: Math.random() > 0.5 ? 'rect' : 'circle',
    style: {
      '--color': color,
      '--x-end': `${Math.random() * 200 - 100}px`,
      '--y-end': `${window.innerHeight + 100}px`,
      '--size': `${size}px`,
      left: `${left}vw`,
      animation: `fall ${animDuration}s ${animDelay}s linear infinite`,
    } as React.CSSProperties,
  };
};

export function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const newPieces = Array.from({ length: 150 }, (_, i) => createConfettiPiece(i));
    setPieces(newPieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <style>
        {`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) rotateZ(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotateZ(720deg);
            opacity: 0;
          }
        }
        `}
      </style>
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className={cn(
            'absolute top-0',
            piece.shape === 'rect' ? 'w-[var(--size)] h-[calc(var(--size)*0.5)]' : 'w-[var(--size)] h-[var(--size)] rounded-full',
            'bg-[var(--color)]'
          )}
          style={piece.style}
        />
      ))}
    </div>
  );
}
