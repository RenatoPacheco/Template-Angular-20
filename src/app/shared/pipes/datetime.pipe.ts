import { Pipe, PipeTransform } from '@angular/core';

export function transformDateTime(value: string | number | null | undefined): string|null {
  return DateTimePipe.apply(value);
}

@Pipe({ name: 'datetime' })
export class DateTimePipe implements PipeTransform {

  public transform(value: string | number | null | undefined): string|null {
    return DateTimePipe.apply(value);
  }

  public static apply(value: string | number | null | undefined): string|null {

    value = value?.toString()?.trim() || null;

    const totalBase = value?.length || 0;
    if (totalBase === 0) {
      return value;
    }

    let result = String(value)
      .replace(/\D/g, '')
      .slice(0, 24);

    const total = result.length;

    if (total <= 2) {
      return totalBase > 2 ? `${result}/` : result;
    }
    
    if (total <= 4) {
      result = result.replace(/(\d{2})(\d{1,2})/, '$1/$2');
      return totalBase > 5 ? `${result}/` : result;
    }

    if (total <= 8) {
      result = result.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
      return totalBase > 10 ? `${result} ` : result;
    }

    if (total <= 10) {
      result = result.replace(/(\d{2})(\d{2})(\d{4})(\d{1,2})/, '$1/$2/$3 $4');
      return totalBase > 13 ? `${result}:` : result;
    }

    if (total <= 12) {
      result = result.replace(/(\d{2})(\d{2})(\d{4})(\d{2})(\d{1,2})/, '$1/$2/$3 $4:$5');
      return totalBase > 16 ? `${result}:` : result;
    }

    if (total <= 14) {
      result = result.replace(/(\d{2})(\d{2})(\d{4})(\d{2})(\d{2})(\d{1,2})/, '$1/$2/$3 $4:$5:$6');
      return totalBase > 19 ? `${result}.` : result;
    }
    
    return result.replace(/(\d{2})(\d{2})(\d{4})(\d{2})(\d{2})(\d{2})(\d+)/, '$1/$2/$3 $4:$5:$6.$7');
  }
}