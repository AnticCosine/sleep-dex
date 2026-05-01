import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberAbbreviate',
})
export class NumberAbbreviatePipe implements PipeTransform {

  transform(value: number | null | undefined): string {
    if (value == null) return '';

    const absValue = Math.abs(value);

    if (absValue >= 1_000_000_000) {
      return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    }

    if (absValue >= 1_000_000) {
      return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }

    if (absValue >= 1_000) {
      return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    }

    return value.toString();
  }

}
