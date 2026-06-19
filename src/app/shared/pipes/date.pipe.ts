import { Pipe, PipeTransform } from '@angular/core';

export function transformDate(value: string | number | null | undefined): string|null {
  return DatePipe.apply(value);
}

@Pipe({ name: 'date' })
export class DatePipe implements PipeTransform {

  public transform(value: string | number | null | undefined): string|null {
    return DatePipe.apply(value);
  }

  public static apply(value: string | number | null | undefined): string|null {

    value = value?.toString()?.trim() || null;

    const totalBase = value?.length || 0;
    if (!value) {
      return value;
    }

    let result = String(value)
      .replace(/\D/g, '')
      .slice(0, 8);

    const total = result.length;

    if (total <= 2) {
      return totalBase > 2 ? `${result}/` : result;
    }
    
    if (total <= 4) {
      result = result.replace(/(\d{2})(\d{1,2})/, '$1/$2');
      return totalBase > 5 ? `${result}/` : result;
    }
    
    return result.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
  }
}