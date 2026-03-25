import { Routes } from '@angular/router';
import { RecipeFinder } from './features/recipe-finder/recipe-finder';
import { IngredientCalculator } from './features/ingredient-calculator/ingredient-calculator';
import { Home } from './features/home/home';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'recipes', component: RecipeFinder },
    { path: 'ingredients', component: IngredientCalculator },
    { path: '**', component: Home }
];
