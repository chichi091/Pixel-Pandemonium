
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const GRID_SIZE = 4;

const toggleTile = (index: number, currentGrid: boolean[]) => {
  const newGrid = [...currentGrid];
  const row = Math.floor(index / GRID_SIZE);
  const col = index % GRID_SIZE;

  const toggle = (r: number, c: number) => {
    if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
      const i = r * GRID_SIZE + c;
      newGrid[i] = !newGrid[i];
    }
  };
  
  toggle(row, col);
  toggle(row - 1, col); // up
  toggle(row + 1, col); // down
  toggle(row, col - 1); // left
  toggle(row, col + 1); // right

  return newGrid;
};

const generateSolvableGrid = () => {
  let grid = Array.from({ length: GRID_SIZE * GRID_SIZE }, () => true); // Start solved
  const scrambleMoves = Math.floor(Math.random() * 76) + 75; // 75-150 moves

  for (let i = 0; i < scrambleMoves; i++) {
    const randomIndex = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
    grid = toggleTile(randomIndex, grid);
  }

  // If it's already solved (very unlikely), scramble it again
  if (grid.every(cell => cell)) {
    return generateSolvableGrid();
  }

  return grid;
};


export default function NotFound() {
  const [grid, setGrid] = useState<boolean[]>([]);
  const [moves, setMoves] = useState(0);
  const [titleClicks, setTitleClicks] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    setGrid(generateSolvableGrid());
  }, []);

  const isSolved = useMemo(() => grid.length > 0 && grid.every(cell => cell), [grid]);
  const cheatActivated = titleClicks >= 4;

  useEffect(() => {
    if (isSolved) {
      try {
        const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
        if (!achievements.includes('Dimensional Drifter')) {
          const newAchievements = [...achievements, 'Dimensional Drifter'];
          localStorage.setItem('achievements', JSON.stringify(newAchievements));
          toast({
              title: '🏆 Achievement Unlocked!',
              description: 'Dimensional Drifter',
          });
        }
      } catch (error) {
        console.error("Failed to save achievement to localStorage", error);
      }
    }
  }, [isSolved, toast]);

  const handleTileClick = (index: number) => {
    if (isSolved || grid.length === 0 || cheatActivated) return;
    setGrid(currentGrid => toggleTile(index, currentGrid));
    setMoves(m => m + 1);
  };
  
  const resetGame = () => {
    setGrid(generateSolvableGrid());
    setMoves(0);
    setTitleClicks(0);
  }

  const handleTitleClick = () => {
    setTitleClicks(c => c + 1);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="text-center mb-8">
        <h1 onClick={handleTitleClick} className="text-6xl font-bold font-headline text-primary select-none cursor-pointer">404</h1>
        <p className="text-xl text-muted-foreground mt-2">You've stumbled into a dimensional rift.</p>
        <p className="text-lg text-muted-foreground">The only way out is to solve the puzzle.</p>
      </div>

      <div className="relative p-2 bg-secondary rounded-lg shadow-2xl">
        <div className="grid gap-1" style={{gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`}}>
            {grid.length > 0 ? grid.map((isOn, index) => (
            <button
                key={index}
                onClick={() => handleTileClick(index)}
                className={cn(
                'w-16 h-16 md:w-20 md:h-20 rounded-md transition-all duration-300 ease-in-out',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary focus:ring-primary',
                isOn ? 'bg-primary shadow-inner' : 'bg-background/50',
                isSolved && '!bg-green-500 animate-pulse'
                )}
                aria-label={`Tile ${index + 1}`}
            />
            )) : Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => (
              <div key={index} className="w-16 h-16 md:w-20 md:h-20 rounded-md bg-background/20 animate-pulse" />
            ))}
        </div>
        {isSolved && (
            <div className="absolute inset-0 bg-secondary/80 flex flex-col items-center justify-center text-center">
                <h2 className="text-4xl font-bold font-headline text-primary mb-2">You did it!</h2>
                <p className="text-muted-foreground mb-4">You've closed the rift.</p>
            </div>
        )}
         {cheatActivated && !isSolved && (
            <div className="absolute inset-0 bg-secondary/80 flex flex-col items-center justify-center text-center">
                <h2 className="text-4xl font-bold font-headline text-primary mb-2">A Shortcut!</h2>
                <p className="text-muted-foreground mb-4">You found a less puzzling way out.</p>
            </div>
        )}
      </div>

      <div className="text-center mt-8 space-y-4">
        <p className="text-lg">Moves: <span className="font-bold text-primary">{moves}</span></p>
        <div className="flex gap-4">
            {(isSolved || cheatActivated) && (
                <Button asChild>
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                    </Link>
                </Button>
            )}
            <Button onClick={resetGame}>
                Reset Puzzle
            </Button>
        </div>
      </div>
    </div>
  );
}
