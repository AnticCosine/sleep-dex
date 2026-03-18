import { Routes } from '@angular/router';
import { RecipeFinder } from './features/recipe-finder/recipe-finder';
import { IngredientCalculator } from './features/ingredient-calculator/ingredient-calculator';

export const routes: Routes = [
    { path: 'recipes', component: RecipeFinder },
    { path: 'ingredients', component: IngredientCalculator }
];
