
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, RefreshCw, X, Circle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updatePlayerWinCount } from '@/lib/player-achievements';

type Player = 'X' | 'O';
type SquareValue = Player | null;

const calculateWinner = (squares: SquareValue[]): Player | null => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const Square = ({ value, onClick }: { value: SquareValue; onClick: () => void }) => (
  <button
    className="w-full h-full flex items-center justify-center rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
    onClick={onClick}
    disabled={!!value}
    aria-label={`Square with value ${value || 'empty'}`}
  >
    {value === 'X' && <X className="w-12 h-12 md:w-16 md:h-16 text-pink-500" />}
    {value === 'O' && <Circle className="w-12 h-12 md:w-16 md:h-16 text-green-500" />}
  </button>
);


export default function TicTacToePage() {
  const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('O'); // Player 1 is now O
  const [winner, setWinner] = useState<Player | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const { toast } = useToast();

   const checkForGameAchievement = useCallback(() => {
    try {
        localStorage.setItem('played_tic-tac-toe', 'true');
        const playedDotsAndBoxes = localStorage.getItem('played_dots-and-boxes');
        const playedConnectFour = localStorage.getItem('played_connect-four');

        if (playedDotsAndBoxes && playedConnectFour) {
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

  const handleSquareClick = (index: number) => {
    if (winner || board[index]) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const newWinner = calculateWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      updatePlayerWinCount(newWinner === 'O' ? 'Thing 1' : 'Thing 2');
    } else if (newBoard.every(square => square !== null)) {
      setIsDraw(true);
    } else {
      setCurrentPlayer(currentPlayer === 'O' ? 'X' : 'O');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('O'); // Player 1 starts
    setWinner(null);
    setIsDraw(false);
  };
  
  const getStatusMessage = () => {
    if (winner) {
      return `Thing ${winner === 'O' ? '1 (O)' : '2 (X)'} Wins!`;
    }
    if (isDraw) {
      return "It's a Draw!";
    }
    return `Next: Thing ${currentPlayer === 'O' ? '1 (O)' : '2 (X)'}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold font-headline text-primary">
          Tic-Tac-Toe
        </h1>
        <p className="text-xl text-muted-foreground mt-2">
          Two players, one board. May the best strategist win.
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className={cn(
            "text-2xl font-bold",
            winner === 'O' && 'text-green-500',
            winner === 'X' && 'text-pink-500',
            !winner && 'text-foreground'
            )}>
          {getStatusMessage()}
        </div>

        <div className="relative w-72 h-72 md:w-80 md:h-80">
          {/* Hash grid lines */}
          <div className="absolute w-full h-1.5 bg-primary/50 top-1/3 -translate-y-1/2 rounded-full"></div>
          <div className="absolute w-full h-1.5 bg-primary/50 top-2/3 -translate-y-1/2 rounded-full"></div>
          <div className="absolute h-full w-1.5 bg-primary/50 left-1/3 -translate-x-1/2 rounded-full"></div>
          <div className="absolute h-full w-1.5 bg-primary/50 left-2/3 -translate-x-1/2 rounded-full"></div>

          <div className="grid grid-cols-3 w-full h-full">
            {board.map((value, index) => (
              <div
                key={index}
                className="aspect-square flex items-center justify-center"
              >
                <Square value={value} onClick={() => handleSquareClick(index)} />
              </div>
            ))}
          </div>
        </div>

        {(winner || isDraw) && (
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
