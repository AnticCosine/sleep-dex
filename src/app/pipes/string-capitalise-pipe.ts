import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringCapitalise',
})
export class StringCapitalisePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (value == null) return '';

    const str = String(value);
    if (!str.length) return '';

    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
