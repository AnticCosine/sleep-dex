import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, debounceTime, map, Observable, ReplaySubject, startWith, take } from 'rxjs';
import { Ingredient } from '../models/ingredient.model';
import { Recipe } from '../models/recipe.model';
import { IngredientService } from './ingredient-service';
import { RecipeService } from './recipe-service';
import { RecipeFilterService } from './recipe-filter-service';

interface PersistedFilters {
  search: string;
  recipeTypes: string[];
  ingredients: string[];
  cooked: string[];
  minIngredients: number | null;
  maxIngredients: number | null;
}

interface PersistedPotFilters {
  potSize: number | null;
  sundayBonus: boolean;
  magneZoneLvl: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class RecipeFilterStateService {

  private storageKey = 'recipeFilters';
  private potStorageKey = 'ingredientCalculatorFilters';

  searchControl = new FormControl('');
  recipeTypeControl = new FormControl<string[]>([]);
  ingredientControl = new FormControl<string[]>([]);
  minIngredientsControl = new FormControl<number | null>(null);
  maxIngredientsControl = new FormControl<number | null>(null);
  cookedRecipeControl = new FormControl<string[]>([]);

  potIngredientControl = new FormControl<number | null>(null);

  minIngredients = 0;
  maxIngredients = 0;

  ingredients$: Observable<Ingredient[]>;
  filteredRecipes$: Observable<Recipe[]>;
  filteredIngredientRecipes$: Observable<Recipe[]>;

  magnezoneBonus = new FormControl<number | null>(0);
  sundayBonusActive = new FormControl<boolean | null>(false);

  constructor(
  private recipeService: RecipeService,
  private ingredientService: IngredientService,
  private recipeFilterService: RecipeFilterService
  ) {
    this.ingredients$ = this.ingredientService.GetIngredients();
    const recipes$ = this.recipeService.getRecipes();
    const filteredRecipes = new ReplaySubject<Recipe[]>(1);
    const filteredIngredientRecipes = new ReplaySubject<Recipe[]>(1);

    recipes$.pipe(take(1)).subscribe(recipes => {
      const counts = recipes.map(r =>
        r.ingredients.reduce((total, i) => total + i.amount, 0)
      );
      this.minIngredients = Math.min(...counts);
      this.maxIngredients = Math.max(...counts);

      const potFilters = this.loadPotFilter();
      this.potIngredientControl.setValue(potFilters?.potSize ?? this.maxIngredients);

      const saved = this.loadFilters();
      if (saved) {
        this.searchControl.setValue(saved.search ?? '');
        this.recipeTypeControl.setValue(saved.recipeTypes ?? []);
        this.ingredientControl.setValue(saved.ingredients ?? []);
        this.cookedRecipeControl.setValue(saved.cooked ?? []);
        this.minIngredientsControl.setValue(saved.minIngredients ?? this.minIngredients);
        this.maxIngredientsControl.setValue(saved.maxIngredients ?? this.maxIngredients);
      } else {
        this.minIngredientsControl.setValue(this.minIngredients);
        this.maxIngredientsControl.setValue(this.maxIngredients);
      }

      combineLatest([
        recipes$,
        this.searchControl.valueChanges.pipe(startWith(this.searchControl.value), debounceTime(100)),
        this.recipeTypeControl.valueChanges.pipe(startWith(this.recipeTypeControl.value)),
        this.ingredientControl.valueChanges.pipe(startWith(this.ingredientControl.value)),
        this.minIngredientsControl.valueChanges.pipe(startWith(this.minIngredientsControl.value)),
        this.maxIngredientsControl.valueChanges.pipe(startWith(this.maxIngredientsControl.value)),
        this.cookedRecipeControl.valueChanges.pipe(startWith(this.cookedRecipeControl.value)),
        this.recipeService.cookedRecipes$
      ]).pipe(
        map(([recipes, search, recipeTypes, ingredient, minIngredients, maxIngredients, cooked, cookedFilter]) =>
          this.recipeFilterService.filterRecipes(recipes, {
            search, recipeTypes, ingredient, minIngredients, maxIngredients, cooked, cookedFilter
          })
        )
      ).subscribe(filtered => filteredRecipes.next(filtered));

      combineLatest([
        recipes$,
        this.searchControl.valueChanges.pipe(startWith(this.searchControl.value), debounceTime(100)),
        this.recipeTypeControl.valueChanges.pipe(startWith(this.recipeTypeControl.value)),
        this.ingredientControl.valueChanges.pipe(startWith(this.ingredientControl.value)),
        this.cookedRecipeControl.valueChanges.pipe(startWith(this.cookedRecipeControl.value)),
        this.recipeService.cookedRecipes$,
        this.potIngredientControl.valueChanges.pipe(startWith(this.potIngredientControl.value)),
        this.sundayBonusActive.valueChanges.pipe(startWith(this.sundayBonusActive.value)),
        this.magnezoneBonus.valueChanges.pipe(startWith(this.magnezoneBonus.value))
      ]).pipe(
        map(([recipes, search, recipeTypes, ingredient, cooked, cookedFilter, potSize, sundayBonus, magneZoneBonus]) =>
          this.recipeFilterService.filterRecipes(recipes, {
            search, recipeTypes, ingredient, cooked, cookedFilter, potSize, sundayBonus, magneZoneBonus
          })
        )
      ).subscribe(filtered => filteredIngredientRecipes.next(filtered));

      this.persistOnChange();
    });

    this.filteredRecipes$ = filteredRecipes.asObservable();
    this.filteredIngredientRecipes$ = filteredIngredientRecipes.asObservable();
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
    this.magnezoneBonus.setValue(0);
    localStorage.removeItem(this.storageKey);
    //localStorage.removeItem(this.potStorageKey);
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


  private loadFilters(): PersistedFilters | null {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }

  private saveFilters(): void {
    const state: PersistedFilters = {
      search: this.searchControl.value ?? '',
      recipeTypes: this.recipeTypeControl.value ?? [],
      ingredients: this.ingredientControl.value ?? [],
      cooked: this.cookedRecipeControl.value ?? [],
      minIngredients: this.minIngredientsControl.value,
      maxIngredients: this.maxIngredientsControl.value,
    };
    localStorage.setItem(this.storageKey, JSON.stringify(state));
  }

  private loadPotFilter(): PersistedPotFilters | null {
    try {
      const raw = localStorage.getItem(this.potStorageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      localStorage.removeItem(this.potStorageKey);
      return null;
    }
  }

  private savePotFilter(magLvl?: number): void {
    const existing = this.loadPotFilter();
    const state: PersistedPotFilters = {
      potSize: this.potIngredientControl.value ?? existing?.potSize ?? null,
      sundayBonus: this.sundayBonusActive.value ?? false,
      magneZoneLvl: magLvl ?? existing?.magneZoneLvl ?? 1
    };

    localStorage.setItem(this.potStorageKey, JSON.stringify(state));

  }

  applyMagnezoneBonus(bonus: number, level: number) {
    this.magnezoneBonus.setValue(bonus);
    this.savePotFilter(level);
  }

  applySundayBonus(active: boolean) {
    this.sundayBonusActive.setValue(active);
    this.savePotFilter();
  }

  getMagnezoneState(): { level: number } {
    const saved = this.loadPotFilter();
    return {
      level: saved?.magneZoneLvl ?? 1
    };
  }


  private persistOnChange(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(400))
      .subscribe(() => this.saveFilters());

    this.potIngredientControl.valueChanges
      .pipe(debounceTime(400))
      .subscribe(() => this.savePotFilter());

    const controls: FormControl[] = [
      this.recipeTypeControl,
      this.ingredientControl,
      this.cookedRecipeControl,
      this.minIngredientsControl,
      this.maxIngredientsControl,
    ];

    controls.forEach(control =>
      control.valueChanges.subscribe(() => this.saveFilters())
    );
  }
}
