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
import { RecipeFilterStateService } from '../../services/recipe-filter-state-service';
import { RecipeFilters } from '../../shared/components/recipe-filters/recipe-filters';

@Component({
  selector: 'app-recipe-finder',
  imports: [RecipeCard, RecipeTable, RecipeFilters ,CommonModule, ReactiveFormsModule],
  templateUrl: './recipe-finder.html',
  styleUrl: './recipe-finder.css',
})
export class RecipeFinder {

  tabularFormat = false;

  constructor(public filterState: RecipeFilterStateService) { }

  ngOnInit(): void {}

  
  changeRecipeFormat() {
    this.tabularFormat = !this.tabularFormat;
  }

  @HostListener('window:resize')
  checkScreen() {
    const isMobile = window.matchMedia('(max-width: 550px)').matches;
    if (isMobile) this.tabularFormat = false;
  }


}
