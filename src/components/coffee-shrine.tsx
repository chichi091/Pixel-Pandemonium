
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Cup {
  id: number;
  x: number;
  y: number;
  isGolden: boolean;
  speed: number;
  size: number;
  color?: string;
}

const funnyToasts = [
    { title: 'Caffeine Overload!', description: 'Your dedication is admirable, but maybe take a break?' },
    { title: 'Not That One!', description: 'The golden cup is elusive, isn\'t it?' },
    { title: 'So Close!', description: 'You\'re getting warmer... or maybe it\'s just the coffee.' },
    { title: 'A for Effort!', description: 'Persistence is key. Or is it caffeine?' },
    { title: 'Are you even trying?', description: 'Just kidding, we love your enthusiasm!' }
];

const CupIcon = ({ isGolden, size, color = '#F5F5DC', ...props }: React.SVGProps<SVGSVGElement> & { isGolden: boolean, size: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M5 8H15V19H5V8Z" fill={isGolden ? '#FFD700' : color} />
    <path d="M15 10H18V11H19V15H18V16H15V10Z" fill={isGolden ? '#FFD700' : color} />
    <path d="M5 7H15V8H5V7Z" fill={isGolden ? '#F9A825' : '#D2B48C'} />
    <path d="M6 9H14V10H6V9Z" fill="#654321" fillOpacity="0.5" />
    <path d="M5 8V19H6V20H14V19H15V8H5ZM6 9H14V18H6V9Z" fill="#000" fillOpacity="0.2" />
    <path d="M15 10V16H18V15H19V11H18V10H15ZM16 11H17V15H16V11Z" fill="#000" fillOpacity="0.2" />
  </svg>
);

const randomColor = () => `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;

export function CoffeeShrine({ onAchievement, onEasterEggFound }: { onAchievement: (id: string) => void, onEasterEggFound: (egg: string) => void }) {
  const [cups, setCups] = useState<Cup[]>([]);
  const [isRaining, setIsRaining] = useState(true);
  const [nextGoldenCup, setNextGoldenCup] = useState(() => Math.floor(Math.random() * 20) + 10);
  const [cupCounter, setCupCounter] = useState(0);
  const [wrongClickCount, setWrongClickCount] = useState(0);
  const { toast } = useToast();
  
  const isCoffeeAddict = wrongClickCount >= 10;
  
  useEffect(() => {
    if(isCoffeeAddict) {
      onAchievement('Coffee Addict');
      onEasterEggFound('colored_coffee');
    }
  }, [isCoffeeAddict, onAchievement, onEasterEggFound]);

  const createCup = useCallback(() => {
    const isGolden = cupCounter + 1 === nextGoldenCup;
    const newCup: Cup = {
      id: Date.now() + Math.random(),
      x: Math.random() * 100,
      y: -10,
      isGolden,
      speed: Math.random() * 2 + 1,
      size: Math.random() * 60 + 80, // Random size between 80 and 140
      color: isCoffeeAddict && !isGolden ? randomColor() : undefined,
    };
    setCups((prev) => [...prev, newCup]);
    setCupCounter(prev => prev + 1);
    if(isGolden) {
        setNextGoldenCup(Infinity); // Prevent more golden cups
    }
  }, [cupCounter, nextGoldenCup, isCoffeeAddict]);

  useEffect(() => {
    if (!isRaining) return;

    const cupCreationInterval = setInterval(createCup, 500);
    const cupMoveInterval = setInterval(() => {
      setCups((prev) =>
        prev
          .map((cup) => ({ ...cup, y: cup.y + cup.speed }))
          .filter((cup) => cup.y < 110)
      );
    }, 16);

    return () => {
      clearInterval(cupCreationInterval);
      clearInterval(cupMoveInterval);
    };
  }, [isRaining, createCup]);

  const handleCupClick = (cupId: number) => {
    const clickedCup = cups.find(cup => cup.id === cupId);
    if (!clickedCup) return;

    if (clickedCup.isGolden) {
      setIsRaining(false);
      toast({
          title: 'You found the Golden Cup!',
          description: 'The caffeine gods are pleased.'
      });
    } else {
        const newWrongClickCount = wrongClickCount + 1;
        setWrongClickCount(newWrongClickCount);
        if (newWrongClickCount % 5 === 0 && newWrongClickCount < 10) {
            toast(funnyToasts[Math.floor(Math.random() * funnyToasts.length)]);
        } else {
            toast({
                title: '*Slurp*',
                description: 'You chugged a regular coffee. The caffeine rush is temporary, the quest for gold is eternal.',
            });
        }
    }
     // Remove cup on click
    setCups(prev => prev.filter(c => c.id !== cupId));
  };


  return (
    <div className="flex-grow w-full h-full relative overflow-hidden bg-background/50 rounded-md p-6">
        {cups.map((cup) => (
          <button
            key={cup.id}
            className="absolute"
            style={{ top: `${cup.y}%`, left: `${cup.x}%`, transform: 'translateX(-50%)' }}
            onClick={() => handleCupClick(cup.id)}
            aria-label={cup.isGolden ? 'Golden coffee cup' : 'Coffee cup'}
          >
            <CupIcon isGolden={cup.isGolden} size={cup.size} color={cup.color} className="animate-spin-slow" />
          </button>
        ))}
        {isCoffeeAddict && isRaining && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center p-8 rounded-lg bg-secondary/80 shadow-2xl animate-pulse">
                    <h3 className="text-5xl font-headline text-destructive mb-2">COFFEE ADDICT</h3>
                </div>
            </div>
        )}
        {!isRaining && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="text-center p-8 rounded-lg bg-secondary shadow-2xl">
                    <h3 className="text-3xl font-headline text-primary mb-2">You found it!</h3>
                    <p className="text-muted-foreground">The golden cup has been claimed. The caffeine gods are pleased.</p>
                </div>
            </div>
        )}
    </div>
  );
}
