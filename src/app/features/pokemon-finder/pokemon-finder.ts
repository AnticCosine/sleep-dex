import { Component } from '@angular/core';
import { PokemonCard } from '../../shared/components/pokemon-card/pokemon-card';
import { PokemonService } from '../../services/pokemon-service';
import { Observable } from 'rxjs';
import { Pokemon } from '../../models/pokemon.model';
import { CommonModule } from '@angular/common';
import { PokemonFilters } from '../../shared/components/pokemon-filters/pokemon-filters';
import { PokemonFilterStateService } from '../../services/pokemon-filter-state-service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pokemon-finder',
  imports: [PokemonCard, PokemonFilters, CommonModule, ReactiveFormsModule],
  templateUrl: './pokemon-finder.html',
  styleUrl: './pokemon-finder.css',
})
export class PokemonFinder {

  pokemon$!: Observable<Pokemon[]>;

  constructor(public filterState: PokemonFilterStateService) { }

  ngOnInit() {
    
  }

}
