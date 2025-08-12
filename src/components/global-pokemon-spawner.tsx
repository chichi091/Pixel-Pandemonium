
'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getRandomPokemon, getCatchRequirements, PokemonName, Rarity, POKEMON_TIERS } from '@/lib/pokemon-data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Types
interface PokemonData {
  name: string;
  sprite: string;
  shinySprite: string;
}

interface PokemonCacheData {
  sprite: string;
  shinySprite: string;
}

interface Pokedex {
  [key: string]: {
    caught: number;
    shinyUnlocked: boolean;
  };
}

const SPAWN_TIMER_MIN = 2 * 60 * 1000; // 2 minutes
const SPAWN_TIMER_MAX = 3 * 60 * 1000; // 3 minutes
const DESPAWN_TIMER = 10 * 1000; // 10 seconds

const EXCLUDED_PATHS = ['/tic-tac-toe', '/dots-and-boxes', '/picky-pike', '/mario-slots', '/connect-four'];

export function GlobalPokemonSpawner() {
  const pathname = usePathname();
  const { toast } = useToast();
  
  const [activePokemon, setActivePokemon] = useState<PokemonData | null>(null);
  const [rarity, setRarity] = useState<Rarity | null>(null);
  const [isCatching, setIsCatching] = useState(false);
  const [catchProgress, setCatchProgress] = useState(0);
  const [requiredPresses, setRequiredPresses] = useState(0);

  const addAchievement = useCallback((achievement: string) => {
    try {
        const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
        if (achievements.includes(achievement)) {
            return;
        }
        const newAchievements = [...achievements, achievement];
        localStorage.setItem('achievements', JSON.stringify(newAchievements));
        
        toast({
            title: '🏆 Achievement Unlocked!',
            description: achievement,
        });
    } catch (error) {
        console.error("Failed to save achievements to localStorage", error);
    }
  }, [toast]);

  const getPokemonData = useCallback(async (pokemonName: PokemonName): Promise<PokemonData | null> => {
    const lowerCaseName = pokemonName.toLowerCase();
    try {
        const cache = localStorage.getItem('pokemonCache');
        const parsedCache: Record<string, PokemonCacheData> = cache ? JSON.parse(cache) : {};
        if (parsedCache[lowerCaseName]) {
            return { name: pokemonName, ...parsedCache[lowerCaseName] };
        }

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${lowerCaseName}`);
        if (!response.ok) throw new Error('Pokemon not found');
        const data = await response.json();
        
        const pokemonInfo: PokemonData = {
            name: pokemonName,
            sprite: data.sprites.front_default,
            shinySprite: data.sprites.front_shiny,
        };

        parsedCache[lowerCaseName] = { sprite: pokemonInfo.sprite, shinySprite: pokemonInfo.shinySprite };
        localStorage.setItem('pokemonCache', JSON.stringify(parsedCache));

        return pokemonInfo;
    } catch (error) {
        console.error(`Failed to fetch ${pokemonName}:`, error);
        return null;
    }
  }, []);

  const handleCatchSuccess = useCallback(() => {
    if (!activePokemon) return;

    toast({
      title: 'Caught!',
      description: `You successfully caught ${activePokemon.name}!`,
    });
    
    try {
        const pokedexStr = localStorage.getItem('pokedex') || '{}';
        const pokedex: Pokedex = JSON.parse(pokedexStr);
        const lowerCaseName = activePokemon.name.toLowerCase();

        const currentEntry = pokedex[lowerCaseName] || { caught: 0, shinyUnlocked: false };
        currentEntry.caught += 1;
        if (currentEntry.caught >= 5) {
            currentEntry.shinyUnlocked = true;
        }
        pokedex[lowerCaseName] = currentEntry;
        
        localStorage.setItem('pokedex', JSON.stringify(pokedex));
        
        const allPokemonList = (Object.values(POKEMON_TIERS).flat()) as PokemonName[];
        const totalUniquePokemon = allPokemonList.length;
        const caughtUniquePokemon = Object.keys(pokedex).filter(pName => pokedex[pName]?.caught > 0).length;
        
        if (caughtUniquePokemon >= totalUniquePokemon) {
          addAchievement("Pokémon Master");
        }
    } catch (e) {
        console.error("Failed to update Pokédex in localStorage", e);
    }

    setActivePokemon(null);
    setIsCatching(false);
  }, [activePokemon, toast, addAchievement]);

  const spawnPokemon = useCallback(async () => {
    if (activePokemon || document.visibilityState !== 'visible' || EXCLUDED_PATHS.includes(window.location.pathname)) return;

    const randomPokemon = getRandomPokemon();
    if (!randomPokemon) return; // No more pokemon to spawn
    
    const { name, rarity } = randomPokemon;
    const data = await getPokemonData(name);
    
    if (data) {
      setActivePokemon(data);
      setRarity(rarity);
      const presses = getCatchRequirements(rarity);
      setRequiredPresses(presses);
      setIsCatching(true);
      setCatchProgress(0);
    }
  }, [activePokemon, getPokemonData, pathname]);

  // Main spawn timer
  useEffect(() => {
    const setRandomSpawnTimer = () => {
      const randomInterval = Math.random() * (SPAWN_TIMER_MAX - SPAWN_TIMER_MIN) + SPAWN_TIMER_MIN;
      const timer = setTimeout(() => {
        spawnPokemon();
        setRandomSpawnTimer();
      }, randomInterval);
      return timer;
    };
    const spawnTimer = setRandomSpawnTimer();
    return () => clearTimeout(spawnTimer);
  }, [spawnPokemon]);

  // Despawn timer
  useEffect(() => {
    if (!isCatching || !activePokemon) return;

    const despawn = setTimeout(() => {
      if(activePokemon) { 
          toast({
            variant: 'destructive',
            title: 'Oh no!',
            description: `${activePokemon.name} got away...`,
          });
          setActivePokemon(null);
          setIsCatching(false);
      }
    }, DESPAWN_TIMER);
    
    return () => clearTimeout(despawn);
  }, [isCatching, activePokemon, toast]);

  // Check for catch success
  useEffect(() => {
    if (isCatching && catchProgress >= requiredPresses) {
      handleCatchSuccess();
    }
  }, [catchProgress, requiredPresses, isCatching, handleCatchSuccess]);

  // Key press handler for catching
  useEffect(() => {
    if (!isCatching) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'p') {
        setCatchProgress(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCatching]);

  if (EXCLUDED_PATHS.includes(pathname) || !activePokemon || !rarity) {
    return null;
  }
  
  const getRarityColor = (r: Rarity) => {
    switch (r) {
      case 'Common': return 'text-gray-500';
      case 'Uncommon': return 'text-green-500';
      case 'Rare': return 'text-blue-500';
      case 'Legendary': return 'text-purple-600';
      case 'Shiny': return 'text-yellow-500';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
        <Card className="w-64 border-2 border-primary shadow-2xl animate-in fade-in zoom-in-95">
            <CardHeader className="p-4 text-center">
                 <CardTitle className="capitalize">A wild {activePokemon.name} appeared!</CardTitle>
                 <CardDescription className={cn("font-bold", getRarityColor(rarity))}>
                   {rarity}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex flex-col items-center">
                <div className="bg-muted rounded-md p-2">
                    <img src={activePokemon.sprite} alt={activePokemon.name} className="w-32 h-32" style={{imageRendering: 'pixelated'}} />
                </div>
                <div className="w-full mt-4 text-center">
                    <p className="text-sm font-medium">Press 'p' to catch!</p>
                    <Progress value={(catchProgress / requiredPresses) * 100} className="h-4 mt-1" />
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
