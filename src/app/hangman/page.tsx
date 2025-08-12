
'use client';

import { useState, useEffect, useCallback, FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HangmanDrawing } from '@/components/hangman-drawing';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const words = ['react', 'nextjs', 'tailwind', 'typescript', 'javascript', 'firebase', 'pandemonium', 'procrastination', 'component', 'developer'];
const getRandomWord = () => words[Math.floor(Math.random() * words.length)];

const Keyboard = ({ activeLetters, inactiveLetters, onSelect, disabled }: {
    activeLetters: string[];
    inactiveLetters: string[];
    onSelect: (letter: string) => void;
    disabled?: boolean;
}) => {
    const keys = 'abcdefghijklmnopqrstuvwxyz'.split('');
    return (
        <div className="grid grid-cols-7 gap-2">
            {keys.map(key => {
                const isActive = activeLetters.includes(key);
                const isInactive = inactiveLetters.includes(key);
                return (
                    <Button
                        key={key}
                        variant={isActive ? 'default' : isInactive ? 'destructive' : 'outline'}
                        disabled={isActive || isInactive || disabled}
                        onClick={() => onSelect(key)}
                        className="uppercase font-bold text-lg p-2 aspect-square"
                    >
                        {key}
                    </Button>
                )
            })}
        </div>
    );
};


export default function HangmanPage() {
    const [gameMode, setGameMode] = useState<'selection' | 'word-input' | 'playing'>('selection');
    const [wordToGuess, setWordToGuess] = useState('');
    const [customWord, setCustomWord] = useState('');
    const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
    const [playMode, setPlayMode] = useState<'computer' | 'player' | null>(null);

    const incorrectLetters = guessedLetters.filter(letter => !wordToGuess.includes(letter));
    const isLoser = incorrectLetters.length >= 6;
    const isWinner = wordToGuess.length > 0 && wordToGuess.split('').every(letter => guessedLetters.includes(letter));

    const startGame = (mode: 'computer' | 'player') => {
        setPlayMode(mode);
        if (mode === 'computer') {
            setWordToGuess(getRandomWord());
            setGameMode('playing');
        } else {
            setGameMode('word-input');
        }
        setGuessedLetters([]);
    };

    const handleCustomWordSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!customWord) return;
        setWordToGuess(customWord.toLowerCase());
        setGameMode('playing');
        setCustomWord('');
    };

    const resetGame = useCallback(() => {
        if (!playMode) {
            setGameMode('selection');
            return;
        }
        if (playMode === 'computer') {
            setWordToGuess(getRandomWord());
            setGameMode('playing');
        } else {
            setGameMode('word-input');
        }
        setGuessedLetters([]);
    }, [playMode]);

    const addGuessedLetter = useCallback((letter: string) => {
        if (guessedLetters.includes(letter) || isWinner || isLoser) return;
        setGuessedLetters(currentLetters => [...currentLetters, letter]);
    }, [guessedLetters, isWinner, isLoser]);

    useEffect(() => {
        if (gameMode !== 'playing') return;
        const handler = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            if (!key.match(/^[a-z]$/)) return;
            e.preventDefault();
            addGuessedLetter(key);
        };
        document.addEventListener('keypress', handler);
        return () => document.removeEventListener('keypress', handler);
    }, [addGuessedLetter, gameMode]);

    const backToHubButton = (
        <Button asChild variant="outline">
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hub
            </Link>
        </Button>
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 gap-8">
            <div className="text-center">
                <h1 className="text-6xl font-bold font-headline text-primary">Hangman</h1>
                {gameMode === 'selection' && <p className="text-xl text-muted-foreground mt-2">Choose your game mode.</p>}
                {gameMode === 'word-input' && <p className="text-xl text-muted-foreground mt-2">Enter a word for your friend to guess.</p>}
                {gameMode === 'playing' && <p className="text-xl text-muted-foreground mt-2">Guess the word, save the stick man.</p>}
            </div>
            
            {gameMode === 'selection' && (
                <div className="flex flex-col gap-4 w-full max-w-xs">
                    <Button size="lg" onClick={() => startGame('computer')}>Play vs. Computer</Button>
                    <Button size="lg" variant="secondary" onClick={() => startGame('player')}>2 Player Mode</Button>
                    <div className="mt-4">{backToHubButton}</div>
                </div>
            )}

            {gameMode === 'word-input' && (
                 <div className="flex flex-col gap-4 w-full max-w-xs">
                    <form onSubmit={handleCustomWordSubmit} className="flex flex-col gap-4 w-full">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="word-input">Secret Word</Label>
                            <Input
                                id="word-input"
                                type="password"
                                value={customWord}
                                onChange={(e) => setCustomWord(e.target.value.replace(/[^a-zA-Z]/g, ''))}
                                required
                                autoFocus
                            />
                            <p className="text-xs text-muted-foreground">Letters only. The word will be hidden.</p>
                        </div>
                        <Button size="lg" type="submit">Start Game</Button>
                    </form>
                    <div className="flex gap-4 justify-center">
                        {backToHubButton}
                        <Button onClick={() => setGameMode('selection')} variant="ghost">Back to Selection</Button>
                    </div>
                </div>
            )}

            {gameMode === 'playing' && (
                <>
                    <div className="flex flex-col md:flex-row items-center gap-8 w-full max-w-4xl">
                        <div className="flex-1 flex justify-center">
                            <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-8 w-full">
                           <div className="text-center text-2xl font-bold h-8">
                                {isWinner && <div className="text-green-500">You Win!</div>}
                                {isLoser && <div className="text-destructive">You Lose! The word was: <span className="font-mono">{wordToGuess}</span></div>}
                            </div>
                            <div className="flex gap-2 text-4xl md:text-5xl font-mono uppercase tracking-widest">
                                {wordToGuess.split('').map((letter, index) => (
                                    <span key={index} className="border-b-4 border-foreground w-10 text-center">
                                        <span className={cn(
                                            'transition-opacity duration-300',
                                            guessedLetters.includes(letter) || isLoser ? 'opacity-100' : 'opacity-0',
                                            !guessedLetters.includes(letter) && isLoser ? 'text-destructive' : 'text-foreground'
                                        )}>
                                            {letter}
                                        </span>
                                    </span>
                                ))}
                            </div>
                            <div className="w-full max-w-md">
                                <Keyboard 
                                    activeLetters={guessedLetters.filter(letter => wordToGuess.includes(letter))}
                                    inactiveLetters={incorrectLetters}
                                    onSelect={addGuessedLetter}
                                    disabled={isWinner || isLoser}
                                />
                            </div>
                        </div>
                    </div>
                     <div className="flex gap-4">
                        {backToHubButton}
                        <Button onClick={() => setGameMode('selection')}>
                            <RefreshCw className="mr-2 h-4 w-4" /> New Game Mode
                        </Button>
                        {(isWinner || isLoser) && (
                            <Button onClick={resetGame}>
                                Play Again
                            </Button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
