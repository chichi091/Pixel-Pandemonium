
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RefreshCw, Zap, Waves } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { updatePlayerWinCount } from '@/lib/player-achievements';

const GRID_SIZE = 10;
const SHIPS = [
  { name: 'Carrier', length: 5 },
  { name: 'Battleship', length: 4 },
  { name: 'Cruiser', length: 3 },
  { name: 'Submarine', length: 3 },
  { name: 'Destroyer', length: 2 },
];

type CellState = 'empty' | 'ship' | 'hit' | 'miss';
type Grid = CellState[][];
type ShipPlacement = { name: string; length: number; positions: { r: number; c: number }[] };

const createEmptyGrid = (): Grid =>
  Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill('empty'));

export default function BattleshipPage() {
  const { toast } = useToast();
  const [phase, setPhase] = useState<'placement-p1' | 'placement-p2' | 'battle' | 'game-over'>('placement-p1');
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [winner, setWinner] = useState<1 | 2 | null>(null);

  const [p1Ships, setP1Ships] = useState<ShipPlacement[]>([]);
  const [p2Ships, setP2Ships] = useState<ShipPlacement[]>([]);
  
  const [p1Grid, setP1Grid] = useState<Grid>(createEmptyGrid()); // Player 1's own ships
  const [p2Grid, setP2Grid] = useState<Grid>(createEmptyGrid()); // Player 2's own ships

  // State for placing ships
  const [shipIndexToPlace, setShipIndexToPlace] = useState(0);
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);
  const [lastTurnMessage, setLastTurnMessage] = useState('');

  const handleCellClickPlacement = (r: number, c: number) => {
    const isP1Placing = phase === 'placement-p1';
    const activeGrid = isP1Placing ? p1Grid : p2Grid;
    const setActiveGrid = isP1Placing ? setP1Grid : setP2Grid;
    const activeShips = isP1Placing ? p1Ships : p2Ships;
    const setActiveShips = isP1Placing ? setP1Ships : setP2Ships;

    const ship = SHIPS[shipIndexToPlace];
    if (!ship) return;

    let positions: { r: number; c: number }[] = [];
    let canPlace = true;

    for (let i = 0; i < ship.length; i++) {
      let newR = r;
      let newC = c;
      if (orientation === 'horizontal') newC += i;
      else newR += i;

      if (newR >= GRID_SIZE || newC >= GRID_SIZE || activeGrid[newR][newC] === 'ship') {
        canPlace = false;
        break;
      }
      positions.push({ r: newR, c: newC });
    }

    if (canPlace) {
      const newGrid = activeGrid.map(row => [...row]);
      const newShip: ShipPlacement = { name: ship.name, length: ship.length, positions: [] };
      positions.forEach(pos => {
        newGrid[pos.r][pos.c] = 'ship';
        newShip.positions.push(pos);
      });

      setActiveGrid(newGrid);
      setActiveShips([...activeShips, newShip]);

      if (shipIndexToPlace + 1 < SHIPS.length) {
        setShipIndexToPlace(shipIndexToPlace + 1);
      } else {
        if (isP1Placing) {
          setPhase('placement-p2');
          setShipIndexToPlace(0);
          toast({ title: "Thing 1's ships are set!", description: "Now it's Thing 2's turn to place their fleet." });
        } else {
          setPhase('battle');
          setCurrentPlayer(1);
          toast({ title: "Let the battle begin!", description: "Thing 1 starts." });
        }
      }
    } else {
      toast({ variant: 'destructive', title: 'Invalid Placement', description: 'Cannot place ship here. Overlaps another ship or goes off the board.' });
    }
  };

  const handleFire = (r: number, c: number, targetPlayer: 1 | 2) => {
    if (phase !== 'battle' || currentPlayer !== targetPlayer) return;

    const targetGrid = targetPlayer === 1 ? p2Grid : p1Grid;
    const setTargetGrid = targetPlayer === 1 ? setP2Grid : setP1Grid;
    const targetShips = targetPlayer === 1 ? p2Ships : p1Ships;
    const firingPlayerName = currentPlayer === 1 ? 'Thing 1' : 'Thing 2';

    if (targetGrid[r][c] === 'hit' || targetGrid[r][c] === 'miss') {
        toast({description: "You've already fired at this location."});
        return;
    }

    const newGrid = targetGrid.map(row => [...row]);
    let message = '';

    if (targetGrid[r][c] === 'ship') {
        newGrid[r][c] = 'hit';
        message = `${firingPlayerName} scores a HIT! 💥`;

        const allShipsSunk = targetShips.every(ship => ship.positions.every(pos => newGrid[pos.r][pos.c] === 'hit'));
        if (allShipsSunk) {
            setWinner(currentPlayer);
            setPhase('game-over');
            updatePlayerWinCount(currentPlayer === 1 ? 'Thing 1' : 'Thing 2');
        } else {
            const sunkShip = targetShips.find(ship => ship.positions.every(pos => newGrid[pos.r][pos.c] === 'hit') && ship.positions.some(pos => pos.r === r && pos.c === c));
            if(sunkShip) {
                message = `${firingPlayerName} SUNK their ${sunkShip.name}! 💣`;
            }
        }
    } else {
        newGrid[r][c] = 'miss';
        message = `${firingPlayerName} MISSES. 🌊`;
    }
    
    setTargetGrid(newGrid);
    setLastTurnMessage(message);

    if (phase !== 'game-over') {
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  };

  const resetGame = () => {
    setPhase('placement-p1');
    setCurrentPlayer(1);
    setWinner(null);
    setP1Ships([]);
    setP2Ships([]);
    setP1Grid(createEmptyGrid());
    setP2Grid(createEmptyGrid());
    setShipIndexToPlace(0);
    setOrientation('horizontal');
    setLastTurnMessage('');
  };

  const renderGrid = (grid: Grid, onCellClick: (r: number, c: number) => void, isPlacement: boolean, isClickable: boolean) => {
    const shipToPlace = SHIPS[shipIndexToPlace];
    let placementPreview: { r: number, c: number }[] = [];

    if (isPlacement && hoveredCell) {
      for(let i=0; i < (shipToPlace?.length || 0); i++) {
        let r = hoveredCell.r, c = hoveredCell.c;
        if (orientation === 'horizontal') c += i; else r += i;
        if(r < GRID_SIZE && c < GRID_SIZE) placementPreview.push({r, c});
      }
    }

    return (
      <div className="grid grid-cols-10 gap-1 bg-blue-900/50 p-2 rounded-md">
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const isPreview = placementPreview.some(p => p.r === r && p.c === c);
            const showShip = isPlacement && cell === 'ship';
            return (
              <div
                key={`${r}-${c}`}
                className={cn(
                  'w-8 h-8 md:w-10 md:h-10 border border-blue-400/50 flex items-center justify-center transition-colors',
                  isClickable ? 'cursor-crosshair bg-blue-500/50 hover:bg-blue-400/50' : 'bg-blue-600/50',
                  showShip && 'bg-gray-500',
                  cell === 'hit' && 'bg-red-500 animate-pulse',
                  cell === 'miss' && 'bg-sky-800',
                  isPreview && 'bg-yellow-500/50'
                )}
                onClick={() => onCellClick(r, c)}
                onMouseEnter={isPlacement ? () => setHoveredCell({r, c}) : undefined}
                onMouseLeave={isPlacement ? () => setHoveredCell(null) : undefined}
              >
                {cell === 'hit' && <Zap className="w-5 h-5 text-white" />}
                {cell === 'miss' && <Waves className="w-5 h-5 text-white/50" />}
              </div>
            );
          })
        )}
      </div>
    );
  };
  
  if (phase === 'game-over') {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
             <Card className="text-center p-8">
              <CardHeader>
                  <CardTitle className="text-4xl font-headline text-primary">🎉 Thing {winner} Wins! 🎉</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-muted-foreground mb-6">Congratulations on your naval superiority!</p>
                  <Button size="lg" onClick={resetGame}>
                    <RefreshCw className="mr-2 h-5 w-5" /> Play Again
                  </Button>
              </CardContent>
             </Card>
        </div>
    )
  }
  
  const placementPlayer = phase === 'placement-p1' ? 1 : 2;
  const placementGrid = phase === 'placement-p1' ? p1Grid : p2Grid;

  if (phase === 'placement-p1' || phase === 'placement-p2') {
     return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
            <h1 className="text-6xl font-bold font-headline text-primary mb-2">Battleship</h1>
            <p className="text-xl text-muted-foreground mt-2 mb-8">The classic game of naval warfare.</p>
            <Card className="w-full max-w-md p-4">
            <CardHeader>
                <CardTitle className="text-2xl">Thing {placementPlayer}: Place Your Ships</CardTitle>
                <p className="text-muted-foreground">Placing: {SHIPS[shipIndexToPlace]?.name} ({SHIPS[shipIndexToPlace]?.length})</p>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                {renderGrid(placementGrid, (r, c) => handleCellClickPlacement(r, c), true, true)}
                <div className="flex gap-4">
                    <Button onClick={() => setOrientation(o => o === 'horizontal' ? 'vertical' : 'horizontal')}>
                        Rotate Ship ({orientation})
                    </Button>
                    <Button onClick={resetGame} variant="destructive">Reset</Button>
                </div>
            </CardContent>
            </Card>
        </div>
     );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="text-center mb-4">
        <h1 className="text-6xl font-bold font-headline text-primary">Battleship</h1>
        <p className="text-xl text-muted-foreground mt-2">The classic game of naval warfare.</p>
      </div>

       <div className="mt-4 text-center">
            <h2 className={cn("text-3xl font-bold transition-all", currentPlayer === 1 ? 'text-green-400' : 'text-pink-400')}>
                Thing {currentPlayer}'s Turn
            </h2>
            <p className="text-muted-foreground h-6 mt-1 text-lg">{lastTurnMessage || "Click on an opponent's grid to fire."}</p>
        </div>

      <div className="flex flex-col lg:flex-row items-start justify-center gap-8 mt-4">
        <div className="flex flex-col gap-2 items-center">
            <h2 className="text-xl font-bold text-green-400">Thing 1's Firing Grid</h2>
            <p className="text-sm text-muted-foreground">(Attacking Thing 2)</p>
            {renderGrid(p2Grid, (r, c) => handleFire(r, c, 1), false, currentPlayer === 1)}
        </div>
        <div className="flex flex-col gap-2 items-center">
            <h2 className="text-xl font-bold text-pink-400">Thing 2's Firing Grid</h2>
            <p className="text-sm text-muted-foreground">(Attacking Thing 1)</p>
            {renderGrid(p1Grid, (r, c) => handleFire(r, c, 2), false, currentPlayer === 2)}
        </div>
      </div>
      
      <div className="flex gap-4 mt-8">
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hub
          </Link>
        </Button>
        <Button onClick={resetGame} variant="destructive">
            <RefreshCw className="mr-2 h-4 w-4" /> Reset Game
        </Button>
      </div>
    </div>
  );
}
