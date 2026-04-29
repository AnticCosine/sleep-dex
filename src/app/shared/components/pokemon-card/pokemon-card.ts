import { Component, Input } from '@angular/core';
import { Pokemon } from '../../../models/pokemon.model';
import { CommonModule } from '@angular/common';
import { NumberAbbreviatePipe } from '../../../pipes/number-abbreviate-pipe';
import { StringCapitalisePipe } from '../../../pipes/string-capitalise-pipe';

@Component({
  selector: 'app-pokemon-card',
  imports: [CommonModule, NumberAbbreviatePipe, StringCapitalisePipe],
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.css',
})
export class PokemonCard {

  @Input() pokemon!: Pokemon;
  

  ngOnInit() {
    console.log(this.pokemon)
  }

  get imagePokemonPath(): string {
    return `assets/images/pokemon/${this.pokemon.id}.png`
  }

  get imageBerryPath(): string {
    return `assets/images/berries/${this.pokemon.berry.name}.png`
  }

  imageIngredientPath(ingredientId: string): string {
    console.log(ingredientId)
    return `assets/images/ingredients/${ingredientId}.png`
  }

}
