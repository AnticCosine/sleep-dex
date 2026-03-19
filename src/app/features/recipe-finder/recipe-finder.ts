import { Component, HostListener } from '@angular/core';
import { RecipeCard } from '../../shared/components/recipe-card/recipe-card';
import { Recipe } from '../../models/recipe.models';
import { RecipeService } from '../../services/recipe-service';
import { CommonModule } from '@angular/common';
import { combineLatest, debounceTime, map, Observable, startWith, take } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IngredientService } from '../../services/ingredient-service';
import { Ingredient } from '../../models/ingredient.model';
import { RecipeTable } from '../../shared/components/recipe-table/recipe-table';
import { RecipeFilterService } from '../../services/recipe-filter-service';

@Component({
  selector: 'app-recipe-finder',
  imports: [RecipeCard, RecipeTable,CommonModule, ReactiveFormsModule],
  templateUrl: './recipe-finder.html',
  styleUrl: './recipe-finder.css',
})
export class RecipeFinder {

  tabularFormat = false;
  
  searchControl = new FormControl('');
  recipeTypeControl = new FormControl<string[]>([]);
  ingredientControl = new FormControl<string[]>([]);
  minIngredientsControl = new FormControl<number | null>(null);
  maxIngredientsControl = new FormControl<number | null>(null);
  cookedRecipeControl = new FormControl<string[]>([]);

  recipes$!: Observable<Recipe[]>;
  filteredRecipes$!: Observable<Recipe[]>;

  ingredients$!: Observable<Ingredient[]>
  filteredIngredients$!: Observable<Ingredient[]>;

  cookedRecipes$!: Observable<string[]>;
  filteredCookedRecipes$!: Observable<String[]>;

  minIngredients = 0;
  maxIngredients = 0;

  constructor(private recipeService: RecipeService, private ingredientService: IngredientService, private recipeFilterService: RecipeFilterService) {
  
  }

  ngOnInit(): void {
    this.recipes$ = this.recipeService.getRecipes();
    this.ingredients$ = this.ingredientService.GetIngredients();
    this.cookedRecipes$ = this.recipeService.cookedRecipes$;

    this.recipes$.pipe(take(1)).subscribe(recipes => {
      const count = recipes.map(recipe => {
        return recipe.ingredients.reduce((total, ingredient) => total + ingredient.amount, 0);
      });
      this.minIngredients = Math.min(...count);
      this.maxIngredients = Math.max(...count);

      this.minIngredientsControl.setValue(this.minIngredients);
      this.maxIngredientsControl.setValue(this.maxIngredients);
    })
    
    this.filteredRecipes$ = combineLatest([
      this.recipes$,
      this.searchControl.valueChanges.pipe(startWith(''), debounceTime(100)),
      this.recipeTypeControl.valueChanges.pipe(startWith(this.recipeTypeControl.value ?? [])),
      this.ingredientControl.valueChanges.pipe(startWith(this.ingredientControl.value ?? [])),
      this.minIngredientsControl.valueChanges.pipe(startWith(null)),
      this.maxIngredientsControl.valueChanges.pipe(startWith(null)),
      this.cookedRecipeControl.valueChanges.pipe(startWith(this.cookedRecipeControl.value ?? [])),
      this.cookedRecipes$
    ]).pipe(
      map(([recipes, search, recipeTypes, ingredient, minIngredients, maxIngredients, cooked, cookedFilter]) =>
        this.recipeFilterService.filterRecipes(recipes, {
          search,
          recipeTypes,
          ingredient,
          minIngredients,
          maxIngredients,
          cooked,
          cookedFilter
        })
      )
    )
    
  }

  toggleRecipeType(type: string) {
    const current = this.recipeTypeControl.value ?? [];

    if (current.includes(type)) {
      this.recipeTypeControl.setValue(current.filter(t => t !== type));
    } else {
      this.recipeTypeControl.setValue([...current, type]);
    }
  }

  toggleCookedRecipeType(type: string) {
    const current = this.cookedRecipeControl.value ?? [];

    if (current.includes(type)) {
      this.cookedRecipeControl.setValue(current.filter(t => t !== type));
    } else {
      this.cookedRecipeControl.setValue([...current, type]);
    }
  }

  toggleIngredient(ingredient: string) {
    const current = this.ingredientControl.value ?? [];

    if (current.includes(ingredient)) {
      this.ingredientControl.setValue(current.filter(i => i !== ingredient));
    } else {
      this.ingredientControl.setValue([...current, ingredient]);
    }
  }

  resetFilters() {
    this.searchControl.setValue('');
    this.recipeTypeControl.setValue([]);
    this.ingredientControl.setValue([]);
    this.minIngredientsControl.setValue(this.minIngredients);
    this.maxIngredientsControl.setValue(this.maxIngredients);
    this.cookedRecipeControl.setValue([]);
  }

  changeRecipeFormat() {
    this.tabularFormat = !this.tabularFormat;
  }

  hasIngredient(ingredient: string) {
    return this.ingredientControl.value?.includes(ingredient);
  }

  imageIngredientPath(ingredientId: string): string {
    return `assets/images/ingredients/${ingredientId}.png`
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const dropdowns = document.querySelectorAll('details.dropdown');
    dropdowns.forEach(dropdown => {
      if (!dropdown.contains(event.target as Node)) {
        dropdown.removeAttribute('open');
      }
    });
  }

  onDropdownToggle(event: Event): void {
    const clicked = event.target as HTMLElement;
    const thisDropdown = clicked.closest('details.dropdown');
    const dropdowns = document.querySelectorAll('details.dropdown');
    dropdowns.forEach(dropdown => {
      if (dropdown !== thisDropdown) {
        dropdown.removeAttribute('open');
      }
    });
  }
}
