import { Injectable } from '@angular/core';
import { Pokemon } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonFilterService {

  filterPokemon(
    pokemon: Pokemon[],
    options: {
      search?: string | null,
      ingredient?: string[] | null;
      berry?: string[] | null;
      pokemonType?: string[] | null;
      sleepType?: string[] | null;
      specialtyType?: string[] | null;
      mapType?: string[] | null;
      unlockedStyle?: string[] | null;
      unlockedFilter?: Record<string, number[]> | null;
      minDrowsy?: number | null;
      maxDrowsy?: number | null;
    }
  ): Pokemon[] {
    const {
      search = '',
      ingredient = [],
      berry = [],
      pokemonType = [],
      sleepType = [],
      specialtyType = [],
      mapType = [],
      unlockedStyle = [],
      unlockedFilter = {},
      minDrowsy,
      maxDrowsy
    } = options;

    const searchTerm = (search ?? ``).toLowerCase();

    return pokemon.filter(pokemon => {
      const matchedSearch = pokemon.name.toLowerCase().includes(searchTerm);
      const matchedIngredients = !berry?.length || berry.some(i => pokemon.berry.name.includes(i));
      const matchedBerries = !ingredient?.length || ingredient.some(i => pokemon.ingredients.includes(i));
      const matchedPokemonTypes = !pokemonType?.length || pokemonType.some(i => pokemon.type.includes(i));
      const matchedSleepType = !sleepType?.length || sleepType.some(i => pokemon.sleep_type.includes(i));
      const matchedspecialtyType = !specialtyType?.length || specialtyType.some(i => pokemon.specialty.includes(i));
      const matchedMapType = !mapType?.length || mapType.every(i => Object.values(pokemon.availability).some(islands => islands.includes(i)));

      const styles = unlockedFilter?.[pokemon.id] ?? [];
      const isUnlocked = styles.length === pokemon.number_of_sleep_styles;
      const isLocked = styles.length === 0;
      const isPartialUnlocked = styles.length > 0 && styles.length < pokemon.number_of_sleep_styles;
      const matchedUnlockedStyle = !unlockedStyle?.length || (unlockedStyle?.includes('unlocked') && isUnlocked) || (unlockedStyle?.includes('locked') && isLocked) || (unlockedStyle?.includes('partial') && isPartialUnlocked);

      const matchedDrowsy =
        pokemon.drowsy_power_requirement_list.some(drowsy => {
          if (drowsy == null) return false;
        
          const meetsMin = minDrowsy == null || drowsy >= minDrowsy;
          const meetsMax = maxDrowsy == null || drowsy <= maxDrowsy;
        
          return meetsMin && meetsMax;
      });
      
      return matchedSearch && matchedIngredients && matchedBerries && matchedPokemonTypes && matchedSleepType && matchedspecialtyType && matchedMapType && matchedUnlockedStyle && matchedDrowsy;
    });
  }
}
