import { Pipe, PipeTransform } from '@angular/core';

export function transformPhonePtBr(
  value: string | number | null | undefined
): string | null {
  return PhonePtBrPipe.apply(value);
}

@Pipe({ name: 'phonePtBr' })
export class PhonePtBrPipe implements PipeTransform {

  public transform(
    value: string | number | null | undefined
  ): string | null {
    return PhonePtBrPipe.apply(value);
  }

  public static apply(
    value: string | number | null | undefined
  ): string | null {

    value = (value?.toString() ?? '').replace(/ +/, ' ');
    const totalBase = value == ' ' ? 1: value.trimStart().length;

    if (totalBase === 0) {
      return value || null;
    }

    let result = String(value)
      .replace(/\D/g, '')
      .slice(0, 11);

    const total = result.length;

    if (total <= 2) {
      if (totalBase >= 5) {
        return `(${result}) `;
      }

      if (totalBase >= 4) {
        return `(${result})`;
      }

      return `(${result}`;
    }

    if (total <= 6) {
      result = result.replace(/(\d{2})(\d{1,4})/,'($1) $2');
      return totalBase > 9 ? `${result}- ` : result;
    }

    if (total <= 10) {
      return result.replace(/(\d{2})(\d{4})(\d{1,4})/,'($1) $2-$3');
    }

    return result.replace(/(\d{2})(\d{5})(\d{4})/,'($1) $2-$3');
  }
}