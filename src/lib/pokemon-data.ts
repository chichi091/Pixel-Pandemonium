
export type PokemonName =
  // Common
  | 'bulbasaur' | 'squirtle' | 'pikachu' | 'rattata' | 'pidgey'
  // Uncommon
  | 'ivysaur' | 'charmeleon' | 'weedle' | 'nidoran-m' | 'oddish'
  // Rare
  | 'venusaur' | 'charizard' | 'blastoise' | 'ninetales' | 'arcanine'
  // Legendary
  | 'articuno' | 'zapdos' | 'moltres' | 'mewtwo' | 'mew';

export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Legendary' | 'Shiny';

export const POKEMON_TIERS: Record<Rarity, PokemonName[]> = {
  Common: ['bulbasaur', 'squirtle', 'pikachu', 'rattata', 'pidgey'],
  Uncommon: ['ivysaur', 'charmeleon', 'weedle', 'nidoran-m', 'oddish'],
  Rare: ['venusaur', 'charizard', 'blastoise', 'ninetales', 'arcanine'],
  Legendary: ['articuno', 'zapdos', 'moltres', 'mewtwo', 'mew'],
  Shiny: [],
};

// Rarity probabilities: Common > Uncommon > Rare > Legendary
const RARITY_WEIGHTS: Record<Rarity, number> = {
  Common: 65,
  Uncommon: 20,
  Rare: 10,
  Legendary: 5,
  Shiny: 0,
};

const CATCH_REQUIREMENTS: Record<Rarity, { min: number; max: number }> = {
  Common: { min: 1, max: 5 },
  Uncommon: { min: 5, max: 10 },
  Rare: { min: 10, max: 15 },
  Legendary: { min: 15, max: 20 },
  Shiny: { min: 99, max: 99},
};

export const getOriginalRarity = (pokemonName: PokemonName): Rarity => {
    for (const rarity in POKEMON_TIERS) {
        if (POKEMON_TIERS[rarity as Rarity].includes(pokemonName)) {
            return rarity as Rarity;
        }
    }
    return 'Common';
}

export const getRandomPokemon = (): { name: PokemonName; rarity: Rarity } | null => {
  let pokedex: Record<string, { shinyUnlocked: boolean }> = {};
  try {
    const storedPokedex = localStorage.getItem('pokedex');
    if (storedPokedex) {
      pokedex = JSON.parse(storedPokedex);
    }
  } catch (e) {
    console.error("Failed to parse pokedex from localStorage", e);
  }

  const availablePokemon: { name: PokemonName; rarity: Rarity }[] = [];
  
  (Object.keys(POKEMON_TIERS) as Rarity[]).forEach(rarity => {
    if (rarity === 'Shiny') return;
    POKEMON_TIERS[rarity].forEach(name => {
      // Exclude pokemon if their shiny is already unlocked
      if (!pokedex[name.toLowerCase()]?.shinyUnlocked) {
        availablePokemon.push({ name, rarity });
      }
    });
  });

  if (availablePokemon.length === 0) {
    return null; // All shinies caught
  }

  const totalWeight = availablePokemon.reduce((sum, p) => sum + (RARITY_WEIGHTS[p.rarity] || 0), 0);
  let random = Math.random() * totalWeight;

  for (const pokemon of availablePokemon) {
    const weight = RARITY_WEIGHTS[pokemon.rarity] || 0;
    if (random < weight) {
      return pokemon;
    }
    random -= weight;
  }
  
  // Fallback in case something goes wrong with weights
  return availablePokemon[Math.floor(Math.random() * availablePokemon.length)];
};


export const getCatchRequirements = (rarity: Rarity): number => {
    const { min, max } = CATCH_REQUIREMENTS[rarity];
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
