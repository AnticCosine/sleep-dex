import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Pokemon } from '../../models/pokemon.model';
import { PokemonFilterStateService } from '../../services/pokemon-filter-state-service';
import { PokemonCard } from '../../shared/components/pokemon-card/pokemon-card';
import { PokemonFilters } from '../../shared/components/pokemon-filters/pokemon-filters';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UNAVAILABLE_SHINY_IDS } from '../../constants/unavailable-shinies';

@Component({
  selector: 'app-shiny-finder',
  imports: [PokemonCard, PokemonFilters, CommonModule, ReactiveFormsModule],
  templateUrl: './shiny-finder.html',
  styleUrl: './shiny-finder.css',
})
export class ShinyFinder {

  pokemon$!: Observable<Pokemon[]>;
  
  constructor(public filterState: PokemonFilterStateService) { }

  ngOnInit() {
    this.pokemon$ = this.filterState.filteredPokemon$.pipe(
      map(pokemons => pokemons.filter(p => !UNAVAILABLE_SHINY_IDS.has(p.id)))
    );
  }
}
