import { Component } from '@angular/core';
import { combineLatest, map, Observable, take, tap } from 'rxjs';
import { HomeStats, IslandSleepProgress, SleepTypeProgress, TypeProgress } from '../../models/home-stats.model';
import { RecipeService } from '../../services/recipe-service';
import { Recipe } from '../../models/recipe.model';
import { CommonModule } from '@angular/common';
import { RecipeCard } from '../../shared/components/recipe-card/recipe-card';
import { RouterLink } from '@angular/router';
import { IngredientTable } from '../../shared/components/ingredient-table/ingredient-table';
import { PokemonService } from '../../services/pokemon-service';
import { Pokemon } from '../../models/pokemon.model';
import { IdConverterPipe } from '../../pipes/id-converter-pipe';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RecipeCard, IdConverterPipe, IngredientTable , RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  stats$!: Observable<HomeStats>;
  sleepStats$!: Observable<SleepTypeProgress>;
  islandStats$!: Observable<IslandSleepProgress[]>;
  recipes$!: Observable<Recipe[]>;
  pokemon$!: Observable<Pokemon[]>;
  animate = false;
  constructor(private recipeService: RecipeService, private pokemonService: PokemonService) {} 

  ngOnInit(): void {
    this.recipes$ = this.recipeService.getRecipes();
    this.pokemon$ = this.pokemonService.getPokemon();
    

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

    this.sleepStats$ = combineLatest([
      this.pokemon$,
      this.pokemonService.unlockedStyles$
    ]).pipe(
      map(([pokemon, unlocked]) => {

        const total = pokemon.reduce((sum: number, p: Pokemon) => sum + p.number_of_sleep_styles, 0);

        const unlockedCount = Object.values(unlocked).reduce((sum, styles) => sum + styles.length, 0);

        const remaining = total - unlockedCount;

        const completionPercent = total > 0 ? Math.round((unlockedCount / total) * 100) : 0;

        return {
          total,
          unlocked: unlockedCount,
          remaining,
          completionPercent
        };
      }) // combine into one pipe later 
    )


    this.islandStats$ = combineLatest([
      this.pokemonService.getPokemon(),
      this.pokemonService.unlockedStyles$
    ]).pipe(
      map(([pokemon, unlocked]) => {

        const islands = ['greengrass_isle', 'cyan_beach', 'taupe_hollow','snowdrop_tundra', 'lapis_lakeside', 'old_gold_power_plant','amber_canyon', 'greengrass_isle_expert'];
        const sleepTypes = ['snoozing', 'dozing', 'slumbering'];

        const islandResults = islands.map(island => {

          
        
          let total = 0;
          let unlockedCount = 0;
        
          const bySleepType = sleepTypes.map(type => {
          
            const ofType = pokemon.filter(p => p.sleep_type === type);

            let typeTotal = 0;
            let typeUnlocked = 0;
          
            ofType.forEach(p => {
              const stylesOnIsland = this.getStylesOnIsland(p, island);
                    
              const unlockedStyles = unlocked[p.id] ?? [];
                    
              // Count only unlocked styles that exist on this island
              const unlockedOnIsland = unlockedStyles.filter(style =>
                p.availability[`${style}_star`]?.includes(island)
              ).length;
            
              typeTotal += stylesOnIsland;
              typeUnlocked += unlockedOnIsland;
            });

            total += typeTotal;
            unlockedCount += typeUnlocked;

            return {
              sleepType: type,
              total: typeTotal,
              unlocked: typeUnlocked
            };
          });
          
          const percent =
          total > 0 ? Math.round((unlockedCount / total) * 100) : 0;
          
          return {
            island,
            total,
            unlocked: unlockedCount,
            percent,
            bySleepType
          };

        });

        const overallTotal = pokemon.reduce((sum, p) => sum + p.number_of_sleep_styles, 0);

        const overallUnlocked = Object.values(unlocked).reduce((sum, styles) => sum + styles.length, 0);
        
        const overall = {
          island: 'overall',
          total: overallTotal,
          unlocked: overallUnlocked,
          percent: overallTotal > 0
            ? Math.round((overallUnlocked / overallTotal) * 100)
            : 0,
          bySleepType: sleepTypes.map(type => {
          
            const ofType = pokemon.filter(p => p.sleep_type === type);
          
            const total = ofType.reduce(
              (sum, p) => sum + p.number_of_sleep_styles,
              0
            );
          
            const unlockedCount = ofType.reduce((sum, p) => {
              const unlockedStyles = unlocked[p.id] ?? [];
              return sum + unlockedStyles.length;
            }, 0);
          
            return {
              sleepType: type,
              total,
              unlocked: unlockedCount
            };
          })
        };

        overall.percent = overall.total > 0 ? Math.round((overall.unlocked / overall.total) * 100) : 0;

        return [overall, ...islandResults];
      })
    );
      

  }

  private getStylesOnIsland(p: Pokemon, island: string): number {
    return Object.entries(p.availability).reduce((count, [star, islands]) => {
      return islands.includes(island) ? count + 1 : count;
    }, 0);
  }

}
