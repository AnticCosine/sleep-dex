import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ingredient } from '../models/ingredient.model';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Berry } from '../models/berry.model';

const lowThreshold = 20;
export type IngredientStatus = 'ok' | 'low' | 'out';

@Injectable({
  providedIn: 'root',
})
export class IngredientService {
  private storageKey = 'ingredientQuantities';

  private quantities$ = new BehaviorSubject<{ [id: string]: number }>(this.loadFromStorage());
  private readonly jwt_token = 'auth_token';
  private readonly API = environment.apiUrl;

  constructor(private http: HttpClient) {
    if (this.getToken()) {
      this.fetchRemoteIngredients();
    }
  }

  private async fetchRemoteIngredients(): Promise<void> {
    try {
      const remote = await firstValueFrom(
        this.http.get<{ ingredientId: string; quantity: number }[]>(`${this.API}/user/ingredients`)
      );
      const mapped = remote.reduce((acc, { ingredientId, quantity }) => {
        acc[ingredientId] = quantity;
        return acc;
      }, {} as { [id: string]: number });
      this.updateState(mapped);
    } catch (err) {
      console.error('Failed to fetch remote recipes:', err);
    }
  }

  GetIngredients() {
    return this.http.get<Ingredient[]>('assets/data/ingredients.json');
  }

  GetBerries() {
    return this.http.get<Berry[]>('assets/data/berries.json');
  }

  getQuantities$(): Observable<{ [id: string]: number }> {
    return this.quantities$.asObservable();
  }
 
  getQuantity(id: string): number {
    return this.quantities$.value[id] ?? 0;
  }
 
  async setQuantity(id: string, qty: number): Promise<void> {
    const clamped = Math.max(0, qty);
    this.updateState({ ...this.quantities$.value, [id]: clamped });

    if (this.getToken()) {
      try {
        await firstValueFrom(
          this.http.post(`${this.API}/user/ingredients`, {
            ingredientId: id,
            quantity: clamped,
          })
        );
        // await this.fetchRemoteIngredients();
      } catch (err) {
        console.error('Failed to sync ingredient:', err);
      }
    }
  }


  async setQuantities(updates: { id: string; quantity: number }[]): Promise<void> {
    const current = { ...this.quantities$.value };
 
    for (const { id, quantity } of updates) {
      current[id] = Math.max(0, quantity);
    }
 
    this.updateState(current);

    if (this.getToken()) {
      try {
        const payload = Object.entries(current).map(([ingredientId, quantity]) => ({
          ingredientId,
          quantity,
        }));

        await firstValueFrom(
          this.http.put(`${this.API}/user/ingredients`, { ingredients: payload })
        );

        // await this.fetchRemoteIngredients();
      } catch (err) {
        console.error('Failed to batch sync ingredients:', err);
      }
    }
  }

  private updateState(quantities: { [id: string]: number }): void {
    localStorage.setItem(this.storageKey, JSON.stringify(quantities));
    this.quantities$.next(quantities);
  }

  syncFromRemote(quantities: { [id: string]: number }): void {
    this.updateState(quantities);
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

  async clearAllQuantities(): Promise<void> {
    localStorage.removeItem(this.storageKey);
    this.quantities$.next({});

    if (this.getToken()) {
        try {
          await firstValueFrom(
            this.http.put(`${this.API}/user/ingredients`, { ingredients: [] })
          );
        } catch (err) {
          console.error('Failed to clear ingredients in DB:', err);
        }
    }
  }

  private getToken(): string | null {
    return localStorage.getItem(this.jwt_token);
  }

}
