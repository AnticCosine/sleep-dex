import { Component, Input } from '@angular/core';
import { Recipe } from '../../../models/recipe.models';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../../services/recipe-service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-recipe-card',
  imports: [CommonModule],
  templateUrl: './recipe-card.html',
  styleUrl: './recipe-card.css',
})
export class RecipeCard {

  @Input() recipe!: Recipe;
  cooked = false;

  cooked$!: Observable<boolean>;

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.cooked = this.recipeService.isCooked(this.recipe.id);

    this.cooked$ = this.recipeService.cookedRecipes$.pipe(
      map(list => list.includes(this.recipe.id))
    );
  }

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
    this.recipeService.markCooked(this.recipe.id);
  }

  get checkboxImage(): string {
    return this.cooked
      ? 'assets/images/checked_checkbox.svg'
      : 'assets/images/unchecked_checkbox.svg';
  }
}
