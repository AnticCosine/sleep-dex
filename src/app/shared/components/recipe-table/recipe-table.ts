import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Recipe } from '../../../models/recipe.model';
import { RecipeService } from '../../../services/recipe-service';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

type SortColumn = 'name' | 'baseStrength' | 'cooked';

@Component({
  selector: 'app-recipe-table',
  imports: [CommonModule],
  templateUrl: './recipe-table.html',
  styleUrl: './recipe-table.css',
})
export class RecipeTable {

  @Input() recipes!: Recipe[];
  @Input() quantities?: { [key: string]: number };
  displayedRecipes: Recipe[] = [];
  
  sortColumn: SortColumn | '' = '';
  sortDirection: 'asc' | 'desc' = 'desc';

  cooked$!: Observable<Set<string>>;
  
  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.displayedRecipes = [...this.recipes];

    this.cooked$ = this.recipeService.cookedRecipes$.pipe(
      map(list => new Set(list))
    );
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

  canMakeRecipe(recipe: Recipe): boolean {
    if (!this.quantities) return false;
    return recipe.ingredients.every(req =>
      (this.quantities![req.ingredientId] || 0) >= req.amount
    );
  }
 
  quantityOf(ingredientId: string): number {
    return this.quantities?.[ingredientId] ?? 0;
  }

  checkboxImage(cooked: boolean): string {
    return cooked
      ? 'assets/images/checked_checkbox.svg'
      : 'assets/images/unchecked_checkbox.svg';
  }
 
}
