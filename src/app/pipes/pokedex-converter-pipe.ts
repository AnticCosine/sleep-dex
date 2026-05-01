import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pokedexConverter',
})
export class PokedexConverterPipe implements PipeTransform {

  transform(value: string): string {
    if (value == null) return '';

    return `#${value.toString().padStart(3, '0')}`;
  }

}
