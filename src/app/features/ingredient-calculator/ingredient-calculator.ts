import { Component, HostListener } from '@angular/core';
import { RecipeService } from '../../services/recipe-service';
import { IngredientService } from '../../services/ingredient-service';
import { BehaviorSubject, combineLatest, map, Observable, take } from 'rxjs';
import { Ingredient } from '../../models/ingredient.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Recipe, RecipeIngredients } from '../../models/recipe.models';
import { RecipeCard } from '../../shared/components/recipe-card/recipe-card';
import { IngredientTable } from '../../shared/components/ingredient-table/ingredient-table';
import { RecipeFilters } from '../../shared/components/recipe-filters/recipe-filters';
import { RecipeFilterStateService } from '../../services/recipe-filter-state-service';
import { RecipeTable } from '../../shared/components/recipe-table/recipe-table';

@Component({
  selector: 'app-ingredient-calculator',
  imports: [RecipeCard, IngredientTable, RecipeTable, RecipeFilters , CommonModule, FormsModule],
  templateUrl: './ingredient-calculator.html',
  styleUrl: './ingredient-calculator.css',
})
export class IngredientCalculator {

  tabularFormat = false;

  cookableRecipes$!: Observable<{ recipe: Recipe, canMake: boolean, quantities: any}[]>;

  quantities$!: Observable<{[id: string]: number;}>;

  ingredients$!: Observable<Ingredient[]>;
  constructor(private ingredientService: IngredientService, public filterState: RecipeFilterStateService) {
    
  }

  ngOnInit(): void {
    this.quantities$ = this.ingredientService.getQuantities$();

    this.cookableRecipes$ = combineLatest([
      this.filterState.filteredIngredientRecipes$,
      this.quantities$
    ]).pipe(
      map(([recipes, quantities]) => {
        
        const mapped = recipes.map((recipe, idx) => {
          const canMake = recipe.ingredients.every(req =>
            (quantities[req.ingredientId] || 0) >= req.amount
          );

          return {recipe, canMake, quantities, idx }
        })

        return mapped.sort((a,b) => {
          if (a.canMake && !b.canMake) return -1;
          if (!a.canMake && b.canMake) return 1;
          return b.recipe.baseStrength - a.recipe.baseStrength; // return 0; to keep original order 
        })
      })
    );
  }

  toRecipes(items: { recipe: Recipe, canMake: boolean, quantities: any }[]): Recipe[] {
    return items.map(item => item.recipe);
  }

  imageIngredientPath(ingredientId: string): string {
    return `assets/images/ingredients/${ingredientId}.png`;
  }

  changeRecipeFormat() {
    this.tabularFormat = !this.tabularFormat;
  }

  @HostListener('window:resize')
  checkScreen() {
    const isMobile = window.matchMedia('(max-width: 550px)').matches;
    if (isMobile) this.tabularFormat = false;
  }
} 
