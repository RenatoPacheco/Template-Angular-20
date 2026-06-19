import { Pipe, PipeTransform } from '@angular/core';

export function transformCpf(value: string | number | null | undefined): string|null {
  return CpfPipe.apply(value);
}

@Pipe({ name: 'cpf' })
export class CpfPipe implements PipeTransform {

  public transform(value: string | number | null | undefined): string|null {
    return CpfPipe.apply(value);
  }

  public static apply(value: string | number | null | undefined): string|null {

    value = value?.toString()?.trim() || null;
    const totalBase = value?.length || 0;

    if (totalBase === 0) {
      return value;
    }

    let result = String(value)
      .replace(/\D/g, '')
      .slice(0, 11);

    const total = result.length;

    if (total <= 3) {
      return totalBase > 3 ? `${result}.` : result;
    }
    
    if (total <= 6) {
      result = result.replace(/(\d{3})(\d{1,2})/, '$1.$2');
      return totalBase > 7 ? `${result}.` : result;
    } 
    
    if (total <= 9) {
      result = result.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
      return totalBase > 11 ? `${result}-` : result;
    } 
    
    return result.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  }
}