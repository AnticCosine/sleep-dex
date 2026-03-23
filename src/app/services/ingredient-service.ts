import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ingredient } from '../models/ingredient.model';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const lowThreshold = 20;
export type IngredientStatus = 'ok' | 'low' | 'out';

@Injectable({
  providedIn: 'root',
})
export class IngredientService {
  private storageKey = 'ingredientQuantities';
  private readonly jwt_token = 'auth_token';

  private quantities$ = new BehaviorSubject<{ [id: string]: number }>(this.loadFromStorage());

  private readonly API = environment.apiUrl;

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
 
  async setQuantity(id: string, qty: number): Promise<void> {
    const clamped = Math.max(0, qty);
    const updated = { ...this.quantities$.value, [id]: clamped };
    this.quantities$.next(updated);
    this.saveToStorage(updated);

    if (this.getToken()) {
      try {
        await firstValueFrom(
          this.http.post(`${this.API}/user/ingredients`, {
            ingredientId: id,
            quantity: clamped,
          })
        );
      } catch (err) {
        console.error('Failed to sync ingredient:', err);
      }
    }
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

  saveToStorage(quantities: { [id: string]: number }): void {
    localStorage.setItem(this.storageKey, JSON.stringify(quantities));
    this.quantities$.next(quantities);
  }

  clearAllQuantities(): void {
    localStorage.removeItem(this.storageKey);
    this.quantities$.next({});
  }

  private getToken(): string | null {
    return localStorage.getItem(this.jwt_token);
  }

}
