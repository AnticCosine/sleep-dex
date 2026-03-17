import { Component, Input } from '@angular/core';
import { Recipe } from '../../../models/recipe.models';

@Component({
  selector: 'app-recipe-table',
  imports: [],
  templateUrl: './recipe-table.html',
  styleUrl: './recipe-table.css',
})
export class RecipeTable {
  @Input() recipes!: Recipe[];

  imageRecipePath(recipeId: string): string {
    return `assets/images/recipes/${recipeId}.png`
  }

  imageIngredientPath(ingredientId: string): string {
    return `assets/images/ingredients/${ingredientId}.png`
  }

}
