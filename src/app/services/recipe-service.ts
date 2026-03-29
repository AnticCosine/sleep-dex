import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe.models';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {

  private storageKey = 'cookedRecipes';
  private readonly jwt_token = 'auth_token';

  private readonly API = environment.apiUrl;

  private cookedRecipesSubject = new BehaviorSubject<string[]>(this.loadRecipes());
  cookedRecipes$ = this.cookedRecipesSubject.asObservable();

  
  constructor(private http: HttpClient) {
    if (this.getToken()) {
      this.fetchRemoteRecipes();
    }
  }

  private async fetchRemoteRecipes(): Promise<void> {
    try {
      const remote = await firstValueFrom(
        this.http.get<string[]>(`${this.API}/user/recipes`)
      );
      this.saveRecipe(remote);
    } catch (err) {
      console.error('Failed to fetch remote recipes:', err);
    }
  }

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

  async markCooked(recipeId: string): Promise<void> {
    const current = this.cookedRecipesSubject.value;

    if (current.includes(recipeId)) {
      this.saveRecipe(current.filter(r => r !== recipeId));
    } else {
      this.saveRecipe([...current, recipeId]);
    }

    if (this.getToken()) {
      try {
        const remote = await firstValueFrom(
          this.http.post<string[]>(`${this.API}/user/recipes`, { recipeId })
        );
        // await this.fetchRemoteRecipes();
      } catch (err) {
        console.error('Failed to sync recipe:', err);
      }
    }
  }

  private getToken(): string | null {
    return localStorage.getItem(this.jwt_token);
  }

}
