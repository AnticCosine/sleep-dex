import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ingredient } from '../models/ingredient.model';
import { BehaviorSubject, Observable } from 'rxjs';

const lowThreshold = 3;
export type IngredientStatus = 'ok' | 'low' | 'out';

@Injectable({
  providedIn: 'root',
})
export class IngredientService {
  private storageKey = 'ingredientQuantities';

  private quantities$ = new BehaviorSubject<{ [id: string]: number }>(this.loadFromStorage());

  constructor(private http: HttpClient) {}

  GetIngredients() {
    return this.http.get<Ingredient[]>('assets/data/ingredients.json');
  }

  getQuantities$(): Observable<{ [id: string]: number }> {
    return this.quantities$.asObservable();
  }
 
  getQuantity(id: string): number {
    return this.quantities$.value[id] ?? 0;
  }
 
  setQuantity(id: string, qty: number): void {
    const clamped = Math.max(0, qty);
    const updated = { ...this.quantities$.value, [id]: clamped };
    this.quantities$.next(updated);
    this.saveToStorage(updated);
  }
 
  getStatus(id: string): IngredientStatus {
    const qty = this.getQuantity(id);
    if (qty <= 0) return 'out';
    if (qty <= lowThreshold) return 'low';
    return 'ok';
  }

  loadFromStorage(): { [id: string]: number } {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : {};
  }

  private saveToStorage(quantities: { [id: string]: number }): void {
    localStorage.setItem(this.storageKey, JSON.stringify(quantities));
    this.quantities$.next(quantities);
  }

}
