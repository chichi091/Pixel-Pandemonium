
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updatePlayerWinCount } from '@/lib/player-achievements';


const GRID_SIZE = 6; // 6x6 grid of dots

type Player = 'Thing 1' | 'Thing 2';

interface GameState {
  horizontal: boolean[][];
  vertical: boolean[][];
  boxes: (Player | null)[][];
  currentPlayer: Player;
  scores: { 'Thing 1': number; 'Thing 2': number };
  gameOver: boolean;
}

const initialState = (): GameState => {
  return {
    horizontal: Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE - 1).fill(false)),
    vertical: Array(GRID_SIZE - 1).fill(null).map(() => Array(GRID_SIZE).fill(false)),
    boxes: Array(GRID_SIZE - 1).fill(null).map(() => Array(GRID_SIZE - 1).fill(null)),
    currentPlayer: 'Thing 1',
    scores: { 'Thing 1': 0, 'Thing 2': 0 },
    gameOver: false,
  };
};

export default function DotsAndBoxesPage() {
  const [gameState, setGameState] = useState<GameState>(initialState());
  const { toast } = useToast();

  const { currentPlayer, scores, gameOver } = gameState;

  const checkForGameAchievement = useCallback(() => {
    try {
        localStorage.setItem('played_dots-and-boxes', 'true');
        const playedTicTacToe = localStorage.getItem('played_tic-tac-toe');
        const playedConnectFour = localStorage.getItem('played_connect-four');

        if (playedTicTacToe && playedConnectFour) {
            const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
            if (!achievements.includes('Boredom Destroyer')) {
                const newAchievements = [...achievements, 'Boredom Destroyer'];
                localStorage.setItem('achievements', JSON.stringify(newAchievements));
                toast({
                    title: '🏆 Achievement Unlocked!',
                    description: 'Boredom Destroyer',
                });
            }
        }
    } catch (error) {
        console.error('Failed to check for achievement', error);
    }
  }, [toast]);


  useEffect(() => {
    checkForGameAchievement();
  }, [checkForGameAchievement]);

  const handleWin = useCallback((winner: Player) => {
    updatePlayerWinCount(winner);
  }, []);

  useEffect(() => {
    const totalBoxes = (GRID_SIZE - 1) * (GRID_SIZE - 1);
    const claimedBoxes = scores['Thing 1'] + scores['Thing 2'];
    if (claimedBoxes === totalBoxes && !gameOver) {
      setGameState(prev => ({ ...prev, gameOver: true }));
      if (scores['Thing 1'] > scores['Thing 2']) {
          handleWin('Thing 1');
      } else if (scores['Thing 2'] > scores['Thing 1']) {
          handleWin('Thing 2');
      }
    }
  }, [scores, gameOver, handleWin]);

  const handleLineClick = (type: 'horizontal' | 'vertical', r: number, c: number) => {
    if (gameOver) return;

    const newGameState = JSON.parse(JSON.stringify(gameState));
    if (type === 'horizontal') {
      if (newGameState.horizontal[r][c]) return;
      newGameState.horizontal[r][c] = true;
    } else {
      if (newGameState.vertical[r][c]) return;
      newGameState.vertical[r][c] = true;
    }

    let boxCompleted = false;

    // Check for completed boxes
    for (let i = 0; i < GRID_SIZE - 1; i++) {
      for (let j = 0; j < GRID_SIZE - 1; j++) {
        if (
          !newGameState.boxes[i][j] &&
          newGameState.horizontal[i][j] &&
          newGameState.horizontal[i+1][j] &&
          newGameState.vertical[i][j] &&
          newGameState.vertical[i][j+1]
        ) {
          newGameState.boxes[i][j] = currentPlayer;
          newGameState.scores[currentPlayer]++;
          boxCompleted = true;
        }
      }
    }
    
    if (!boxCompleted) {
        newGameState.currentPlayer = currentPlayer === 'Thing 1' ? 'Thing 2' : 'Thing 1';
    }
    
    setGameState(newGameState);
  };
  
  const resetGame = () => {
    setGameState(initialState());
  };

  const getStatusMessage = () => {
    if (gameOver) {
        if (scores['Thing 1'] > scores['Thing 2']) return "Thing 1 Wins!";
        if (scores['Thing 2'] > scores['Thing 1']) return "Thing 2 Wins!";
        return "It's a Draw!";
    }
    return `${currentPlayer}'s Turn`;
  };
  
  const getLineOwner = (type: 'horizontal' | 'vertical', r: number, c: number): Player | null => {
      if (type === 'horizontal') {
          const boxAbove = gameState.boxes[r - 1]?.[c];
          const boxBelow = gameState.boxes[r]?.[c];
          if(boxAbove && gameState.horizontal[r][c] && gameState.vertical[r-1][c] && gameState.vertical[r-1][c+1]) return boxAbove;
          if(boxBelow && gameState.horizontal[r][c] && gameState.vertical[r][c] && gameState.vertical[r][c+1]) return boxBelow;
          return null;
      } else { // vertical
          const boxLeft = gameState.boxes[r]?.[c - 1];
          const boxRight = gameState.boxes[r]?.[c];
          if(boxLeft && gameState.vertical[r][c] && gameState.horizontal[r][c-1] && gameState.horizontal[r+1][c-1]) return boxLeft;
          if(boxRight && gameState.vertical[r][c] && gameState.horizontal[r][c] && gameState.horizontal[r+1][c]) return boxRight;
          return null;
      }
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold font-headline text-primary">Dots and Boxes</h1>
        <p className="text-xl text-muted-foreground mt-2">Connect the dots to claim your boxes.</p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="flex justify-between w-full max-w-sm text-xl font-bold">
            <span className={cn('p-2 rounded-md', currentPlayer === 'Thing 1' && !gameOver && 'bg-green-500 text-white')}>
                Thing 1: {scores['Thing 1']}
            </span>
            <span className={cn('p-2 rounded-md', currentPlayer === 'Thing 2' && !gameOver && 'bg-pink-500 text-white')}>
                Thing 2: {scores['Thing 2']}
            </span>
        </div>
        <div className="text-2xl font-bold">{getStatusMessage()}</div>
        
        <div className="bg-secondary/50 p-4 rounded-lg">
            <div className="relative" style={{ width: `${(GRID_SIZE - 1) * 40}px`, height: `${(GRID_SIZE - 1) * 40}px` }}>
            {/* Render Boxes */}
            {gameState.boxes.map((row, r) =>
                row.map((player, c) =>
                player ? (
                    <div
                    key={`box-${r}-${c}`}
                    className={cn(
                        'absolute w-10 h-10 transition-colors flex items-center justify-center font-bold text-2xl text-white',
                        player === 'Thing 1' ? 'bg-green-500/50' : 'bg-pink-500/50'
                    )}
                    style={{ top: `${r * 40}px`, left: `${c * 40}px` }}
                    >
                    {player === 'Thing 1' ? '1' : '2'}
                    </div>
                ) : null
                )
            )}

            {/* Render Horizontal Lines */}
            {gameState.horizontal.map((row, r) =>
                row.map((filled, c) => {
                    const boxAbove = gameState.boxes[r-1]?.[c];
                    const boxBelow = gameState.boxes[r]?.[c];
                    let owner: Player | null = null;
                    if (boxAbove && gameState.horizontal[r][c] && gameState.vertical[r-1][c] && gameState.vertical[r-1][c+1] && gameState.horizontal[r-1][c]) {
                        owner = boxAbove;
                    }
                    if (boxBelow && gameState.horizontal[r][c] && gameState.vertical[r][c] && gameState.vertical[r][c+1] && gameState.horizontal[r+1][c]) {
                        owner = boxBelow;
                    }

                    return (
                        <button
                            key={`h-${r}-${c}`}
                            className={cn(
                                'absolute w-10 h-1.5 bg-muted hover:bg-muted-foreground/50 transition-colors',
                                filled && 'bg-foreground',
                                owner === 'Thing 1' && 'bg-green-500',
                                owner === 'Thing 2' && 'bg-pink-500'
                            )}
                            style={{ top: `${r * 40 - 3}px`, left: `${c * 40}px` }}
                            onClick={() => handleLineClick('horizontal', r, c)}
                            disabled={filled}
                        />
                    );
                })
            )}

            {/* Render Vertical Lines */}
            {gameState.vertical.map((row, r) =>
                row.map((filled, c) => {
                     const boxLeft = gameState.boxes[r]?.[c-1];
                     const boxRight = gameState.boxes[r]?.[c];
                     let owner: Player | null = null;
                     if(boxLeft && gameState.vertical[r][c] && gameState.horizontal[r][c-1] && gameState.horizontal[r+1][c-1] && gameState.vertical[r][c-1]) {
                        owner = boxLeft;
                     }
                     if(boxRight && gameState.vertical[r][c] && gameState.horizontal[r][c] && gameState.horizontal[r+1][c] && gameState.vertical[r][c+1]) {
                        owner = boxRight;
                     }

                     return (
                        <button
                            key={`v-${r}-${c}`}
                            className={cn(
                                'absolute w-1.5 h-10 bg-muted hover:bg-muted-foreground/50 transition-colors',
                                filled && 'bg-foreground',
                                owner === 'Thing 1' && 'bg-green-500',
                                owner === 'Thing 2' && 'bg-pink-500'
                            )}
                            style={{ top: `${r * 40}px`, left: `${c * 40 - 3}px` }}
                            onClick={() => handleLineClick('vertical', r, c)}
                            disabled={filled}
                        />
                     )
                })
            )}

            {/* Render Dots */}
            {Array.from({ length: GRID_SIZE }).map((_, r) =>
                Array.from({ length: GRID_SIZE }).map((_, c) => (
                <div
                    key={`dot-${r}-${c}`}
                    className="absolute w-3 h-3 bg-primary rounded-full z-10"
                    style={{ top: `${r * 40 - 6}px`, left: `${c * 40 - 6}px` }}
                />
                ))
            )}
            </div>
        </div>

        {(gameOver) && (
          <Button onClick={resetGame} variant="default" size="lg" className="mt-4">
            <RefreshCw className="mr-2 h-5 w-5" /> Play Again
          </Button>
        )}

      </div>

      <div className="flex gap-4 mt-8">
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hub
          </Link>
        </Button>
      </div>
    </div>
  );
}
