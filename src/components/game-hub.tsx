
'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Puzzle } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { TicTacToeIcon } from './icons/tic-tac-toe-icon';
import { DotsAndBoxesIcon } from './icons/dots-and-boxes-icon';
import { StarIcon } from './icons/star-icon';
import { ConnectFourIcon } from './icons/connect-four-icon';
import { QuestionMarkIcon } from './icons/question-mark-icon';
import { ClapperboardIcon } from './icons/clapperboard-icon';
import { HangmanIcon } from './icons/hangman-icon';
import { BoatIcon } from './icons/boat-icon';

const games = [
  {
    id: 'battleship',
    name: 'Battleship',
    description: "The classic game of naval warfare. Sink your opponent's fleet!",
    icon: BoatIcon,
    href: '/battleship',
    tags: ['Strategy', '2-Player'],
  },
  {
    id: 'tic-tac-toe',
    name: 'Tic-Tac-Toe',
    description: 'The classic game of Xs and Os. Challenge a friend!',
    icon: TicTacToeIcon,
    href: '/tic-tac-toe',
    tags: ['Strategy', '2-Player'],
  },
  {
    id: 'dots-and-boxes',
    name: 'Dots and Boxes',
    description: 'A game of cunning and connection. Claim the most boxes!',
    icon: DotsAndBoxesIcon,
    href: '/dots-and-boxes',
    tags: ['Strategy', '2-Player'],
  },
  {
    id: 'connect-four',
    name: 'Connect Four',
    description: 'Drop your discs and be the first to get four in a row!',
    icon: ConnectFourIcon,
    href: '/connect-four',
    tags: ['Strategy', '2-Player'],
  },
   {
    id: 'emoji-movie-game',
    name: 'Emoji Movie Game',
    description: 'Guess the movie titles from the emoji hints.',
    icon: ClapperboardIcon,
    href: '/emoji-movie-game',
    tags: ['Puzzle', '1-Player'],
  },
  {
    id: 'hangman',
    name: 'Hangman',
    description: "Guess the word one letter at a time before it's too late!",
    icon: HangmanIcon,
    href: '/hangman',
    tags: ['Puzzle', '1-Player'],
  },
  {
    id: 'pointless-trivia',
    name: 'Pointless Trivia',
    description: 'Test your knowledge of things that don\'t matter, powered by AI.',
    icon: QuestionMarkIcon,
    href: '/pointless-trivia',
    tags: ['Trivia', '1-Player', 'AI'],
  },
  {
    id: 'mario-slots',
    name: 'Mario Slots',
    description: 'Test your luck with this Super Mario-themed slot machine!',
    icon: StarIcon,
    href: '/mario-slots',
    tags: ['Arcade', '1-Player'],
  },
  // Add more games here in the future
];

export function GameHub() {
  return (
      <ScrollArea className="flex-grow p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => {
              const Icon = game.icon;
              return (
                <Card key={game.id} className="bg-background/50 flex flex-col">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                       <div className="p-2 bg-secondary rounded-md flex-shrink-0">
                         <Icon className="w-8 h-8 text-primary" />
                       </div>
                       <div className="flex-grow">
                        <CardTitle className="font-headline text-xl">{game.name}</CardTitle>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {game.tags.map(tag => (
                                <span key={tag} className="text-xs px-2 py-0.5 bg-secondary rounded-full whitespace-nowrap">{tag}</span>
                            ))}
                        </div>
                       </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription>{game.description}</CardDescription>
                  </CardContent>
                  <div className="p-4 pt-0">
                    <Button asChild className="w-full">
                      <Link href={game.href}>Play Now</Link>
                    </Button>
                  </div>
                </Card>
              );
            })}
             <Card className="bg-background/50 flex flex-col items-center justify-center text-center p-6 border-dashed">
                <CardHeader>
                    <CardTitle className="font-headline text-xl">More Games Coming Soon</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription>Our team of highly-trained sloths are working hard to bring you more ways to avoid work.</CardDescription>
                </CardContent>
            </Card>
          </div>
      </ScrollArea>
  );
}
