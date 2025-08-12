'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Confetti } from '@/components/confetti';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { FireworkParticle } from '@/components/firework-particle';
import { Balloon } from '@/components/balloon';

interface Firework {
  id: number;
  x: number;
  y: number;
}

interface BalloonInfo {
  id: number;
  x: number; // percentage from left
}

export default function SecretRoomPage() {
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const [balloons, setBalloons] = useState<BalloonInfo[]>([]);
  const [numberInput, setNumberInput] = useState('');

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.ctrlKey) {
      const newFirework = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };
      setFireworks(prev => [...prev, newFirework]);

      // Remove the firework after the animation duration
      setTimeout(() => {
        setFireworks(currentFireworks =>
          currentFireworks.filter(f => f.id !== newFirework.id)
        );
      }, 2000);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        return;
      }

      if (!isNaN(parseInt(e.key))) {
        setNumberInput(prev => (prev + e.key).slice(0, 3)); // Limit to 3 digits
      } else if (e.key === 'Enter') {
        const count = parseInt(numberInput, 10);
        if (!isNaN(count) && count > 0) {
          const newBalloons: BalloonInfo[] = Array.from({ length: count }, (_, i) => ({
            id: Date.now() + i,
            x: Math.random() * 95,
          }));
          
          setBalloons(prev => [...prev, ...newBalloons]);

          // Clean up balloons after animation (7s)
          setTimeout(() => {
            setBalloons(current => current.filter(b => !newBalloons.find(nb => nb.id === b.id)));
          }, 7000);
        }
        setNumberInput('');
      } else if (e.key === 'Backspace') {
        setNumberInput(prev => prev.slice(0, -1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [numberInput]);

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 relative overflow-hidden"
      onClick={handlePageClick}
      >
      <Confetti />
       {fireworks.map(firework => (
        <FireworkParticle key={firework.id} x={firework.x} y={firework.y} />
      ))}
      {balloons.map(balloon => (
        <Balloon key={balloon.id} x={balloon.x} />
      ))}
      <div className="text-center z-10 relative">
        <h1 className="text-5xl md:text-7xl font-bold font-headline text-primary mb-4">
          The Secret Room
        </h1>
        <p className="text-xl text-muted-foreground mt-2 mb-2">
          You found it! This is a place of celebration.
        </p>
        <p className="text-lg text-muted-foreground mb-8">
           <span className="font-mono bg-secondary/80 px-2 py-1 rounded-md">{numberInput || '...'}</span>
           <span className="animate-pulse">|</span>
        </p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Pandemonium
          </Link>
        </Button>
      </div>
    </div>
  );
}
