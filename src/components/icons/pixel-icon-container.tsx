import type { ReactNode } from 'react';

export function PixelIconContainer({ children, label, onClick }: { children: ReactNode, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center w-28 h-28 space-y-2 text-center transition-transform duration-200 ease-in-out rounded-lg group text-foreground hover:bg-accent/10 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      aria-label={`Open ${label}`}
    >
      {children}
      <span className="text-sm font-semibold tracking-wider font-headline">{label}</span>
    </button>
  );
}
