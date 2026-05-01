import { Component, Input } from '@angular/core';
import { Recipe } from '../../../models/recipe.model';
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
  @Input() quantities?: { [key: string]: number };
  @Input() canMake?: boolean;
  @Input() homePlaceHolder?: boolean = false; // placeholder to showcase card on homepage 
  @Input() recipePlaceHolder?: boolean = false;
  cooked = false;

  cooked$!: Observable<boolean>;

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.cooked = this.recipeService.isCooked(this.recipe.id);

    this.cooked$ = this.recipeService.cookedRecipes$.pipe(
      map(list => list.includes(this.recipe.id))
    );
  }

  get craftableCount(): number {
    if (!this.quantities || !this.recipe.ingredients.length) return 0;
    return Math.min(
      ...this.recipe.ingredients.map(ing =>
        Math.floor((this.quantities![ing.ingredientId] || 0) / ing.amount)
      )
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
}
