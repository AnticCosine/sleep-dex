import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pokemon } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {


  constructor(private http: HttpClient) { }

  getPokemon() {
    return this.http.get<Pokemon[]>('assets/data/pokemon.json');
  }


}
