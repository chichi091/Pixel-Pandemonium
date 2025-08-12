
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { updatePlayerWinCount } from '@/lib/player-achievements';
import { useToast } from '@/hooks/use-toast';

const ROWS = 6;
const COLS = 7;
type Player = 'Thing 1' | 'Thing 2';
type CellValue = Player | null;

const createEmptyBoard = (): CellValue[][] => Array.from({ length: ROWS }, () => Array(COLS).fill(null));

const checkWinner = (board: CellValue[][]): Player | null => {
  // Check horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      if (board[r][c] && board[r][c] === board[r][c + 1] && board[r][c] === board[r][c + 2] && board[r][c] === board[r][c + 3]) {
        return board[r][c];
      }
    }
  }

  // Check vertical
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] && board[r][c] === board[r + 1][c] && board[r][c] === board[r + 2][c] && board[r][c] === board[r + 3][c]) {
        return board[r][c];
      }
    }
  }

  // Check diagonal (down-right)
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      if (board[r][c] && board[r][c] === board[r + 1][c + 1] && board[r][c] === board[r + 2][c + 2] && board[r][c] === board[r + 3][c + 3]) {
        return board[r][c];
      }
    }
  }

  // Check diagonal (up-right)
  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      if (board[r][c] && board[r][c] === board[r - 1][c + 1] && board[r][c] === board[r - 2][c + 2] && board[r][c] === board[r - 3][c + 3]) {
        return board[r][c];
      }
    }
  }

  return null;
};

export default function ConnectFourPage() {
  const [board, setBoard] = useState<CellValue[][]>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('Thing 1');
  const [winner, setWinner] = useState<Player | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const { toast } = useToast();

  const checkForGameAchievement = useCallback(() => {
    try {
        localStorage.setItem('played_connect-four', 'true');
        const playedTicTacToe = localStorage.getItem('played_tic-tac-toe');
        const playedDotsAndBoxes = localStorage.getItem('played_dots-and-boxes');

        if (playedTicTacToe && playedDotsAndBoxes) {
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

  const handleColumnClick = (colIndex: number) => {
    if (winner || board[0][colIndex]) return; // Column is full or game over

    const newBoard = board.map(row => [...row]);
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!newBoard[r][colIndex]) {
        newBoard[r][colIndex] = currentPlayer;
        break;
      }
    }

    setBoard(newBoard);

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      updatePlayerWinCount(newWinner);
    } else if (newBoard.flat().every(cell => cell !== null)) {
      setIsDraw(true);
    } else {
      setCurrentPlayer(currentPlayer === 'Thing 1' ? 'Thing 2' : 'Thing 1');
    }
  };

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer('Thing 1');
    setWinner(null);
    setIsDraw(false);
  };

  const getStatusMessage = () => {
    if (winner) return `${winner} Wins!`;
    if (isDraw) return "It's a Draw!";
    return `${currentPlayer}'s Turn`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold font-headline text-primary">Connect Four</h1>
        <p className="text-xl text-muted-foreground mt-2">Drop your discs and get four in a row.</p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="text-2xl font-bold">{getStatusMessage()}</div>
        
        <div className="bg-blue-800 p-3 rounded-lg shadow-2xl">
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
            {Array.from({ length: COLS }).map((_, colIndex) => (
              <div key={colIndex} onClick={() => handleColumnClick(colIndex)} className="w-12 h-12 md:w-14 md:h-14 cursor-pointer">
                {/* This div is for click handling, pieces are rendered below */}
              </div>
            ))}
          </div>
          <div className="relative grid gap-2" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}>
            {board.map((row, r) =>
              row.map((cell, c) => (
                <div key={`${r}-${c}`} className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
                  <div className="absolute w-full h-full bg-blue-800 rounded-full" style={{
                     clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0 50%, 50% 50%)',
                     WebkitClipPath: 'evenodd',
                  }}/>
                  <div
                    className={cn(
                      "absolute w-10 h-10 md:w-12 md:h-12 rounded-full transition-colors",
                      cell === 'Thing 1' ? 'bg-green-500' :
                      cell === 'Thing 2' ? 'bg-pink-500' : 'bg-background'
                    )}
                  />
                </div>
              ))
            )}
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
