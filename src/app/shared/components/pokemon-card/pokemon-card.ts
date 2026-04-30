import { Component, Input } from '@angular/core';
import { Pokemon } from '../../../models/pokemon.model';
import { CommonModule } from '@angular/common';
import { NumberAbbreviatePipe } from '../../../pipes/number-abbreviate-pipe';
import { StringCapitalisePipe } from '../../../pipes/string-capitalise-pipe';
import { PokedexConverterPipe } from '../../../pipes/pokedex-converter-pipe';
import { PokemonService } from '../../../services/pokemon-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pokemon-card',
  imports: [CommonModule, NumberAbbreviatePipe, StringCapitalisePipe, PokedexConverterPipe],
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.css',
})
export class PokemonCard {

  @Input() pokemon!: Pokemon;
  
  unlockedStyles$!: Observable<number[]>;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.unlockedStyles$ = this.pokemonService.getUnlockedStyles$(this.pokemon.id);
  }

  isUnlocked(styles: number[] | null, index: number): boolean {
    return (styles ?? []).includes(index);
  }
 
  toggleStyle(index: number) {
    this.pokemonService.toggleStyle(this.pokemon.id, index);
  }

  toggleAll() {
    this.pokemonService.toggleAll(this.pokemon.id, this.pokemon.number_of_sleep_styles);
  }

  get imagePokemonPath(): string {
    return `assets/images/pokemon/${this.pokemon.id}.png`
  }

  get imageBerryPath(): string {
    return `assets/images/berries/${this.pokemon.berry.name}.png`
  }

  imageIngredientPath(ingredientId: string): string {
    return `assets/images/ingredients/${ingredientId}.png`
  }

  imageTypePath(type: string): string {
    return `assets/images/pokemon-types/${type}.png`
  }

}
