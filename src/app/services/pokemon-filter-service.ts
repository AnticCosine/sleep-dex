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
    }
  ): Pokemon[] {
    const {
      search = '',
      ingredient = [],
      berry = [],
      pokemonType = [],
      sleepType = [],
      specialtyType = []
    } = options;

    const searchTerm = (search ?? ``).toLowerCase();

    return pokemon.filter(pokemon => {
      const matchedSearch = pokemon.name.toLowerCase().includes(searchTerm);
      const matchedIngredients = !berry?.length || berry.some(i => pokemon.berry.name.includes(i));
      const matchedBerries = !ingredient?.length || ingredient.some(i => pokemon.ingredients.includes(i));
      const matchedPokemonTypes = !pokemonType?.length || pokemonType.some(i => pokemon.type.includes(i));
      const matchedSleepType = !sleepType?.length || sleepType.some(i => pokemon.sleep_type.includes(i));
      const matchedspecialtyType = !specialtyType?.length || specialtyType.some(i => pokemon.specialty.includes(i));
      

      return matchedSearch && matchedIngredients && matchedBerries && matchedPokemonTypes && matchedSleepType && matchedspecialtyType;
    });
  }
}
