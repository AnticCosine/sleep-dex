import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe.models';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {

  private storageKey = 'cookedRecipes';

  private cookedRecipesSubject = new BehaviorSubject<string[]>(this.loadRecipes());
  cookedRecipes$ = this.cookedRecipesSubject.asObservable();

  
  constructor(private http: HttpClient) {}

  getRecipes() {
    return this.http.get<Recipe[]>('assets/data/recipe.json');
  }

  loadRecipes(): string[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  saveRecipe(recipes: string[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(recipes));
    this.cookedRecipesSubject.next(recipes);
  }

  isCooked(recipeId: string): boolean {
    return this.cookedRecipesSubject.value.includes(recipeId);
  }

  markCooked(recipeId: string): void {
    const current = this.cookedRecipesSubject.value;

    if (current.includes(recipeId)) {
      this.saveRecipe(current.filter(r => r !== recipeId));
    } else {
      this.saveRecipe([...current, recipeId]);
    }
  }

}
