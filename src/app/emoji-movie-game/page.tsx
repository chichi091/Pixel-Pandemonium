
'use client';

import { useState, useMemo, ChangeEvent, Fragment, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const allMovies = [
  { hint: '👦🏻👓⚡️', title: 'Harry Potter'},
  { hint: '⭐💣⚔️', title: 'Star Wars'},
  { hint: '🌃🏛️👨🔦🗿🙉', title: 'Night at The Museum'},
  { hint: '👴➡️👨➡️👦➡️👶',  title: 'The Curious Case of Benjamin Button'},
  { hint: '👸🏿🐸💋', title: 'The Princess and the Frog'},
  { hint: '🐀🍳🍽️🗼', title: 'Ratatouille'},
  { hint: '🐼🥋👊', title: 'Kung Fu Panda'},
  { hint: '😈👗👠', title: 'The Devil Wears Prada'},
  { hint: '👦✂️👐', title: 'Edward Scissorhands'},
  { hint: '🐈👢', title:'Puss In Boots'},
  { hint: '🤫🐐🐐', title: 'The Silence of the Lambs'},
  { hint: '🌗🧛‍♂️💑🐺', title: 'Twilight'},
  { hint: '👑🎤💬', title: "The King's Speech"},
  { hint: '👨🍫🏭', title: 'Charlie and the Chocolate Factory'},
  { hint: '👨🏼🔨⚡', title: 'Thor'},
  { hint: '👸🏼👠🕛', title: 'Cinderella'},
  { hint: '🌏🐒🐵🙉', title: 'Planet of the Apes'},
  { hint: '🌴💃🏼🕺🏼🎥🎹', title: 'La La Land'},
  { hint: '🐠❓', title: 'Finding Nemo' },
  { hint: '🌌🤾🏿‍♂️🐰🐷🐥', title: 'Space Jam'},
  { hint: '🦁👑', title: 'The Lion King' },
  { hint: '🕷️👨🏻‍🦱🕸️', title: 'Spider-Man' },
  { hint: '⬆️🎈🏠', title: 'Up' },
  { hint: '🤖❤️🤖', title: 'Wall-E' },
  { hint: '🐠🤷‍♀️', title: 'Finding Dory' },
];

const MovieInput = ({ char, onCorrect }: { char: string; onCorrect: () => void }) => {
  const [value, setValue] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length > 1) return;
    setValue(inputValue);
    if (inputValue.toLowerCase() === char.toLowerCase()) {
      onCorrect();
      const nextSibling = e.target.nextElementSibling as HTMLInputElement;
      if (nextSibling && nextSibling.tagName === 'INPUT') {
          nextSibling.focus();
      }
    }
  };

  return (
    <input
      className="w-10 h-10 text-center text-lg md:text-xl font-bold rounded-md border border-input bg-secondary focus:ring-2 focus:ring-ring"
      type="text"
      required
      maxLength={1}
      value={value}
      onChange={handleChange}
      pattern={`^[${char.toLowerCase()}${char.toUpperCase()}]{1}$`}
    />
  );
};

export default function EmojiMovieGamePage() {
  const [movies, setMovies] = useState<{hint: string, title: string}[]>([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [correctLetters, setCorrectLetters] = useState(0);

  const shuffleMovies = useCallback(() => {
    const shuffled = [...allMovies].sort(() => Math.random() - 0.5);
    setMovies(shuffled);
    setCurrentMovieIndex(0);
    setCorrectLetters(0);
  }, []);

  useEffect(() => {
    shuffleMovies();
  }, [shuffleMovies]);

  const currentMovie = useMemo(() => movies[currentMovieIndex], [movies, currentMovieIndex]);
  const isComplete = useMemo(() => {
    if (!currentMovie) return false;
    return correctLetters === currentMovie.title.replace(/ /g, '').length;
  }, [correctLetters, currentMovie]);
  
  useEffect(() => {
    setCorrectLetters(0);
  }, [currentMovieIndex]);

  const handleNextMovie = () => {
    if (currentMovieIndex < movies.length - 1) {
      setCurrentMovieIndex(prev => prev + 1);
    }
  };

  const handleRestart = () => {
    shuffleMovies();
  }
  
  const handleCorrectLetter = () => {
    setCorrectLetters(prev => prev + 1);
  }

  const renderInputs = () => {
    if (!currentMovie) return null;
    return (
      <div key={currentMovieIndex} className="flex flex-wrap items-center justify-center gap-2">
        {currentMovie.title.split('').map((char, i) =>
          char === ' ' ? (
            <div key={i} className="w-4"></div>
          ) : (
            <MovieInput key={i} char={char} onCorrect={handleCorrectLetter} />
          )
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
        <div className="text-center mb-8">
            <h1 className="text-6xl font-bold font-headline text-primary">Emoji Movies</h1>
            <p className="text-xl text-muted-foreground mt-2">Guess the movie title from the emoji hints.</p>
        </div>

        <Card className="w-full max-w-2xl shadow-2xl">
            <CardHeader className="items-center">
                 <p className="text-4xl md:text-5xl" aria-label="Emoji hint">
                    {currentMovie?.hint || '🎬'}
                 </p>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-8 min-h-[150px]">
                {currentMovieIndex < movies.length && movies.length > 0 ? (
                    <>
                        {renderInputs()}
                        {isComplete && (
                        <Button onClick={handleNextMovie}>
                            Next Movie
                        </Button>
                        )}
                    </>
                ) : (
                    <div className="text-center space-y-4">
                        <p className="text-2xl font-bold text-primary">Congratulations! 🎉</p>
                        <p className="text-muted-foreground">You guessed all the movies!</p>
                        <Button onClick={handleRestart}>Play Again</Button>
                    </div>
                )}
            </CardContent>
        </Card>

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
