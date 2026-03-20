import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, debounceTime, map, Observable, startWith, take } from 'rxjs';
import { Ingredient } from '../models/ingredient.model';
import { Recipe } from '../models/recipe.models';
import { IngredientService } from './ingredient-service';
import { RecipeService } from './recipe-service';
import { RecipeFilterService } from './recipe-filter-service';

@Injectable({
  providedIn: 'root',
})
export class RecipeFilterStateService {

  searchControl = new FormControl('');
  recipeTypeControl = new FormControl<string[]>([]);
  ingredientControl = new FormControl<string[]>([]);
  minIngredientsControl = new FormControl<number | null>(null);
  maxIngredientsControl = new FormControl<number | null>(null);
  cookedRecipeControl = new FormControl<string[]>([]);

  minIngredients = 0;
  maxIngredients = 0;

  ingredients$: Observable<Ingredient[]>;
  filteredRecipes$: Observable<Recipe[]>;

  constructor(
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private recipeFilterService: RecipeFilterService
  ) {
    this.ingredients$ = this.ingredientService.GetIngredients();

    const recipes$ = this.recipeService.getRecipes();

    recipes$.pipe(take(1)).subscribe(recipes => {
      const counts = recipes.map(r =>
        r.ingredients.reduce((total, i) => total + i.amount, 0)
      );
      this.minIngredients = Math.min(...counts);
      this.maxIngredients = Math.max(...counts);
      this.minIngredientsControl.setValue(this.minIngredients);
      this.maxIngredientsControl.setValue(this.maxIngredients);
    });

    this.filteredRecipes$ = combineLatest([
      recipes$,
      this.searchControl.valueChanges.pipe(startWith(''), debounceTime(100)),
      this.recipeTypeControl.valueChanges.pipe(startWith([])),
      this.ingredientControl.valueChanges.pipe(startWith([])),
      this.minIngredientsControl.valueChanges.pipe(startWith(null)),
      this.maxIngredientsControl.valueChanges.pipe(startWith(null)),
      this.cookedRecipeControl.valueChanges.pipe(startWith([])),
      this.recipeService.cookedRecipes$
    ]).pipe(
      map(([recipes, search, recipeTypes, ingredient, minIngredients, maxIngredients, cooked, cookedFilter]) =>
        this.recipeFilterService.filterRecipes(recipes, {
          search, recipeTypes, ingredient, minIngredients, maxIngredients, cooked, cookedFilter
        })
      )
    );
  }

  toggleRecipeType(type: string) {
    this.toggle(this.recipeTypeControl, type);
  }

  toggleCookedRecipeType(type: string) {
    this.toggle(this.cookedRecipeControl, type);
  }

  toggleIngredient(id: string) {
    this.toggle(this.ingredientControl, id);
  }

  hasIngredient(id: string): boolean {
    return this.ingredientControl.value?.includes(id) ?? false;
  }

  resetFilters() {
    this.searchControl.setValue('');
    this.recipeTypeControl.setValue([]);
    this.ingredientControl.setValue([]);
    this.minIngredientsControl.setValue(this.minIngredients);
    this.maxIngredientsControl.setValue(this.maxIngredients);
    this.cookedRecipeControl.setValue([]);
  }

  imageIngredientPath(ingredientId: string): string {
    return `assets/images/ingredients/${ingredientId}.png`;
  }

  private toggle(control: FormControl<string[] | null>, value: string) {
    const current = control.value ?? [];
    control.setValue(
      current.includes(value) ? current.filter(v => v !== value) : [...current, value]
    );
  }
}
