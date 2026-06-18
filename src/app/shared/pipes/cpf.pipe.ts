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

    const pattern = /^(\d{3}\.){1,2}$|^(\d{3}\.){2}(\d{3}-\d{0,2})$/;
    if (!value || RegExp(pattern).test(value)) {
      return value;
    }

    let result = String(value)
      .replace(/\D/g, '')
      .slice(0, 11);

    const total = result.length;

    if (total <= 3) {
      return result;
    }
    
    if (total <= 6) {
      return result.replace(/(\d{3})(\d{1,2})/, '$1.$2');
    } 
    
    if (total <= 9) {
      return result.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } 
    
    return result.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  }
}