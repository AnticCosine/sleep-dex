import { Component } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { HomeStats, TypeProgress } from '../../models/home-stats.model';
import { RecipeService } from '../../services/recipe-service';
import { Recipe } from '../../models/recipe.models';
import { CommonModule } from '@angular/common';
import { RecipeCard } from '../../shared/components/recipe-card/recipe-card';
import { RouterLink } from '@angular/router';
import { IngredientTable } from '../../shared/components/ingredient-table/ingredient-table';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RecipeCard, IngredientTable , RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  stats$!: Observable<HomeStats>;
  recipes$!: Observable<Recipe[]>;

  constructor(private recipeService: RecipeService) {} 

  ngOnInit(): void {
    this.recipes$ = this.recipeService.getRecipes();

    this.stats$ = combineLatest([
      this.recipes$,
      this.recipeService.cookedRecipes$
    ]).pipe(
      map(([recipes, cookedIds]) => {

        const total = recipes.length;
        const cooked = cookedIds.length;
        const remaining = total - cooked;
        const completionPercent = total > 0 ? Math.round((cooked/total) * 100) : 0;

        const types = ['curry', 'salad', 'dessert'];

        const byType: TypeProgress[] = types.map(type => {
          const ofType = recipes.filter((r: Recipe) => r.type === type);
          const cookedOfType = ofType.filter((r: Recipe) => cookedIds.includes(r.id));
          const total = ofType.length;
          const cookedCount = cookedOfType.length;
          return {
            type,
            cooked: cookedCount,
            total,
            percent: total > 0 ? Math.round((cookedCount / total) * 100) : 0
          };
        });
        
        return { total, cooked, remaining, completionPercent, byType }

      })
    )
  }
}
