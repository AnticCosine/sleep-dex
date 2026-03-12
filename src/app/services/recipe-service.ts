import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe.models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  
  constructor(private http: HttpClient) {}

  GetRecipes() {
    return this.http.get<Recipe[]>('assets/data/recipe.json');
  }
}
