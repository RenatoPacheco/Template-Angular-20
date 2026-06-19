import { Pipe, PipeTransform } from '@angular/core';

export function transformTime(value: string | number | null | undefined): string|null {
  return TimePipe.apply(value);
}

@Pipe({ name: 'time' })
export class TimePipe implements PipeTransform {

  public transform(value: string | number | null | undefined): string|null {
    return TimePipe.apply(value);
  }

  public static apply(value: string | number | null | undefined): string|null {

    value = value?.toString()?.trim() || null;

    const totalBase = value?.length || 0;
    if (totalBase === 0) {
      return value;
    }

    let result = String(value)
      .replace(/\D/g, '')
      .slice(0, 16);

    const total = result.length;

    if (total <= 2) {
      result = result.replace(/(\d{1,2})/, '$1');
      return totalBase > 2 ? `${result}:` : result;
    }

    if (total <= 4) {
      result = result.replace(/(\d{2})(\d{1,2})/, '$1:$2');
      return totalBase > 5 ? `${result}:` : result;
    }

    if (total <= 6) {
      result = result.replace(/(\d{2})(\d{2})(\d{1,2})/, '$1:$2:$3');
      return totalBase > 8 ? `${result}.` : result;
    }
    
    return result.replace(/(\d{2})(\d{2})(\d{2})(\d+)/, '$1:$2:$3.$4');
  }
}