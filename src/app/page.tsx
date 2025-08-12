
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ComplimentMachine } from '@/components/compliment-machine';
import { CoffeeShrine } from '@/components/coffee-shrine';
import { StickyNoteIcon } from '@/components/icons/sticky-note-icon';
import { CoffeeMugIcon } from '@/components/icons/coffee-mug-icon';
import { CatIcon } from '@/components/icons/cat-icon';
import { PotatoIcon } from '@/components/icons/potato-icon';
import { PixelIconContainer } from '@/components/pixel-icon-container';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { AnimalParade } from '@/components/animal-parade';
import { TrophyIcon } from '@/components/icons/trophy-icon';
import { cn } from '@/lib/utils';
import { Achievements } from '@/components/achievements';
import { CatCafe } from '@/components/cat-cafe';
import { PotatoDimension } from '@/components/potato-dimension';
import { ControllerIcon } from '@/components/icons/controller-icon';
import { GameHub } from '@/components/game-hub';
import { PokedexIcon } from '@/components/icons/pokedex-icon';
import { Pokedex } from '@/components/pokedex';
import { MemeVault } from '@/components/meme-vault';
import { addEasterEgg, checkAllEasterEggsFound } from '@/lib/easter-eggs';

const backgrounds = [
  'bg-[radial-gradient(hsl(var(--primary)/0.1)_1px,transparent_1px)] [background-size:16px_16px]',
  'bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]',
  'bg-[linear-gradient(90deg,transparent_49%,hsl(var(--primary)/0.1)_50%,hsl(var(--primary)/0.1)_51%,transparent_51%),linear-gradient(0deg,transparent_49%,hsl(var(--primary)/0.1)_50%,hsl(var(--primary)/0.1)_51%,transparent_51%)] [background-size:20px_20px]',
  'bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.1)_1px,transparent_1px)] [background-size:10px_10px]',
];

const KONAMI_CODE = 'chaos';

interface FallingElement {
  id: string;
  ref: React.RefObject<HTMLElement>;
  y: number;
  vy: number; // velocity y
  rotation: number;
  vRotation: number;
  isResting: boolean;
}

