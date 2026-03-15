import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ingredient } from '../models/ingredient.model';

@Injectable({
  providedIn: 'root',
})
export class IngredientService {

  constructor(private http: HttpClient) {}

  GetIngredients() {
    return this.http.get<Ingredient[]>('assets/data/ingredients.json');
  }

}
