import { Component } from '@angular/core';
import { RecipeCard } from '../../shared/components/recipe-card/recipe-card';
import { Recipe } from '../../models/recipe.models';
import { RecipeService } from '../../services/recipe-service';
import { CommonModule } from '@angular/common';
import { combineLatest, debounceTime, map, Observable, startWith } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IngredientService } from '../../services/ingredient-service';
import { Ingredient } from '../../models/ingredient.model';

@Component({
  selector: 'app-recipe-finder',
  imports: [RecipeCard, CommonModule, ReactiveFormsModule],
  templateUrl: './recipe-finder.html',
  styleUrl: './recipe-finder.css',
})
export class RecipeFinder {
  
  searchControl = new FormControl('');
  recipeTypeControl = new FormControl<string[]>(['curry', 'salad', 'dessert']);
  ingredientControl = new FormControl<string[]>([]);

  recipes$!: Observable<Recipe[]>;
  filteredRecipes$!: Observable<Recipe[]>;

  ingredients$!: Observable<Ingredient[]>
  filteredIngredients$!: Observable<Ingredient[]>;

  constructor(private recipeService: RecipeService, private ingredientService: IngredientService) {}

  ngOnInit(): void {
    this.recipes$ = this.recipeService.GetRecipes();
    this.ingredients$ = this.ingredientService.GetIngredients();
    
    this.filteredRecipes$ = combineLatest([
      this.recipes$,
      this.searchControl.valueChanges.pipe(startWith(''), debounceTime(100)),
      this.recipeTypeControl.valueChanges.pipe(startWith(this.recipeTypeControl.value ?? [])),
      this.ingredientControl.valueChanges.pipe(startWith(this.ingredientControl.value ?? []))
    ]).pipe(
      map(([recipes, search, recipeTypes, ingredient]) => {

        const searchTerm = (search ?? ``).toLowerCase();

        return recipes.filter(recipe => {

          const matchedSearch = recipe.name.toLowerCase().includes(searchTerm);
          const matchedRecipeType = !recipeTypes?.length || recipeTypes.includes(recipe.type);
          const matchedIngredients = !ingredient?.length || ingredient.every(i => recipe.ingredients.some(j => j.ingredientId === i));

          return matchedSearch && matchedRecipeType && matchedIngredients;
        }
        );
      })
    );
  }

  toggleRecipeType(type: string) {
    const current = this.recipeTypeControl.value ?? [];

    if (current.includes(type)) {
      this.recipeTypeControl.setValue(current.filter(t => t !== type));
    } else {
      this.recipeTypeControl.setValue([...current, type]);
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

  hasIngredient(ingredient: string) {
    return this.ingredientControl.value?.includes(ingredient);
  }

  imageIngredientPath(ingredientId: string): string {
    return `assets/images/ingredients/${ingredientId}.png`
  }
}
