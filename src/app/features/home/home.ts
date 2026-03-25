import { Component } from '@angular/core';
import { combineLatest, map, Observable, take, tap } from 'rxjs';
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
  animate = false;
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

      }),
      tap(() => {
        setTimeout(() => {
          this.animate = true;
        }, 0);
      })
    );
  }
  
  ngAfterViewInit() {
    this.stats$.pipe(take(1)).subscribe(stats => {
      setTimeout(() => {
        this.animateCountUp('s-total', stats.total);
        this.animateCountUp('s-cooked', stats.cooked);
        this.animateCountUp('s-remaining', stats.remaining);
        this.animateCountUp('s-pct', stats.completionPercent, '%');

        stats.byType.forEach(type => {
          this.animateCountUp(`type-pct-${type.type}`, type.percent, '%');
        });
      });

    });
  }

  animateCountUp(id: string, target: number, suffix = '', duration = 1100) {
    const el = document.getElementById(id);
    if (!el) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(ease * target) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}
