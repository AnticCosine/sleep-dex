import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe.models';

@Injectable({
  providedIn: 'root',
})
export class RecipeFilterService {

  filterRecipes(
    recipes: Recipe[],
    options: {
      search?: string | null,
      recipeTypes: string[] | null,
      ingredient?: string[] | null;
      minIngredients?: number | null;
      maxIngredients?: number | null;
      cooked?: string[] | null;
      cookedFilter?: string[] | null;
      potSize?:  number | null;
      sundayBonus?: boolean | null;
      magneZoneBonus?: number | null;
    }
  ): Recipe[] {
    const {
      search = '',
      recipeTypes = [],
      ingredient = [],
      minIngredients,
      maxIngredients,
      cooked = [],
      cookedFilter = [],
      potSize = null,
      sundayBonus,
      magneZoneBonus 
    } = options;

    const searchTerm = (search ?? ``).toLowerCase();

    return recipes.filter(recipe => {
      const matchedSearch = recipe.name.toLowerCase().includes(searchTerm);
      const matchedRecipeType = !recipeTypes?.length || recipeTypes.includes(recipe.type);
      const matchedIngredients = !ingredient?.length || ingredient.every(i => recipe.ingredients.some(j => j.ingredientId === i));

      const totalIngredients = recipe.ingredients.reduce((total, ingredient) => total + ingredient.amount, 0);
      const matchedMinIngredients = minIngredients == null || totalIngredients >= minIngredients;
      const matchedMaxIngredients = maxIngredients == null || totalIngredients <= maxIngredients;
      const sundayPot = sundayBonus && potSize != null ? potSize * 2 : potSize;
      const effectivePotSize = sundayPot == null
        ? null
        : sundayPot + (magneZoneBonus ?? 0);

      const matchedPotSize = effectivePotSize == null || totalIngredients <= effectivePotSize;
      const isCooked = cookedFilter?.includes(recipe.id);

      const matchedCookedRecipes = !cooked?.length || (cooked?.includes('cooked') && isCooked) || (cooked?.includes('uncooked') && !isCooked);

      return matchedSearch && matchedRecipeType && matchedIngredients && matchedMinIngredients && matchedMaxIngredients && matchedCookedRecipes && matchedPotSize;
    });
  }
}
