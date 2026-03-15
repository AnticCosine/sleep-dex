import { Component, Input } from '@angular/core';
import { Recipe } from '../../../models/recipe.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe-card',
  imports: [CommonModule],
  templateUrl: './recipe-card.html',
  styleUrl: './recipe-card.css',
})
export class RecipeCard {

  @Input() recipe!: Recipe;
  cooked = false;

  get imageRecipePath(): string {
    return `assets/images/recipes/${this.recipe.id}.png`
  }

  imageIngredientPath(ingredientId: string): string {
    return `assets/images/ingredients/${ingredientId}.png`
  }

  get totalIngredients(): number {
    return this.recipe.ingredients.reduce((total, ingredient) => total + ingredient.amount, 0);
  }

  toggleCooked() {
    this.cooked = !this.cooked;
  }

  get checkboxImage(): string {
    return this.cooked
      ? 'assets/images/checked_checkbox.svg'
      : 'assets/images/unchecked_checkbox.svg';
  }
}
