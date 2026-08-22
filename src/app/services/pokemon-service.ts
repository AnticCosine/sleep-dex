import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pokemon, PokemonTypes } from '../models/pokemon.model';
import { environment } from '../../environments/environment';
import { BehaviorSubject, firstValueFrom, map, Observable } from 'rxjs';

type UnlockedStyles = { [pokemonId: string]: number[] };
type UnlockedShinies = { [pokemonId: string]: boolean };

@Injectable({
  providedIn: 'root',
})
export class PokemonService {

  private readonly storageKey = 'unlockedStyles';
  private readonly shinyKey = 'shinyPokemon';
  private readonly jwt_token = 'auth_token';

  private readonly API = environment.apiUrl;

  private unlockedStylesSubject = new BehaviorSubject<UnlockedStyles>(this.loadStyles());
  unlockedStyles$ = this.unlockedStylesSubject.asObservable();

  private unlockedShiniesSubject = new BehaviorSubject<UnlockedShinies>(this.loadShinies());
  unlockedShinies$ = this.unlockedShiniesSubject.asObservable();

  constructor(private http: HttpClient) {
    if (this.getToken()) {
      this.fetchRemoteStyles();
      this.fetchRemoteShinies();
    }
  }

  // sync sleep styles 

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

  // sync shinies 

  private async fetchRemoteShinies(): Promise<void> {
    try {
      const token = this.getToken();
      const headers = { Authorization: `Bearer ${token}` };

      const remote = await firstValueFrom(
        this.http.get<UnlockedShinies>(`${this.API}/user/pokemon/shinies`, { headers })
      );

      if (remote && Object.keys(remote).length > 0) {
        this.persistShinies(remote);
      }

    } catch (err) {
      console.error('Failed to fetch remote shinies:', err);
    }
  }

  private async pushShiniesToRemote(shinies: UnlockedShinies): Promise<void> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    await firstValueFrom(
      this.http.put(`${this.API}/user/pokemon/shinies`, { shinies }, { headers })
    );
  }

  public syncShiniesFromRemote(shinies: UnlockedShinies): void {
    this.persistShinies(shinies);
  }

  getPokemon() {
    return this.http.get<Pokemon[]>('assets/data/pokemon.json');
  }

  GetPokemonTypes() {
    return this.http.get<PokemonTypes[]>('assets/data/pokemon-types.json');
  }

  // sleep styles 

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

  async toggleAll(pokemonId: string, totalStyles: (number | null)[]): Promise<void> {
    const validIndices = totalStyles
      .map((v, i) => (v != null ? i : null))
      .filter((i): i is number => i !== null);

    const current = { ...this.unlockedStylesSubject.value };
    const existing = current[pokemonId] ?? [];
    const allUnlocked = existing.length === validIndices.length;
    
    current[pokemonId] = allUnlocked
      ? []
      : validIndices;
    
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

 // Shinies 

  getUnlockedShinies$(pokemonId: string): Observable<boolean> {
    return this.unlockedShinies$.pipe(
      map(all => all[pokemonId] ?? false)
    );
  }

  isShinyUnlocked(pokemonId: string): boolean {
    return this.unlockedShiniesSubject.value[pokemonId] ?? false;
  }

  async toggleShiny(pokemonId: string): Promise<void> {
    const current = { ...this.unlockedShiniesSubject.value };
    current[pokemonId] = !current[pokemonId];

    this.persistShinies(current);

    if (this.getToken()) {
      await this.pushShiniesToRemote(current);
    }
  }

  public loadShinies(): UnlockedShinies {
    const stored = localStorage.getItem(this.shinyKey);
    return stored ? JSON.parse(stored) : {};
  }

  private persistShinies(shinies: UnlockedShinies): void {
    localStorage.setItem(this.shinyKey, JSON.stringify(shinies));
    this.unlockedShiniesSubject.next(shinies);
  }

  // auth 

  private getToken(): string | null {
    return localStorage.getItem(this.jwt_token);
  }
}
