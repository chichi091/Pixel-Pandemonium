
'use client';
import { useMemo } from 'react';

const colors = ['#ff5e57', '#ff9f43', '#feca57', '#48dbfb', '#54a0ff', '#9e57ff', '#ff6b81'];

export function Balloon({ x }: { x: number }) {
  const balloonStyle = useMemo(() => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const duration = Math.random() * 2 + 5; // 5 to 7 seconds
    const delay = Math.random() * 2;
    const sway = (Math.random() - 0.5) * 200; // -100px to 100px
    
    return {
      left: `${x}vw`,
      '--sway-x': `${sway}px`,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
    } as React.CSSProperties;
  }, [x]);

  const balloonColor = useMemo(() => colors[Math.floor(Math.random() * colors.length)], []);

  return (
    <div
      className="absolute bottom-[-100px] w-16 h-20 animate-float-up pointer-events-none"
      style={balloonStyle}
    >
      <svg viewBox="0 0 100 125" className="w-full h-full" fill={balloonColor} >
        <path d="M50 0 C 0 0, 0 75, 50 100 C 100 75, 100 0, 50 0 Z" />
        <path d="M45 100 C 45 105, 55 105, 55 100 L 52 110 L 48 110 Z" />
        <path d="M50 0 C 60 20, 60 40, 50 50" fill="white" opacity="0.3" />
      </svg>
    </div>
  );
}
