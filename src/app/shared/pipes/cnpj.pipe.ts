import { Pipe, PipeTransform } from '@angular/core';

export function transformCnpj(value: string | number | null | undefined): string|null {
  return CnpjPipe.apply(value);
}

@Pipe({ name: 'cnpj' })
export class CnpjPipe implements PipeTransform {

  public transform(value: string | number | null | undefined): string|null {
    return CnpjPipe.apply(value);    
  }

  public static apply(value: string | number | null | undefined): string|null {   

    value = value?.toString()?.trim() || null;

    const totalBase = value?.length || 0;
    const pattern = /^(\d{2}\.)$|^(\d{2}\.)(\d{3}\.)$|^(\d{2}\.)(\d{3}\.)(\d{3}\/)$|^(\d{2}\.)(\d{3}\.)(\d{3}\/)(\d{4}\-\d{0,2})$/;
    if (!value || RegExp(pattern).test(value)) {
      return value;
    }

    let result = String(value)
      .replace(/\D/g, '')
      .slice(0, 14);

    const total = result.length;

    if (total <= 2) {
      return totalBase > 2 ? `${result}.` : result;
    }
    
    if (total <= 5) {
      result = result.replace(/(.{2})(.{1,3})/, '$1.$2');
      return totalBase > 6 ? `${result}.` : result;
    } 
    
    if (total <= 8) {
      result = result.replace(/(.{2})(.{3})(.{1,3})/, '$1.$2.$3');
      return totalBase > 10 ? `${result}/` : result;
    }
    
    if (total <= 12) {
      result = result.replace(/(.{2})(.{3})(.{3})(.{1,3})/, '$1.$2.$3/$4');
      return totalBase > 15 ? `${result}-` : result;
    }
    
    return result.replace(/(.{2})(.{3})(.{3})(.{4})(.{1,2})/, '$1.$2.$3/$4-$5');
  }
}