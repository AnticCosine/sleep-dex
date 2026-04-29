import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pokemon, PokemonTypes } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {


  constructor(private http: HttpClient) { }

  getPokemon() {
    return this.http.get<Pokemon[]>('assets/data/pokemon.json');
  }

  GetPokemonTypes() {
    return this.http.get<PokemonTypes[]>('assets/data/pokemon-types.json');
  }


}
