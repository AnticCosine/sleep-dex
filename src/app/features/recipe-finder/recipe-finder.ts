import { Component } from '@angular/core';
import { RecipeCard } from '../../shared/components/recipe-card/recipe-card';
import { Recipe } from '../../models/recipe.models';
import { RecipeService } from '../../services/recipe-service';
import { CommonModule } from '@angular/common';
import { combineLatest, debounceTime, map, Observable, startWith } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-recipe-finder',
  imports: [RecipeCard, CommonModule, ReactiveFormsModule],
  templateUrl: './recipe-finder.html',
  styleUrl: './recipe-finder.css',
})
export class RecipeFinder {
  
  searchControl = new FormControl('');
  RecipeTypeControl = new FormControl<string[]>(['curry', 'salad', 'dessert']);
  recipes$!: Observable<Recipe[]>;
  filteredRecipes$!: Observable<Recipe[]>;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipes$ = this.recipeService.GetRecipes();
    
    this.filteredRecipes$ = combineLatest([
      this.recipes$,
      this.searchControl.valueChanges.pipe(startWith(''), debounceTime(100)),
      this.RecipeTypeControl.valueChanges.pipe(startWith(this.RecipeTypeControl.value ?? []))
    ]).pipe(
      map(([recipes, search, recipeTypes]) => {

        const searchTerm = (search ?? ``).toLowerCase();

        return recipes.filter(recipe => {

          const matchedSearch = recipe.name.toLowerCase().includes(searchTerm);
          const matchedRecipeType = !recipeTypes?.length || recipeTypes.includes(recipe.type);

          return matchedSearch && matchedRecipeType;
        }
        );
      })
    );
  }

  toggleRecipeType(type: string, checked: boolean) {
    const current = this.RecipeTypeControl.value ?? [];

    if (checked) {
      this.RecipeTypeControl.setValue([...current, type]);
    } else {
      this.RecipeTypeControl.setValue(current.filter(t => t !== type));
    }
  }
}
