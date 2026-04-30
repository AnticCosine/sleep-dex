import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pokemon, PokemonTypes } from '../models/pokemon.model';
import { environment } from '../../environments/environment';
import { BehaviorSubject, firstValueFrom, map, Observable } from 'rxjs';

type UnlockedStyles = { [pokemonId: string]: number[] };

@Injectable({
  providedIn: 'root',
})
export class PokemonService {

  private readonly storageKey = 'unlockedStyles';
  private readonly jwt_token = 'auth_token';

  private readonly API = environment.apiUrl;

  private unlockedStylesSubject = new BehaviorSubject<UnlockedStyles>(this.loadStyles());
  unlockedStyles$ = this.unlockedStylesSubject.asObservable();

  constructor(private http: HttpClient) {
    if (this.getToken()) {
      this.fetchRemoteStyles();
    }
  }

  private async fetchRemoteStyles(): Promise<void> {
    try {
      const token = this.getToken();
      const headers = { Authorization: `Bearer ${token}` };

      const remote = await firstValueFrom(
        this.http.get<UnlockedStyles>(`${this.API}/user/pokemon/styles`, { headers })
      );

      if (remote && Object.keys(remote).length > 0) {
        this.persistStyles(remote);
      }

    } catch (err) {
      console.error('Failed to fetch remote styles:', err);
    }
  }

  private async pushStylesToRemote(styles: UnlockedStyles): Promise<void> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    await firstValueFrom(
      this.http.put(`${this.API}/user/pokemon/styles`, { styles }, { headers })
    );
  }

  public syncFromRemote(styles: UnlockedStyles): void {
    this.persistStyles(styles);
  }

  getPokemon() {
    return this.http.get<Pokemon[]>('assets/data/pokemon.json');
  }

  GetPokemonTypes() {
    return this.http.get<PokemonTypes[]>('assets/data/pokemon-types.json');
  }

  getUnlockedStyles$(pokemonId: string): Observable<number[]> {
    return this.unlockedStyles$.pipe(
      map(all => all[pokemonId] ?? [])
    );
  }

  isStyleUnlocked(pokemonId: string, styleIndex: number): boolean {
    return (this.unlockedStylesSubject.value[pokemonId] ?? []).includes(styleIndex);
  }

  async toggleStyle(pokemonId: string, styleIndex: number): Promise<void> {
    const current = { ...this.unlockedStylesSubject.value };
    const existing = current[pokemonId] ?? [];
 
    current[pokemonId] = existing.includes(styleIndex)
      ? existing.filter(i => i !== styleIndex)
      : [...existing, styleIndex].sort((a, b) => a - b);
 
    this.persistStyles(current);
 
    if (this.getToken()) {
      await this.pushStylesToRemote(current);
    }
  }

  async toggleAll(pokemonId: string, totalStyles: number): Promise<void> {
    const current = { ...this.unlockedStylesSubject.value };
    const existing = current[pokemonId] ?? [];
    const allUnlocked = existing.length === totalStyles;
    
    current[pokemonId] = allUnlocked
      ? []
      : Array.from({ length: totalStyles }, (_, i) => i);
    
    this.persistStyles(current);
    
    if (this.getToken()) {
      await this.pushStylesToRemote(current);
    }
  }

  public loadStyles(): UnlockedStyles {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : {};
  }
 
  private persistStyles(styles: UnlockedStyles): void {
    localStorage.setItem(this.storageKey, JSON.stringify(styles));
    this.unlockedStylesSubject.next(styles);
  }

  private getToken(): string | null {
    return localStorage.getItem(this.jwt_token);
  }
}
