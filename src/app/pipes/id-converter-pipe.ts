import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'idConverter',
})
export class IdConverterPipe implements PipeTransform {
  transform(value: string): string {
    if (typeof value !== 'string') return value;

    return value
      .split('_')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}