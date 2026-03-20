import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Recipe } from '../../../models/recipe.models';
import { RecipeService } from '../../../services/recipe-service';
import { Observable } from 'rxjs';

type SortColumn = 'name' | 'baseStrength' | 'cooked';

@Component({
  selector: 'app-recipe-table',
  imports: [],
  templateUrl: './recipe-table.html',
  styleUrl: './recipe-table.css',
})
export class RecipeTable {

  @Input() recipes!: Recipe[];
  @Input() quantities?: { [key: string]: number };
  @Input() canMake?: boolean;
  displayedRecipes: Recipe[] = [];
  
  sortColumn: SortColumn | '' = '';
  sortDirection: 'asc' | 'desc' = 'desc';
  
  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.displayedRecipes = [...this.recipes];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['recipes'] && this.recipes) {
      
      if (this.sortColumn && this.sortColumn) {
        this.displayedRecipes = [...this.recipes];
        this.sort(this.sortColumn, false);
      } else {
        this.displayedRecipes = [...this.recipes];
      }
    }

  }

  sort(column: SortColumn, toggleDirection = true) {

    if (toggleDirection) {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortDirection = 'desc';
      }
    } else {
      this.sortColumn = column;
    }
    

    this.displayedRecipes = [...this.displayedRecipes].sort((a, b) => {
      let valueA: any;
      let valueB: any;

      if (column == 'name') {
        valueA = this.totalIngredients(a);
        valueB = this.totalIngredients(b);
      } else if (column == 'baseStrength') {
        valueA = a.baseStrength;
        valueB = b.baseStrength;
      } else if (column == 'cooked') {
        valueA = this.isCooked(a.id);
        valueB = this.isCooked(b.id);
      }

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;

      return 0;
    });

  }

  imageRecipePath(recipeId: string): string {
    return `assets/images/recipes/${recipeId}.png`
  }

  imageIngredientPath(ingredientId: string): string {
    return `assets/images/ingredients/${ingredientId}.png`
  }

  totalIngredients(recipe: Recipe): number {
    return recipe.ingredients.reduce((total, ingredient) => total + ingredient.amount, 0);
  }

  toggleCooked(recipeId: string) {
    this.recipeService.markCooked(recipeId);
  }

  isCooked(recipeId: string): boolean {
    return this.recipeService.isCooked(recipeId);
  }
}
