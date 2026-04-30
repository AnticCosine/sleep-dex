import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pokemon, PokemonTypes } from '../models/pokemon.model';
import { environment } from '../../environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';

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
    // TODO BE needs to be implemented first 
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
      // TODO
    }
  }

  private loadStyles(): UnlockedStyles {
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
