
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { POKEMON_TIERS, Rarity, PokemonName, getOriginalRarity } from '@/lib/pokemon-data';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface PokemonCacheData {
  sprite: string;
  shinySprite: string;
}

interface PokedexEntry {
  name: PokemonName;
  rarity: Rarity;
  caught: number;
  shinyUnlocked: boolean;
}

export function Pokedex() {
  const [pokedexData, setPokedexData] = useState<PokedexEntry[]>([]);
  const [pokemonCache, setPokemonCache] = useState<Record<string, PokemonCacheData>>({});

  useEffect(() => {
    // Load from localStorage on mount
    try {
      const storedPokedex = localStorage.getItem('pokedex');
      const storedCache = localStorage.getItem('pokemonCache');
      
      const fullPokedex: PokedexEntry[] = [];
      const allPokemonNames = Object.values(POKEMON_TIERS).flat();

      if (storedPokedex) {
        const parsedPokedex: Partial<Record<PokemonName, Omit<PokedexEntry, 'name' | 'rarity'>>> = JSON.parse(storedPokedex);
        allPokemonNames.forEach(name => {
          fullPokedex.push({
            name,
            rarity: getOriginalRarity(name),
            caught: parsedPokedex[name.toLowerCase()]?.caught || 0,
            shinyUnlocked: parsedPokedex[name.toLowerCase()]?.shinyUnlocked || false,
          });
        });
      } else {
         allPokemonNames.forEach(name => {
          fullPokedex.push({ name, rarity: getOriginalRarity(name), caught: 0, shinyUnlocked: false });
        });
      }
      setPokedexData(fullPokedex);

      if (storedCache) {
        setPokemonCache(JSON.parse(storedCache));
      }
    } catch (e) {
      console.error("Failed to load Pokédex from localStorage", e);
    }
  }, []);

  const getRarityColor = (rarity: Rarity) => {
    switch (rarity) {
      case 'Common': return 'bg-gray-400';
      case 'Uncommon': return 'bg-green-400';
      case 'Rare': return 'bg-blue-400';
      case 'Legendary': return 'bg-purple-500';
      case 'Shiny': return 'bg-yellow-400 text-black';
      default: return 'bg-gray-200';
    }
  };
  
  const getRarityBorder = (rarity: Rarity) => {
    switch (rarity) {
      case 'Common': return 'border-gray-500';
      case 'Uncommon': return 'border-green-500';
      case 'Rare': return 'border-blue-500';
      case 'Legendary': return 'border-purple-600';
      case 'Shiny': return 'border-yellow-500';
      default: return 'border-gray-300';
    }
  };

  return (
    <ScrollArea className="h-full flex-grow">
      <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {pokedexData.map(entry => {
          const isCaught = entry.caught > 0;
          const cache = pokemonCache[entry.name.toLowerCase()];
          const spriteToShow = (isCaught && entry.shinyUnlocked) ? cache?.shinySprite : cache?.sprite;
          const displayRarity = entry.shinyUnlocked ? 'Shiny' : entry.rarity;

          return (
            <Card key={entry.name} className={cn(
              "p-2 text-center transition-all",
              isCaught ? 'bg-secondary' : 'bg-secondary/50',
              getRarityBorder(displayRarity)
            )}>
              <CardContent className="p-2 flex flex-col items-center justify-center h-full">
                <div className={cn("w-24 h-24 flex items-center justify-center rounded-md mb-2", isCaught ? 'bg-background' : 'bg-muted')}>
                  {cache && spriteToShow ? (
                    <img 
                      src={spriteToShow} 
                      alt={entry.name} 
                      className={cn("w-20 h-20", !isCaught && "grayscale opacity-50")}
                      style={{ imageRendering: 'pixelated' }}
                    />
                  ) : (
                    <div className="w-20 h-20 flex items-center justify-center text-5xl text-muted-foreground">?</div>
                  )}
                </div>
                <h3 className={cn("font-bold capitalize", isCaught ? 'text-foreground' : 'text-muted-foreground')}>{isCaught ? entry.name : '???'}</h3>
                
                {isCaught && (
                  <>
                    <Badge variant="outline" className={cn("mt-1", getRarityColor(displayRarity), getRarityBorder(displayRarity))}>{displayRarity}</Badge>
                    <p className="text-xs text-muted-foreground mt-2">Caught: {entry.caught}</p>
                    <div className="w-full mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Shiny Progress</p>
                        <Progress value={(entry.caught / 5) * 100} className="h-2"/>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </ScrollArea>
  );
}
