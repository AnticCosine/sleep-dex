import { Component } from '@angular/core';
import { PokemonCard } from '../../shared/components/pokemon-card/pokemon-card';
import { PokemonService } from '../../services/pokemon-service';
import { Observable } from 'rxjs';
import { Pokemon } from '../../models/pokemon.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-finder',
  imports: [PokemonCard, CommonModule],
  templateUrl: './pokemon-finder.html',
  styleUrl: './pokemon-finder.css',
})
export class PokemonFinder {

  pokemon$!: Observable<Pokemon[]>;

  constructor(public pokemonService: PokemonService) { }

  ngOnInit() {
    this.pokemon$ = this.pokemonService.getPokemon();
  }

}
