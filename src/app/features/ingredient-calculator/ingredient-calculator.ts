import { Component } from '@angular/core';
import { RecipeService } from '../../services/recipe-service';
import { IngredientService } from '../../services/ingredient-service';
import { BehaviorSubject, combineLatest, map, Observable, take } from 'rxjs';
import { Ingredient } from '../../models/ingredient.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Recipe, RecipeIngredients } from '../../models/recipe.models';
import { RecipeCard } from '../../shared/components/recipe-card/recipe-card';

@Component({
  selector: 'app-ingredient-calculator',
  imports: [RecipeCard, CommonModule, FormsModule],
  templateUrl: './ingredient-calculator.html',
  styleUrl: './ingredient-calculator.css',
})
export class IngredientCalculator {

  recipes$!: Observable<Recipe[]>;
  ingredients$!: Observable<Ingredient[]>;

  cookableRecipes$!: Observable<{ recipe: Recipe, canMake: boolean, quantities: any}[]>;

  quantities$ = new BehaviorSubject<{ [key: string]: number }>({});

  constructor(private recipeService: RecipeService, private ingredientService: IngredientService) {
    
  }

  ngOnInit(): void {
    this.ingredients$ = this.ingredientService.GetIngredients();
    this.recipes$ = this.recipeService.getRecipes();

    this.ingredients$.pipe(take(1)).subscribe(ingredients => {
      const initial: { [key: string]: number } = {};
      ingredients.forEach(i => initial[i.id] = 0);
      this.quantities$.next(initial);
    });

    this.cookableRecipes$ = combineLatest([
      this.recipes$,
      this.quantities$
    ]).pipe(
      map(([recipes, quantities]) => {
        
        const mapped = recipes.map(recipe => {
          const canMake = recipe.ingredients.every(req =>
            (quantities[req.ingredientId] || 0) >= req.amount
          );

          return {recipe, canMake, quantities}
        })

        return mapped.sort((a,b) => {
          if (a.canMake && !b.canMake) return -1;
          if (!a.canMake && b.canMake) return 1;
          return 0;
        })
      })
    );
  }

  increase(ingredientId: string) {
    const q = { ...this.quantities$.value };
    q[ingredientId]++;
    this.quantities$.next(q);
  }

  decrease(ingredientId: string) {
    const q = { ...this.quantities$.value };
    if (q[ingredientId] > 0) {
      q[ingredientId]--;
      this.quantities$.next(q);
    }
  }

  updateQuantity(id: string, value: number) {
    const q = { ...this.quantities$.value };
    q[id] = Math.max(0, value || 0);
    this.quantities$.next(q);
  }

  imageIngredientPath(ingredientId: string): string {
    return `assets/images/ingredients/${ingredientId}.png`;
  }
} 
