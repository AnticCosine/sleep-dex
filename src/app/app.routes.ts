import { Routes } from '@angular/router';
import { RecipeFinder } from './features/recipe-finder/recipe-finder';
import { IngredientCalculator } from './features/ingredient-calculator/ingredient-calculator';
import { Home } from './features/home/home';
import { AuthCallback } from './auth/auth-callback/auth-callback';
import { PokemonFinder } from './features/pokemon-finder/pokemon-finder';
import { ShinyFinder } from './features/shiny-finder/shiny-finder';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'recipes', component: RecipeFinder },
    { path: 'ingredients', component: IngredientCalculator },
    { path: 'pokemon', component: PokemonFinder },
    { path: 'shiny', component: ShinyFinder },
    { path: 'auth/callback', component: AuthCallback },
    { path: '**', component: Home }
];