export default function Home() {
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [showSelfDestruct, setShowSelfDestruct] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [isEvilCursor, setIsEvilCursor] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [achievements, setAchievements] = useState<string[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const [konamiProgress, setKonamiProgress] = useState('');
  const [showParade, setShowParade] = useState(false);

  // Gravity Easter Egg State
  const [isGravityOn, setIsGravityOn] = useState(false);
  const [arrowUpPresses, setArrowUpPresses] = useState(0);
  const [fallingElements, setFallingElements] = useState<FallingElement[]>([]);
  const animationFrameRef = useRef<number>();
  const headerRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const lastAchievementAnnounced = useRef<string | null>(null);


  const addAchievement = useCallback((achievement: string) => {
    setAchievements(prev => {
        if (prev.includes(achievement)) {
            return prev;
        }
        const newAchievements = [...prev, achievement];
        try {
          localStorage.setItem('achievements', JSON.stringify(newAchievements));
        } catch (error) {
          console.error("Failed to save achievements to localStorage", error);
        }
        return newAchievements;
    });
  }, []);

  // Effect to show toast when a new achievement is added
  useEffect(() => {
    const currentAchievements = achievements || [];
    if (currentAchievements.length > 0) {
      const latestAchievement = currentAchievements[currentAchievements.length - 1];
      // Only show toast if it's a new achievement we haven't just announced
      if (latestAchievement && latestAchievement !== lastAchievementAnnounced.current) {
        toast({
            title: '🏆 Achievement Unlocked!',
            description: latestAchievement,
        });
        lastAchievementAnnounced.current = latestAchievement;
      }
    }
  }, [achievements, toast]);


  const handleEasterEggFound = useCallback((egg: string) => {
    addEasterEgg(egg, () => checkAllEasterEggsFound(addAchievement));
  }, [addAchievement]);


  const handleKeyDown = useCallback((event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'x') {
        if (!showSelfDestruct) {
          setShowSelfDestruct(true);
        }
      }

       // K-Pop Corner Trigger
      if (event.key.toLowerCase() === 'k') {
        router.push('/kpop-corner');
      }

      const newProgress = (konamiProgress + event.key.toLowerCase()).slice(-KONAMI_CODE.length);
      setKonamiProgress(newProgress);
      if (newProgress === KONAMI_CODE) {
        setShowParade(true);
        setTimeout(() => setShowParade(false), 20000); // Parade lasts 20 seconds
      }

      // Gravity Easter Egg
      if (event.key === 'ArrowDown') {
        setIsGravityOn(true);
        setArrowUpPresses(0);
      } else if (event.key === 'ArrowUp') {
        setArrowUpPresses(prev => {
            const newCount = prev + 1;
            if (newCount >= 3) {
                setIsGravityOn(false);
                return 0;
            }
            return newCount;
        });
      } else if (event.key !== 'ArrowDown') {
        setArrowUpPresses(0); // Reset if any other key is pressed
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSelfDestruct, konamiProgress, router]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown]);

  // Gravity Physics Simulation
  useEffect(() => {
    if (isGravityOn) {
      const elementsToFall = [
        { id: 'header', ref: headerRef },
        { id: 'main', ref: mainRef },
        { id: 'footer', ref: footerRef },
      ];

      const initialElements = elementsToFall.map(({ id, ref }) => {
        const el = ref.current;
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        el.style.position = 'absolute';
        el.style.left = `${rect.left}px`;
        el.style.top = `${rect.top}px`;
        el.style.width = `${rect.width}px`;
        
        return {
          id,
          ref,
          y: rect.top,
          vy: 0,
          rotation: 0,
          vRotation: (Math.random() - 0.5) * 4,
          isResting: false,
        };
      }).filter(Boolean) as FallingElement[];

      setFallingElements(initialElements);

      const animate = () => {
        setFallingElements(prevElements => {
          const allResting = prevElements.every(el => el.isResting);
          if (allResting) {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            return prevElements;
          }

          return prevElements.map(el => {
            if (el.isResting || !el.ref.current) return el;

            let { y, vy, rotation, vRotation } = el;
            const floor = window.innerHeight - el.ref.current.offsetHeight;
            
            vy += 0.5; // Gravity
            y += vy;
            rotation += vRotation;
            
            if (y >= floor) {
              y = floor;
              vy *= -0.4; // Bounce with damping
              vRotation *= 0.6;

              // If velocity is very small, consider it resting
              if (Math.abs(vy) < 1 && Math.abs(vRotation) < 0.1) {
                vy = 0;
                vRotation = 0;
                el.isResting = true;
              }
            }

            el.ref.current.style.top = `${y}px`;
            el.ref.current.style.transform = `rotate(${rotation}deg)`;
            
            return { ...el, y, vy, rotation, vRotation };
          });
        });
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animationFrameRef.current = requestAnimationFrame(animate);

    } else {
        // Reset styles when gravity is off
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        [headerRef, mainRef, footerRef].forEach(ref => {
            if (ref.current) {
                ref.current.style.position = '';
                ref.current.style.left = '';
                ref.current.style.top = '';
                ref.current.style.width = '';
                ref.current.style.transform = '';
            }
        });
        setFallingElements([]);
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isGravityOn]);


  useEffect(() => {
    if (showSelfDestruct) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
            setShowSelfDestruct(false);
            setCountdown(10);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [showSelfDestruct, countdown]);

  useEffect(() => {
    if (isEvilCursor) {
        const handleMouseMove = (e: MouseEvent) => {
            setCursorPos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isEvilCursor]);

  useEffect(() => {
    try {
      const storedAchievements = localStorage.getItem('achievements');
      if (storedAchievements) {
        setAchievements(JSON.parse(storedAchievements));
      }
    } catch (error) {
      console.error("Error accessing localStorage on mount:", error);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent | Event) => {
        // This handles both direct storage events and our custom dispatched events
        if ('key' in event && event.key !== 'achievements') return;
        try {
            const storedValue = localStorage.getItem('achievements');
            if (storedValue) {
                setAchievements(JSON.parse(storedValue));
            }
        } catch (e) {
             console.error("Failed to update achievements from storage", e);
        }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleIconClick = (dialogName: string, isImplemented: boolean) => {
    const storedAchievements = localStorage.getItem('achievements');
      if (storedAchievements) {
        setAchievements(JSON.parse(storedAchievements));
      }

    if (isImplemented) {
      setOpenDialog(dialogName);
    } else {
      toast({
        title: 'Under Construction!',
        description: `The ${dialogName} feature is still brewing in the chaos labs.`,
      });
    }
  };
  
  const handleProductivityClick = () => {
    setBackgroundIndex((prev) => (prev + 1) % backgrounds.length);
    if (Math.random() < 0.25) {
        setIsEvilCursor(true);
        toast({
            title: '😈 Evil Cursor Mode Activated!',
            description: 'Good luck clicking anything now.',
        });
        setTimeout(() => {
            setIsEvilCursor(false);
            toast({
                title: 'Evil cursor went for a coffee break.',
                description: 'Your mouse control has been restored... for now.',
            });
        }, 15000);
    }
  };

  const renderDialogContent = () => {
    switch (openDialog) {
      case 'Compliments':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl text-primary">Infinite Compliment Machine</DialogTitle>
              <DialogDescription>A marvel of modern engineering, designed to shower you with praise.</DialogDescription>
            </DialogHeader>
            <ComplimentMachine />
          </>
        );
      case 'Coffee Shrine':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl text-primary">The Sacred Coffee Shrine</DialogTitle>
              <DialogDescription>A downpour of digital caffeine. Click the cups! Find the chosen one!</DialogDescription>
            </DialogHeader>
            <CoffeeShrine onAchievement={addAchievement} onEasterEggFound={handleEasterEggFound} />
          </>
        );
      case 'Cat Café':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl text-primary">Pixel Cat Café</DialogTitle>
            </DialogHeader>
            <CatCafe />
          </>
        );
      case 'Achievements':
        return (
           <>
            <DialogHeader className="text-center p-4 border-b border-border/50">
              <DialogTitle className="text-4xl font-bold font-headline text-primary">Hall of Fame</DialogTitle>
              <DialogDescription className="text-lg text-muted-foreground mt-1">Where legends of procrastination are forged.</DialogDescription>
            </DialogHeader>
            <Achievements unlockedAchievements={achievements} />
          </>
        );
      case 'Potato Dimension':
         return (
          <>
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl text-primary">The Potato Dimension</DialogTitle>
              <DialogDescription>Gaze into the starchy abyss. The potato sees all. The potato knows all.</DialogDescription>
            </DialogHeader>
            <PotatoDimension onEasterEggFound={handleEasterEggFound} />
          </>
        );
      case 'Game Hub':
        return (
          <>
            <DialogHeader className="text-center p-4 border-b border-border/50">
              <DialogTitle className="text-4xl font-bold font-headline text-primary">Game Hub</DialogTitle>
              <DialogDescription className="text-lg text-muted-foreground mt-1">Your one-stop-shop for procrastination.</DialogDescription>
            </DialogHeader>
            <GameHub />
          </>
        );
      case 'Pokedex':
        return (
           <>
            <DialogHeader className="text-center p-4 border-b border-border/50">
              <DialogTitle className="text-4xl font-bold font-headline text-primary">Pokédex</DialogTitle>
              <DialogDescription className="text-lg text-muted-foreground mt-1">Your Pokémon collection. Gotta catch 'em all!</DialogDescription>
            </DialogHeader>
            <Pokedex />
          </>
        );
      default:
        return null;
    }
  };

  const handleSecretRoomClick = () => {
    handleEasterEggFound('secret_room');
    router.push('/secret-room');
  }

  const handleSoundboardClick = () => {
    handleEasterEggFound('soundboard');
    router.push('/soundboard');
  }

  const handleRightSideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isGravityOn) return;
    if (e.clientX > window.innerWidth * 0.9) {
      const target = e.target as HTMLElement;
      if (!target.closest('button, a, [role="dialog"]')) {
        handleEasterEggFound('right_side');
        router.push('/this-page-is-a-lie');
      }
    }
  };

  return (
    <div 
      className={cn(
        "flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground relative overflow-hidden",
        isEvilCursor ? "cursor-none" : "",
        isGravityOn ? "h-screen" : ""
        )}
      onClick={handleRightSideClick}>
       
       <MemeVault />
       {showParade && <AnimalParade />}
       <button className="absolute top-0 left-0 w-2 h-2 z-50" onClick={handleSecretRoomClick} aria-label="Secret Room Trigger" />
       
       {isEvilCursor && (
        <>
            <div className="fixed inset-0 z-[59] cursor-none pointer-events-auto"></div>
            <div className="pointer-events-none absolute z-[60] text-2xl" style={{ top: `${cursorPos.y}px`, left: `${cursorPos.x - 30}px`, transform: `rotate(${Math.random() * 360}deg)` }}>
                😈
            </div>
        </>
       )}
       <div className={`absolute inset-0 pointer-events-none ${backgrounds[backgroundIndex]}`}></div>

       <div className={cn("relative z-10 w-full h-full flex flex-col items-center justify-center", !isGravityOn && "transition-all duration-1000 ease-in")}>
            <header ref={headerRef} className="text-center my-16">
                <h1 className="text-5xl md:text-7xl font-bold font-headline text-primary tracking-widest animate-pulse">Pixel Pandemonium</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Your Portal to <button onClick={handleProductivityClick} className="font-normal p-0 h-auto bg-transparent hover:underline focus:outline-none text-lg text-muted-foreground inline">Productive</button> Procrastination
                </p>
            </header>

            <main ref={mainRef} className="flex-grow flex items-center justify-center">
                <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                    <PixelIconContainer label="Compliments" onClick={() => handleIconClick('Compliments', true)}>
                        <StickyNoteIcon />
                    </PixelIconContainer>
                    <PixelIconContainer label="Coffee Shrine" onClick={() => handleIconClick('Coffee Shrine', true)}>
                        <CoffeeMugIcon />
                    </PixelIconContainer>
                    <PixelIconContainer label="Cat Café" onClick={() => handleIconClick('Cat Café', true)}>
                        <CatIcon />
                    </PixelIconContainer>
                    <PixelIconContainer label="Game Hub" onClick={() => handleIconClick('Game Hub', true)}>
                        <ControllerIcon />
                    </PixelIconContainer>
                    <PixelIconContainer label="Achievements" onClick={() => handleIconClick('Achievements', true)}>
                        <TrophyIcon />
                    </PixelIconContainer>
                    <PixelIconContainer label="Potato" onClick={() => handleIconClick('Potato Dimension', true)}>
                        <PotatoIcon />
                    </PixelIconContainer>
                     <PixelIconContainer label="Pokédex" onClick={() => handleIconClick('Pokedex', true)}>
                        <PokedexIcon />
                    </PixelIconContainer>
                </div>
            </main>

            <Dialog open={!!openDialog} onOpenChange={(isOpen) => !isOpen && setOpenDialog(null)}>
                <DialogContent className="bg-secondary border-primary/50 rounded-lg shadow-2xl max-w-4xl h-[80vh] flex flex-col p-0">
                    {renderDialogContent()}
                </DialogContent>
            </Dialog>
            
            <footer ref={footerRef} className="mt-16 text-center text-sm text-muted-foreground">
                <button onClick={handleSoundboardClick} className="inline-flex items-center hover:text-accent focus:outline-none">
                    <span role="img" aria-label="Warning" className="mr-2">⚠️</span> May cause spontaneous laughter and a sudden disregard for spreadsheets.
                </button>
            </footer>
        </div>

        {showSelfDestruct && (
             <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center text-center text-white p-4">
                <h2 className="text-6xl font-bold font-headline text-red-600 animate-pulse">GAME OVER</h2>
                <div className="mt-8 text-2xl font-mono w-full max-w-md">
                    {countdown > 0 ? (
                        <>
                            <p className="mb-4">SELF-DESTRUCT SEQUENCE ACTIVATED</p>
                            <Progress value={(10 - countdown) * 10} className="h-6 [&>div]:bg-red-600 border-2 border-white/50" />
                        </>
                    ) : (
                        <p className="text-3xl animate-pulse">Just kidding! Now get back to procrastinating.</p>
                    )}
                </div>
            </div>
        )}
    </div>
  );
}
