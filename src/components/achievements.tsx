
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Crown, Puzzle, Coffee, Dog, Sparkles, CheckCircle, Star, Swords } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

const allAchievements = [
  { id: 'Dimensional Drifter', name: 'Dimensional Drifter', description: 'Solved the dimensional rift puzzle on the 404 page.', icon: Puzzle, iconClass: 'text-green-500' },
  { id: 'Boredom Destroyer', name: 'Boredom Destroyer', description: 'Played all games in the Game Hub once.', icon: Crown, iconClass: 'text-purple-500' },
  { id: 'Coffee Addict', name: 'Coffee Addict', description: 'Became one with the eternal coffee rain.', icon: Coffee, iconClass: 'text-yellow-700' },
  { id: 'Dog Spotter', name: 'Dog Spotter', description: 'Found all the hidden puppies in the Cat Café.', icon: Dog, iconClass: 'text-orange-500' },
  { id: 'Chaos Coordinator', name: 'Chaos Coordinator', description: 'Discovered all major easter eggs.', icon: Sparkles, iconClass: 'text-pink-500' },
  { id: 'Pokémon Master', name: 'Pokémon Master', description: 'Caught every species of Pokémon at least once.', icon: CheckCircle, iconClass: 'text-blue-500' },
  { id: 'Stay Forever', name: 'Stay Forever', description: 'You clicked all the SKZOO characters!', icon: Star, iconClass: 'text-pink-400' },
  { id: 'Thing 1 Supremacy', name: 'Thing 1 Supremacy', description: 'Thing 1 has won 3 games.', icon: Swords, iconClass: 'text-green-500' },
  { id: 'Thing 2 Domination', name: 'Thing 2 Domination', description: 'Thing 2 has won 3 games.', icon: Swords, iconClass: 'text-pink-500' },
];

const leaderboard = [
  { name: 'Quantum Quasar', title: 'Lord of the Spreadsheet Realm', score: 9001 },
  { name: 'Sir Reginald IV', title: 'Certified Stapler Whisperer', score: 8750 },
  { name: 'Velocityraptor', title: 'Chief Procrastination Officer', score: 8500 },
  { name: 'Captain Caffeinator', title: 'Duke of Donuts', score: 7200 },
  { name: 'The Void Gazer', title: 'Master of the Mundane', score: 5000 },
];


export function Achievements({ unlockedAchievements }: { unlockedAchievements: string[] }) {
  return (
    <ScrollArea className="flex-grow">
      <div className="p-4 md:p-6 grid grid-cols-1 gap-6">
          <Card className="bg-background/50">
              <CardHeader>
                  <CardTitle className="font-headline text-2xl text-primary">Leaderboard</CardTitle>
                  <CardDescription>The most legendary figures in this office dimension.</CardDescription>
              </CardHeader>
              <CardContent>
                  <ul className="space-y-3">
                  {leaderboard.map((player, index) => (
                      <li key={index} className="flex items-center justify-between p-3 rounded-md bg-secondary/50">
                      <div className="flex items-center">
                          <Crown className="w-5 h-5 mr-3 text-yellow-500" />
                          <div>
                          <p className="font-bold text-sm">{player.name}</p>
                          <p className="text-xs text-muted-foreground">{player.title}</p>
                          </div>
                      </div>
                      <span className="font-bold text-primary text-md">{player.score}</span>
                      </li>
                  ))}
                  </ul>
              </CardContent>
          </Card>

          <Card className="bg-background/50">
              <CardHeader>
                  <CardTitle className="font-headline text-2xl text-primary">Your Legacy</CardTitle>
                  <CardDescription>A testament to your dedication to avoiding actual work. You have unlocked {unlockedAchievements.length} of {allAchievements.length} achievements.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                  {allAchievements.map(ach => {
                      const Icon = ach.icon;
                      const isUnlocked = unlockedAchievements.includes(ach.id);
                      
                      return (
                          <div
                              key={ach.id}
                              className={cn(
                                  "flex flex-col items-center text-center p-4 border rounded-lg transition-all h-full",
                                  isUnlocked
                                  ? 'border-accent bg-accent/10'
                                  : 'border-border bg-background/50 text-muted-foreground grayscale'
                              )}
                          >
                              <div className={cn("p-2 bg-background rounded-full mb-2", !isUnlocked && "opacity-50")}>
                                  <Icon className={cn("w-8 h-8", ach.iconClass)} />
                              </div>
                              <p className="font-bold text-sm">{ach.name}</p>
                              <p className="text-xs mt-1">{ach.description}</p>
                          </div>
                      );
                  })}
                  </div>
              </CardContent>
          </Card>
      </div>
    </ScrollArea>
  );
}
